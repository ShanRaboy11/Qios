import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { MenuItemData } from "@/components/organisms/MenuCatalog";

type TenantCategoryRow = {
  id: string;
  name: string;
  display_order: number | null;
};

type TenantMenuItemRow = {
  id: string;
  category_id: string;
  name: string;
  price: string | number;
  is_available: boolean;
  image_url: string | null;
};

export async function fetchTenantCustomerMenu(tenantId: string) {
  const supabase = createSupabaseAdminClient();

  const [categoriesResult, itemsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, display_order, icon")
      .eq("tenant_id", tenantId)
      .order("display_order", { ascending: true }),
    supabase
      .from("menu_items")
      .select("id, category_id, name, price, is_available, image_url")
      .eq("tenant_id", tenantId)
      .eq("is_available", true)
      .order("created_at", { ascending: true }),
  ]);

  if (categoriesResult.error) {
    throw new Error(categoriesResult.error.message);
  }

  if (itemsResult.error) {
    throw new Error(itemsResult.error.message);
  }

  const dbCategories = categoriesResult.data ?? [];
  const categories = dbCategories.map((c: any) => ({
    id: c.id,
    name: c.name,
    icon: c.icon || "flame",
  }));

  const categoryNameById = new Map(
    dbCategories.map((category: any) => [category.id, category.name]),
  );

  const items = (itemsResult.data ?? []).map((item: TenantMenuItemRow) => ({
    id: item.id,
    name: item.name,
    price: Number(item.price) || 0,
    available: item.is_available,
    category: categoryNameById.get(item.category_id) || "Meal",
    imageUrl: item.image_url || "/images/food-placeholder.png",
  })) satisfies MenuItemData[];

  return { categories, items };
}