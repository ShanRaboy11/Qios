import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type InventoryModeUI = "unit" | "measurement";
type InventoryModeDb = "unit" | "recipe" | "measurement";

const MEASUREMENT_UNITS = new Set([
  "kg",
  "g",
  "mg",
  "lb",
  "oz",
  "l",
  "ml",
  "gal",
  "pt",
]);

const UNIT_UNITS = new Set([
  "pcs",
  "pieces",
  "piece",
  "boxes",
  "box",
  "bottles",
  "bottle",
  "cans",
  "can",
  "packs",
  "pack",
  "slices",
  "slice",
  "dozens",
  "dozen",
]);

export interface InventoryItem {
  id: string;
  name: string;
  unit_type: string;
  inventory_mode: InventoryModeUI;
  current_stock: number;
  low_stock_threshold: number;
  critical_stock_threshold: number;
  created_at: string;
  updated_at: string;
}

interface InventoryItemRow extends Omit<InventoryItem, "inventory_mode"> {
  inventory_mode: InventoryModeDb;
}

export const useInventoryManagement = () => {
  const supabase = createSupabaseBrowserClient();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Audit logging helper — posts to the server-side log endpoint (non-fatal)
  // ---------------------------------------------------------------------------
  const logAuditEvent = async (payload: {
    actionType: "CREATE" | "UPDATE" | "DELETE";
    description: string;
    targetId?: string;
    targetName?: string;
    metadata?: Record<string, unknown>;
    tenantId: string;
  }) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      await fetch(`/api/tenants/${payload.tenantId}/audit-logs/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          actionType: payload.actionType,
          description: payload.description,
          targetType: "inventory",
          targetId: payload.targetId,
          targetName: payload.targetName,
          metadata: payload.metadata,
        }),
      });
    } catch {
      // Non-fatal — never block primary operation
    }
  };

  const toUiInventoryMode = (mode: InventoryModeDb): InventoryModeUI =>
    mode === "unit" ? "unit" : "measurement";

  const toDbInventoryMode = (mode: InventoryModeUI): InventoryModeDb =>
    mode === "measurement" ? "recipe" : "unit";

  const inferInventoryModeFromUnit = (
    unitType: string | undefined,
    fallback: InventoryModeUI = "unit",
  ): InventoryModeUI => {
    const normalizedUnit = unitType?.trim().toLowerCase();

    if (!normalizedUnit) {
      return fallback;
    }

    if (MEASUREMENT_UNITS.has(normalizedUnit)) {
      return "measurement";
    }

    if (UNIT_UNITS.has(normalizedUnit)) {
      return "unit";
    }

    if (
      /^(?:\d+(?:\.\d+)?\s*)?(kg|g|mg|lb|oz|l|ml|gal|pt)$/.test(normalizedUnit)
    ) {
      return "measurement";
    }

    return fallback;
  };

  const mapRowToItem = (row: InventoryItemRow): InventoryItem => ({
    ...row,
    inventory_mode: toUiInventoryMode(row.inventory_mode),
  });

  const isInventoryModeEnumError = (error: unknown, value: string) => {
    const message = getErrorMessage(error, "").toLowerCase();
    return (
      message.includes("inventory_mode_enum") &&
      message.includes(`\"${value.toLowerCase()}\"`)
    );
  };

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
        setItems(((data ?? []) as InventoryItemRow[]).map(mapRowToItem));
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
      const inferredInventoryMode = inferInventoryModeFromUnit(
        draft.unit_type,
        draft.inventory_mode ?? "unit",
      );

      const payload = {
        name: draft.name,
        unit_type: draft.unit_type,
        inventory_mode: toDbInventoryMode(inferredInventoryMode),
        current_stock: draft.current_stock,
        low_stock_threshold: draft.low_stock_threshold,
        critical_stock_threshold: draft.critical_stock_threshold,
      };

      if (isNew) {
        let { data, error } = await supabase
          .from("inventory_items")
          .insert({
            ...payload,
            tenant_id: tenantId,
          })
          .select()
          .single();

        // Backward compatibility: older DBs may still use 'measurement' instead of 'recipe'.
        if (
          error &&
          inferredInventoryMode === "measurement" &&
          isInventoryModeEnumError(error, "recipe")
        ) {
          const retryResult = await supabase
            .from("inventory_items")
            .insert({
              ...payload,
              inventory_mode: "measurement",
              tenant_id: tenantId,
            })
            .select()
            .single();
          data = retryResult.data;
          error = retryResult.error;
        }

        if (error) throw error;
        const mapped = mapRowToItem(data as InventoryItemRow);
        setItems((prev) => [...prev, mapped]);
        void logAuditEvent({
          tenantId,
          actionType: "CREATE",
          description: `Added inventory item: ${mapped.name}`,
          targetId: mapped.id,
          targetName: mapped.name,
          metadata: { unit_type: mapped.unit_type, current_stock: mapped.current_stock },
        });
        return { item: mapped, error: null as string | null };
      } else {
        if (!draft.id) throw new Error("Missing id for update");
        let { data, error } = await supabase
          .from("inventory_items")
          .update(payload)
          .eq("tenant_id", tenantId)
          .eq("id", draft.id)
          .select()
          .single();

        if (
          error &&
          inferredInventoryMode === "measurement" &&
          isInventoryModeEnumError(error, "recipe")
        ) {
          const retryResult = await supabase
            .from("inventory_items")
            .update({
              ...payload,
              inventory_mode: "measurement",
            })
            .eq("tenant_id", tenantId)
            .eq("id", draft.id)
            .select()
            .single();
          data = retryResult.data;
          error = retryResult.error;
        }

        if (error) throw error;
        const mapped = mapRowToItem(data as InventoryItemRow);
        setItems((prev) => prev.map((i) => (i.id === draft.id ? mapped : i)));
        void logAuditEvent({
          tenantId,
          actionType: "UPDATE",
          description: `Updated inventory item: ${mapped.name}`,
          targetId: mapped.id,
          targetName: mapped.name,
          metadata: { unit_type: mapped.unit_type, current_stock: mapped.current_stock },
        });
        return { item: mapped, error: null as string | null };
      }
    } catch (e) {
      const message = getErrorMessage(e, "Failed to save inventory item.");
      setActionError(message);
      console.error(e);
      return { item: null, error: message };
    }
  };

  const deleteItem = async (id: string) => {
    setActionError(null);
    try {
      const tenantId = await getCurrentTenantId();
      const deletedItem = items.find((i) => i.id === id);
      const { error } = await supabase
        .from("inventory_items")
        .delete()
        .eq("tenant_id", tenantId)
        .eq("id", id);

      if (error) throw error;
      setItems((prev) => prev.filter((i) => i.id !== id));
      void logAuditEvent({
        tenantId,
        actionType: "DELETE",
        description: `Deleted inventory item: ${deletedItem?.name ?? id}`,
        targetId: id,
        targetName: deletedItem?.name,
        metadata: { unit_type: deletedItem?.unit_type },
      });
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
