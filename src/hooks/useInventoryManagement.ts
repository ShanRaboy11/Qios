import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export interface InventoryItem {
  id: string;
  name: string;
  unit_type: string;
  inventory_mode: "unit" | "measurement";
  current_stock: number;
  low_stock_threshold: number;
  critical_stock_threshold: number;
  created_at: string;
  updated_at: string;
}

export const useInventoryManagement = () => {
  const supabase = createSupabaseBrowserClient();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error && typeof error === "object" && "message" in error) {
      return String((error as { message: unknown }).message);
    }
    return fallback;
  };

  const getCurrentTenantId = async (): Promise<string> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const jwtTenantId = (session?.user?.app_metadata?.tenant_id ||
      session?.user?.user_metadata?.tenant_id) as string | undefined;
    if (jwtTenantId) return jwtTenantId;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("No authenticated user found.");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.tenant_id) {
      throw new Error("Unable to resolve tenant context for this account.");
    }

    return profile.tenant_id;
  };

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      try {
        const tenantId = await getCurrentTenantId();
        const { data, error } = await supabase
          .from("inventory_items")
          .select("*")
          .eq("tenant_id", tenantId)
          .order("name");

        if (error) throw error;
        setItems(data as InventoryItem[]);
      } catch (err) {
        console.error("Error fetching inventory data:", err);
        setActionError(getErrorMessage(err, "Failed to fetch inventory"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, [supabase]);

  const saveItem = async (draft: Partial<InventoryItem>, isNew: boolean) => {
    setActionError(null);
    try {
      const tenantId = await getCurrentTenantId();
      
      const payload = {
        name: draft.name,
        unit_type: draft.unit_type,
        inventory_mode: draft.inventory_mode,
        current_stock: draft.current_stock,
        low_stock_threshold: draft.low_stock_threshold,
        critical_stock_threshold: draft.critical_stock_threshold,
      };

      if (isNew) {
        const { data, error } = await supabase
          .from("inventory_items")
          .insert({
            ...payload,
            tenant_id: tenantId,
          })
          .select()
          .single();
          
        if (error) throw error;
        setItems((prev) => [...prev, data as InventoryItem]);
        return data as InventoryItem;
      } else {
        if (!draft.id) throw new Error("Missing id for update");
        const { data, error } = await supabase
          .from("inventory_items")
          .update(payload)
          .eq("tenant_id", tenantId)
          .eq("id", draft.id)
          .select()
          .single();

        if (error) throw error;
        setItems((prev) => prev.map((i) => (i.id === draft.id ? (data as InventoryItem) : i)));
        return data as InventoryItem;
      }
    } catch (e) {
      setActionError(getErrorMessage(e, "Failed to save inventory item."));
      console.error(e);
      return null;
    }
  };

  const deleteItem = async (id: string) => {
    setActionError(null);
    try {
      const tenantId = await getCurrentTenantId();
      const { error } = await supabase
        .from("inventory_items")
        .delete()
        .eq("tenant_id", tenantId)
        .eq("id", id);
        
      if (error) throw error;
      setItems((prev) => prev.filter((i) => i.id !== id));
      return true;
    } catch (e) {
      setActionError(getErrorMessage(e, "Failed to delete inventory item."));
      console.error(e);
      return false;
    }
  };

  return {
    items,
    isLoading,
    actionError,
    saveItem,
    deleteItem,
  };
};
