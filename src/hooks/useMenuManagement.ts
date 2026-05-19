import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Define your types mirroring the component's types
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
}

export const useMenuManagement = () => {
  const supabase = createSupabaseBrowserClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
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

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [catsRes, itemsRes] = await Promise.all([
          supabase.from("categories").select("*").order("display_order"),
          supabase.from("menu_items").select("*"),
        ]);

        if (catsRes.error) throw catsRes.error;
        if (itemsRes.error) throw itemsRes.error;

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
        return newCat;
      } else {
        if (!catDraft.id) {
          throw new Error("Missing category id for update.");
        }

        const { data, error } = await supabase
          .from("categories")
          .update({ name: catDraft.name, icon: catDraft.icon })
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
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setItems((prev) => prev.filter((i) => i.categoryId !== id));
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

        const newItem: MenuItem = { ...draftItem, id: data.id };
        setItems((prev) => [...prev, newItem]);
        return newItem;
      } else {
        const { data, error } = await supabase
          .from("menu_items")
          .update(payload)
          .eq("id", draftItem.id)
          .select()
          .single();

        if (error) throw error;
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
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .in("id", ids);
      if (error) throw error;
      setItems((prev) => prev.filter((i) => !ids.includes(i.id)));
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
      const { error } = await supabase
        .from("menu_items")
        .update({ is_available: !currentAvailability })
        .eq("id", id);
      if (error) throw error;
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, isAvailable: !currentAvailability } : i,
        ),
      );
    } catch (e) {
      setActionError(getErrorMessage(e, "Failed to update item availability."));
      console.error(e);
    }
  };

  const updateCategoryOrder = async (newCategories: Category[]) => {
    setActionError(null);
    setCategories(newCategories);
    try {
      const updates = newCategories.map((c, index) => ({
        id: c.id,
        display_order: index,
      }));
      // Using an upsert or running updates in parallel
      await Promise.all(
        updates.map((u) =>
          supabase
            .from("categories")
            .update({ display_order: u.display_order })
            .eq("id", u.id),
        ),
      );
    } catch (e) {
      setActionError(getErrorMessage(e, "Failed to reorder categories."));
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
