import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { MenuItemData, MenuItemModifierGroup } from "@/components/organisms/MenuCatalog";
import type { TenantBrandingSettingsData } from "@/app/(tenant)/[id]/settings/types";

function readStr(settings: Record<string, unknown> | null, keys: string[]): string {
  if (!settings) return "";
  for (const key of keys) {
    const v = settings[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

export async function fetchTenantCustomerMenu(tenantId: string) {
  const supabase = createSupabaseAdminClient();

  const [categoriesResult, itemsResult, tenantResult] = await Promise.all([
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
    supabase
      .from("tenants")
      .select("business_name, settings")
      .eq("id", tenantId)
      .maybeSingle(),
  ]);

  if (categoriesResult.error) throw new Error(categoriesResult.error.message);
  if (itemsResult.error) throw new Error(itemsResult.error.message);

  const dbCategories = categoriesResult.data ?? [];
  const dbItems = itemsResult.data ?? [];

  const categories = dbCategories.map((c: any) => ({
    id: c.id,
    name: c.name,
    icon: c.icon || "flame",
  }));

  const categoryNameById = new Map(
    dbCategories.map((c: any) => [c.id, c.name]),
  );

  // fetch modifier groups and their options for all returned menu items in one query
  const menuItemIds = dbItems.map((i: any) => i.id);
  let modifierGroupsByItemId = new Map<string, MenuItemModifierGroup[]>();

  if (menuItemIds.length > 0) {
    const { data: groups, error: groupsError } = await supabase
      .from("modifier_groups")
      .select("id, menu_item_id, name, is_required, min_selections, max_selections, display_order")
      .eq("tenant_id", tenantId)
      .in("menu_item_id", menuItemIds)
      .order("display_order", { ascending: true });

    if (groupsError) throw new Error(groupsError.message);

    const groupIds = (groups ?? []).map((g: any) => g.id);

    let optionsByGroupId = new Map<string, any[]>();

    if (groupIds.length > 0) {
      const { data: options, error: optionsError } = await supabase
        .from("modifier_options")
        .select("id, modifier_group_id, name, additional_price, is_available, display_order")
        .eq("tenant_id", tenantId)
        .in("modifier_group_id", groupIds)
        .eq("is_available", true)
        .order("display_order", { ascending: true });

      if (optionsError) throw new Error(optionsError.message);

      for (const opt of options ?? []) {
        if (!optionsByGroupId.has(opt.modifier_group_id)) {
          optionsByGroupId.set(opt.modifier_group_id, []);
        }
        optionsByGroupId.get(opt.modifier_group_id)!.push(opt);
      }
    }

    for (const group of groups ?? []) {
      const mappedGroup: MenuItemModifierGroup = {
        id: group.id,
        name: group.name,
        isRequired: group.is_required,
        minSelections: group.min_selections,
        maxSelections: group.max_selections,
        options: (optionsByGroupId.get(group.id) ?? []).map((o: any) => ({
          id: o.id,
          name: o.name,
          additionalPrice: Number(o.additional_price) || 0,
          isAvailable: o.is_available,
        })),
      };

      if (!modifierGroupsByItemId.has(group.menu_item_id)) {
        modifierGroupsByItemId.set(group.menu_item_id, []);
      }
      modifierGroupsByItemId.get(group.menu_item_id)!.push(mappedGroup);
    }
  }

  const items = dbItems.map((item: any) => ({
    id: item.id,
    name: item.name,
    price: Number(item.price) || 0,
    available: item.is_available,
    category: categoryNameById.get(item.category_id) || "Meal",
    imageUrl: item.image_url || "/images/food-placeholder.png",
    modifierGroups: modifierGroupsByItemId.get(item.id) ?? [],
  })) satisfies MenuItemData[];

  // fetch currency
  const { data: platformSettings } = await supabase
    .from("platform_settings")
    .select("default_currency")
    .eq("id", 1)
    .single();

  const currency = platformSettings?.default_currency || "PHP";

  // calculate guest number (orders today + 1)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count: ordersCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .gte("created_at", today.toISOString());

  const guestNumber = (ordersCount || 0) + 1;

  // Extract branding from tenant settings JSON
  const tenantSettings =
    tenantResult.data?.settings &&
    typeof tenantResult.data.settings === "object"
      ? (tenantResult.data.settings as Record<string, unknown>)
      : null;

  const branding: Partial<TenantBrandingSettingsData> = {
    primaryColor:
      readStr(tenantSettings, ["branding_primary_color", "primary_color", "primaryColor"]) ||
      "#FFC670",
    secondaryColor:
      readStr(tenantSettings, ["branding_secondary_color", "secondary_color", "secondaryColor"]) ||
      "#FFF9F0",
    accentColor:
      readStr(tenantSettings, ["branding_accent_color", "accent_color", "accentColor"]) ||
      "#1E3932",
    fontFamily:
      readStr(tenantSettings, ["branding_font_family", "font_family", "fontFamily"]) || "inter",
    secondaryFont:
      readStr(tenantSettings, ["branding_secondary_font", "secondary_font", "secondaryFont"]) ||
      "inter",
    menuLayout:
      readStr(tenantSettings, ["branding_menu_layout", "menu_layout", "menuLayout"]) || "grid",
    dashboardLogoUrl:
      readStr(tenantSettings, ["branding_logo_dashboard"]) || undefined,
  };

  return {
    categories,
    items,
    currency,
    guestNumber,
    branding,
    storeName: tenantResult.data?.business_name || "",
  };
}