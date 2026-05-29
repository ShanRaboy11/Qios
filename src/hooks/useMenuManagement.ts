import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// define your types mirroring the component's types
export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Addon {
  id: string;
  itemId: string;
  name: string;
  description: string;
  price: string;
}

export interface Size {
  id: string;
  name: string;
  description: string;
  price: string;
}

export interface RecipeIngredient {
  inventory_item_id: string;
  quantity_required: number;
  name?: string;
  unit_type?: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: string;
  isAvailable: boolean;
  addonsEnabled: boolean;
  addons: Addon[];
  sizes: Size[];
  image?: string;
  recipe?: RecipeIngredient[];
}

export const useMenuManagement = () => {
  const supabase = createSupabaseBrowserClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Audit logging helper — posts to the server-side log endpoint (non-fatal)
  // ---------------------------------------------------------------------------
  const logAuditEvent = async (payload: {
    actionType: "CREATE" | "UPDATE" | "DELETE";
    description: string;
    targetType: "menu";
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
          targetType: payload.targetType,
          targetId: payload.targetId,
          targetName: payload.targetName,
          metadata: payload.metadata,
        }),
      });
    } catch {
      // Non-fatal — never block primary operation
    }
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

  // fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const tenantId = await getCurrentTenantId();

        const [catsRes, itemsRes, recipeRes] = await Promise.all([
          supabase
            .from("categories")
            .select("*")
            .eq("tenant_id", tenantId)
            .order("display_order"),
          supabase.from("menu_items").select("*").eq("tenant_id", tenantId),
          supabase.from("recipe_matrix").select("menu_item_id, inventory_item_id, quantity_required, inventory_items(name, unit_type)").eq("tenant_id", tenantId),
        ]);

        if (catsRes.error) throw catsRes.error;
        if (itemsRes.error) throw itemsRes.error;
        if (recipeRes.error) throw recipeRes.error;

        const recipesByMenuItem = recipeRes.data?.reduce((acc: any, row: any) => {
          if (!acc[row.menu_item_id]) acc[row.menu_item_id] = [];
          acc[row.menu_item_id].push({
            inventory_item_id: row.inventory_item_id,
            quantity_required: row.quantity_required,
            name: row.inventory_items?.name,
            unit_type: row.inventory_items?.unit_type,
          });
          return acc;
        }, {});

        setCategories(
          catsRes.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            icon: c.icon || "flame",
          })),
        );

        setItems(
          itemsRes.data.map((i: any) => ({
            id: i.id,
            categoryId: i.category_id,
            name: i.name,
            description: i.description || "",
            price: i.price.toString(),
            isAvailable: i.is_available,
            addonsEnabled: i.addons_enabled || false,
            addons:
              typeof i.addons === "string"
                ? JSON.parse(i.addons)
                : i.addons || [],
            sizes:
              typeof i.sizes === "string" ? JSON.parse(i.sizes) : i.sizes || [],
            image: i.image_url || undefined,
            recipe: recipesByMenuItem?.[i.id] || [],
          })),
        );
      } catch (err) {
        console.error("Error fetching menu data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [supabase]);

  const saveCategory = async (catDraft: Partial<Category>, isNew: boolean) => {
    setActionError(null);
    try {
      if (isNew) {
        const tenant_id = await getCurrentTenantId();

        const { data: lastCategory, error: lastCategoryError } = await supabase
          .from("categories")
          .select("display_order")
          .eq("tenant_id", tenant_id)
          .order("display_order", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (lastCategoryError) throw lastCategoryError;

        const nextDisplayOrder = (lastCategory?.display_order ?? -1) + 1;

        const { data, error } = await supabase
          .from("categories")
          .insert({
            name: catDraft.name,
            icon: catDraft.icon || "flame",
            tenant_id,
            display_order: nextDisplayOrder,
          })
          .select()
          .single();

        if (error) throw error;
        const newCat: Category = {
          id: data.id,
          name: data.name,
          icon: data.icon,
        };
        setCategories((prev) => [...prev, newCat]);
        void logAuditEvent({
          tenantId: tenant_id,
          actionType: "CREATE",
          description: `Added menu category: ${data.name}`,
          targetType: "menu",
          targetId: data.id,
          targetName: data.name,
          metadata: { entityType: "category" },
        });
        return newCat;
      } else {
        if (!catDraft.id) {
          throw new Error("Missing category id for update.");
        }

        const tenant_id = await getCurrentTenantId();

        const { data, error } = await supabase
          .from("categories")
          .update({ name: catDraft.name, icon: catDraft.icon })
          .eq("tenant_id", tenant_id)
          .eq("id", catDraft.id)
          .select()
          .single();

        if (error) throw error;
        setCategories((prev) =>
          prev.map((c) =>
            c.id === catDraft.id
              ? { ...c, name: data.name, icon: data.icon }
              : c,
          ),
        );
        void logAuditEvent({
          tenantId: tenant_id,
          actionType: "UPDATE",
          description: `Updated menu category: ${data.name}`,
          targetType: "menu",
          targetId: data.id,
          targetName: data.name,
          metadata: { entityType: "category" },
        });
        return { id: data.id, name: data.name, icon: data.icon } as Category;
      }
    } catch (e) {
      setActionError(getErrorMessage(e, "Failed to save category."));
      console.error(e);
      return null;
    }
  };

  const deleteCategory = async (id: string) => {
    setActionError(null);
    try {
      const tenant_id = await getCurrentTenantId();
      const deletedCat = categories.find((c) => c.id === id);
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("tenant_id", tenant_id)
        .eq("id", id);
      if (error) throw error;
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setItems((prev) => prev.filter((i) => i.categoryId !== id));
      void logAuditEvent({
        tenantId: tenant_id,
        actionType: "DELETE",
        description: `Deleted menu category: ${deletedCat?.name ?? id}`,
        targetType: "menu",
        targetId: id,
        targetName: deletedCat?.name,
        metadata: { entityType: "category" },
      });
      return true;
    } catch (e) {
      setActionError(getErrorMessage(e, "Failed to delete category."));
      console.error(e);
      return false;
    }
  };

  const saveItem = async (draftItem: MenuItem) => {
    setActionError(null);
    try {
      const isNew = draftItem.id.startsWith("item_");

      const payload = {
        category_id: draftItem.categoryId,
        name: draftItem.name,
        description: draftItem.description,
        price: parseFloat(draftItem.price || "0"),
        is_available: draftItem.isAvailable,
        addons_enabled: draftItem.addonsEnabled,
        addons: draftItem.addons,
        sizes: draftItem.sizes,
        image_url: draftItem.image,
      };

      if (isNew) {
        const tenant_id = await getCurrentTenantId();
        const { data, error } = await supabase
          .from("menu_items")
          .insert({
            ...payload,
            tenant_id,
          })
          .select()
          .single();

        if (error) throw error;
        
        const itemId = data.id;
        
        if (draftItem.recipe !== undefined) {
          const { error: deleteError } = await supabase.from("recipe_matrix").delete().eq("tenant_id", tenant_id).eq("menu_item_id", itemId);
          if (deleteError) throw deleteError;
          
          if (draftItem.recipe.length > 0) {
            const recipePayload = draftItem.recipe.map(r => ({
              tenant_id,
              menu_item_id: itemId,
              inventory_item_id: r.inventory_item_id,
              quantity_required: r.quantity_required,
            }));
            const { error: insertError } = await supabase.from("recipe_matrix").insert(recipePayload);
            if (insertError) throw insertError;
          }
        }

        const newItem: MenuItem = { ...draftItem, id: itemId };
        setItems((prev) => [...prev, newItem]);
        void logAuditEvent({
          tenantId: tenant_id,
          actionType: "CREATE",
          description: `Added menu item: ${draftItem.name}`,
          targetType: "menu",
          targetId: itemId,
          targetName: draftItem.name,
          metadata: { entityType: "menu_item", price: draftItem.price },
        });
        return newItem;
      } else {
        const tenant_id = await getCurrentTenantId();
        const { data, error } = await supabase
          .from("menu_items")
          .update(payload)
          .eq("tenant_id", tenant_id)
          .eq("id", draftItem.id)
          .select()
          .single();

        if (error) throw error;
        
        const itemId = data.id;
        if (draftItem.recipe !== undefined) {
          const { error: deleteError } = await supabase.from("recipe_matrix").delete().eq("tenant_id", tenant_id).eq("menu_item_id", itemId);
          if (deleteError) throw deleteError;
          
          if (draftItem.recipe.length > 0) {
            const recipePayload = draftItem.recipe.map(r => ({
              tenant_id,
              menu_item_id: itemId,
              inventory_item_id: r.inventory_item_id,
              quantity_required: r.quantity_required,
            }));
            const { error: insertError } = await supabase.from("recipe_matrix").insert(recipePayload);
            if (insertError) throw insertError;
          }
        }

        setItems((prev) =>
          prev.map((i) =>
            i.id === draftItem.id
              ? {
                  ...draftItem,
                  id: data.id,
                  categoryId: data.category_id,
                  image: data.image_url || undefined,
                }
              : i,
          ),
        );
        void logAuditEvent({
          tenantId: tenant_id,
          actionType: "UPDATE",
          description: `Updated menu item: ${draftItem.name}`,
          targetType: "menu",
          targetId: itemId,
          targetName: draftItem.name,
          metadata: { entityType: "menu_item", price: draftItem.price },
        });
        return draftItem;
      }
    } catch (e) {
      setActionError(getErrorMessage(e, "Failed to save menu item."));
      console.error(e);
      return null;
    }
  };

  const deleteItems = async (ids: string[]) => {
    setActionError(null);
    try {
      const tenant_id = await getCurrentTenantId();
      const deletedItems = items.filter((i) => ids.includes(i.id));
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("tenant_id", tenant_id)
        .in("id", ids);
      if (error) throw error;
      setItems((prev) => prev.filter((i) => !ids.includes(i.id)));
      const names = deletedItems.map((i) => i.name).join(", ");
      void logAuditEvent({
        tenantId: tenant_id,
        actionType: "DELETE",
        description: `Deleted menu item${ids.length > 1 ? "s" : ""}: ${names}`,
        targetType: "menu",
        targetId: ids[0],
        targetName: names,
        metadata: { entityType: "menu_item", deletedIds: ids },
      });
      return true;
    } catch (e) {
      setActionError(getErrorMessage(e, "Failed to delete menu item(s)."));
      console.error(e);
      return false;
    }
  };

  const toggleAvailability = async (
    id: string,
    currentAvailability: boolean,
  ) => {
    setActionError(null);
    try {
      const tenant_id = await getCurrentTenantId();
      const targetItem = items.find((i) => i.id === id);
      const { error } = await supabase
        .from("menu_items")
        .update({ is_available: !currentAvailability })
        .eq("tenant_id", tenant_id)
        .eq("id", id);
      if (error) throw error;
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, isAvailable: !currentAvailability } : i,
        ),
      );
      void logAuditEvent({
        tenantId: tenant_id,
        actionType: "UPDATE",
        description: `Set menu item "${targetItem?.name ?? id}" availability to ${!currentAvailability ? "available" : "unavailable"}`,
        targetType: "menu",
        targetId: id,
        targetName: targetItem?.name,
        metadata: { entityType: "menu_item", is_available: !currentAvailability },
      });
    } catch (e) {
      setActionError(getErrorMessage(e, "Failed to update item availability."));
      console.error(e);
    }
  };

  const updateCategoryOrder = async (newCategories: Category[]) => {
    setActionError(null);
    const previousCategories = categories;
    setCategories(newCategories);
    try {
      const tenant_id = await getCurrentTenantId();

      // two-phase update avoids transient unique-key collisions when swapping positions.
      const tempUpdates = newCategories.map((c, index) => ({
        id: c.id,
        display_order: -1000 - index,
      }));

      for (const update of tempUpdates) {
        const { error } = await supabase
          .from("categories")
          .update({ display_order: update.display_order })
          .eq("tenant_id", tenant_id)
          .eq("id", update.id);

        if (error) throw error;
      }

      const finalUpdates = newCategories.map((c, index) => ({
        id: c.id,
        display_order: index,
      }));

      for (const update of finalUpdates) {
        const { error } = await supabase
          .from("categories")
          .update({ display_order: update.display_order })
          .eq("tenant_id", tenant_id)
          .eq("id", update.id);

        if (error) throw error;
      }
    } catch (e) {
      setActionError(getErrorMessage(e, "Failed to reorder categories."));
      setCategories(previousCategories);
      console.error(e);
    }
  };

  const uploadImage = async (file: File | Blob, path: string) => {
    setActionError(null);
    try {
      const { error } = await supabase.storage
        .from("menu-images")
        .upload(path, file, { upsert: true });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("menu-images")
        .getPublicUrl(path);
      return publicUrlData.publicUrl;
    } catch (e) {
      setActionError(getErrorMessage(e, "Failed to upload image."));
      console.error(e);
      return null;
    }
  };

  return {
    categories,
    items,
    isLoading,
    actionError,
    saveCategory,
    deleteCategory,
    saveItem,
    deleteItems,
    toggleAvailability,
    updateCategoryOrder,
    uploadImage,
  };
};
