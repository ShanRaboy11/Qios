import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  formatManilaDate,
  formatManilaTime,
  getManilaDateKey,
  getPeriodRange,
  trendPercent,
  type SalesPeriod,
} from "@/lib/salesDashboard";

type OrderItemRow = {
  id: string;
  quantity: number;
  unit_price: number | string | null;
  menu_items?: {
    id: string;
    name: string;
    category_id: string;
  } | null;
};

type OrderRow = {
  id: string;
  qr_hash: string | null;
  status: string;
  payment_status: string;
  payment_method: string | null;
  total_price: number | string;
  created_at: string;
  table_number: string | null;
  order_items?: OrderItemRow[] | null;
};

async function requireTenantAccess(tenantId: string) {
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, status: 401, message: "Unauthorized" };
  }

  const { data: profile, error } = await admin
    .from("profiles")
    .select("role, tenant_id")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    return { ok: false as const, status: 403, message: "Profile not found" };
  }

  if (profile.role !== "super_admin" && profile.tenant_id !== tenantId) {
    return { ok: false as const, status: 403, message: "Unauthorized" };
  }

  return { ok: true as const, admin };
}

function parsePeriod(value: string | null): SalesPeriod {
  if (value === "today" || value === "week" || value === "month") {
    return value;
  }

  return "month";
}

function toNumber(value: number | string | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function aggregateMoney(orders: OrderRow[], predicate?: (order: OrderRow) => boolean) {
  return orders.reduce((sum, order) => {
    if (predicate && !predicate(order)) {
      return sum;
    }

    return sum + toNumber(order.total_price);
  }, 0);
}

function buildSeries(orders: OrderRow[], period: SalesPeriod, startIso: string, endIso: string) {
  if (period === "today") {
    const slots = Array.from({ length: 24 }, (_, hour) => ({
      label: new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Manila",
        hour: "numeric",
        hour12: true,
      }).format(new Date(`2026-01-01T${String(hour).padStart(2, "0")}:00:00+08:00`)),
      sales: 0,
      orders: 0,
    }));

    for (const order of orders) {
      const hour = Number(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          hour12: false,
        }).format(new Date(order.created_at)),
      );

      const slot = slots[hour];
      if (slot) {
        slot.sales += toNumber(order.total_price);
        slot.orders += 1;
      }
    }

    return slots;
  }

  const labels: Array<{ key: string; label: string; sales: number; orders: number }> = [];
  const cursor = new Date(startIso);
  const end = new Date(endIso);

  while (cursor <= end) {
    const key = getManilaDateKey(cursor);
    labels.push({
      key,
      label: new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Manila",
        month: "short",
        day: "numeric",
      }).format(cursor),
      sales: 0,
      orders: 0,
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  for (const order of orders) {
    const slot = labels.find((item) => item.key === getManilaDateKey(order.created_at));
    if (slot) {
      slot.sales += toNumber(order.total_price);
      slot.orders += 1;
    }
  }

  return labels.map(({ label, sales, orders }) => ({ label, sales, orders }));
}

function buildTopItems(
  currentOrders: OrderRow[],
  previousOrders: OrderRow[],
  categoryMap: Map<string, string>,
) {
  const current = new Map<string, { name: string; category: string; sales: number; revenue: number }>();
  const previous = new Map<string, { sales: number; revenue: number }>();

  const accumulate = (
    target: Map<string, { name?: string; category?: string; sales: number; revenue: number }>,
    orders: OrderRow[],
  ) => {
    for (const order of orders) {
      if (order.payment_status !== "paid") {
        continue;
      }

      for (const item of order.order_items ?? []) {
        const menuItem = item.menu_items;
        if (!menuItem?.id) {
          continue;
        }

        const sales = Number(item.quantity ?? 0);
        const revenue = sales * toNumber(item.unit_price);
        const category = categoryMap.get(menuItem.category_id) ?? "Uncategorized";
        const existing = target.get(menuItem.id) ?? {
          name: menuItem.name,
          category,
          sales: 0,
          revenue: 0,
        };

        existing.name = menuItem.name;
        existing.category = category;
        existing.sales += sales;
        existing.revenue += revenue;
        target.set(menuItem.id, existing as { name?: string; category?: string; sales: number; revenue: number });
      }
    }
  };

  accumulate(current, currentOrders);
  accumulate(previous, previousOrders);

  return Array.from(current.entries())
    .map(([id, item]) => {
      const previousItem = previous.get(id);
      return {
        id,
        name: item.name,
        category: item.category,
        sales: item.sales,
        revenue: item.revenue,
        trend: trendPercent(item.revenue, previousItem?.revenue ?? 0),
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

function buildTransactions(orders: OrderRow[]) {
  return orders.map((order) => {
    const items = (order.order_items ?? [])
      .map((item) => `${item.quantity}x ${item.menu_items?.name ?? "Unknown Item"}`)
      .join(", ");

    return {
      id: order.id,
      orderNumber: order.qr_hash ?? order.id,
      date: formatManilaDate(order.created_at),
      time: formatManilaTime(order.created_at),
      createdAt: order.created_at,
      items,
      method: order.payment_method ?? "Pending",
      status: order.status,
      paymentStatus: order.payment_status,
      total: toNumber(order.total_price),
      tableNumber: order.table_number,
    };
  });
}

async function getOverview(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  tenantId: string,
  period: SalesPeriod,
) {
  const { currentStartIso, currentEndIso, previousStartIso, previousEndIso } = getPeriodRange(period);

  const [tenantResult, currentResult, previousResult, categoriesResult] = await Promise.all([
    admin.from("tenants").select("business_name").eq("id", tenantId).maybeSingle(),
    admin
      .from("orders")
      .select(
        `
        id,
        qr_hash,
        status,
        payment_status,
        payment_method,
        total_price,
        created_at,
        table_number,
        order_items (
          id,
          quantity,
          unit_price,
          menu_items (
            id,
            name,
            category_id
          )
        )
      `,
      )
      .eq("tenant_id", tenantId)
      .gte("created_at", currentStartIso)
      .lte("created_at", currentEndIso)
      .order("created_at", { ascending: false }),
    admin
      .from("orders")
      .select(
        `
        id,
        qr_hash,
        status,
        payment_status,
        payment_method,
        total_price,
        created_at,
        table_number,
        order_items (
          id,
          quantity,
          unit_price,
          menu_items (
            id,
            name,
            category_id
          )
        )
      `,
      )
      .eq("tenant_id", tenantId)
      .gte("created_at", previousStartIso)
      .lte("created_at", previousEndIso)
      .order("created_at", { ascending: false }),
    admin.from("categories").select("id, name").eq("tenant_id", tenantId),
  ]);

  const currentOrders = (currentResult.data ?? []) as OrderRow[];
  const previousOrders = (previousResult.data ?? []) as OrderRow[];
  const categoryMap = new Map<string, string>(
    (categoriesResult.data ?? []).map((row: { id: string; name: string }) => [row.id, row.name]),
  );

  const currentPaidOrders = currentOrders.filter((order) => order.payment_status === "paid");
  const previousPaidOrders = previousOrders.filter((order) => order.payment_status === "paid");

  const grossSales = aggregateMoney(currentOrders, (order) => order.payment_status === "paid");
  const previousGrossSales = aggregateMoney(previousOrders, (order) => order.payment_status === "paid");
  const refundedSales = aggregateMoney(currentOrders, (order) => order.payment_status === "refunded");
  const previousRefundedSales = aggregateMoney(previousOrders, (order) => order.payment_status === "refunded");
  const totalOrders = currentOrders.length;
  const previousTotalOrders = previousOrders.length;
  const averageOrderValue = currentPaidOrders.length > 0 ? grossSales / currentPaidOrders.length : 0;
  const previousAverageOrderValue = previousPaidOrders.length > 0 ? previousGrossSales / previousPaidOrders.length : 0;

  return {
    businessName: typeof tenantResult.data?.business_name === "string" ? tenantResult.data.business_name : "",
    period,
    generatedAt: new Date().toISOString(),
    metrics: {
      grossSales,
      netSales: grossSales - refundedSales,
      totalOrders,
      averageOrderValue,
      grossTrend: trendPercent(grossSales, previousGrossSales),
      netTrend: trendPercent(grossSales - refundedSales, previousGrossSales - previousRefundedSales),
      totalOrdersTrend: trendPercent(totalOrders, previousTotalOrders),
      averageOrderValueTrend: trendPercent(averageOrderValue, previousAverageOrderValue),
    },
    revenueSeries: buildSeries(currentPaidOrders, period, currentStartIso, currentEndIso),
    topItems: buildTopItems(currentOrders, previousOrders, categoryMap),
  };
}

async function getTransactions(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  tenantId: string,
  search: string,
  status: string,
  method: string,
  paymentStatus: string,
  page: number,
  limit: number,
  includeAll: boolean,
) {
  let query = admin
    .from("orders")
    .select(
      `
      id,
      qr_hash,
      status,
      payment_status,
      payment_method,
      total_price,
      created_at,
      table_number,
      order_items (
        id,
        quantity,
        menu_items (
          name
        )
      )
    `,
      { count: "exact" },
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`qr_hash.ilike.%${search}%,table_number.ilike.%${search}%`);
  }

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (method && method !== "all") {
    query = query.eq("payment_method", method);
  }

  if (paymentStatus && paymentStatus !== "all") {
    query = query.eq("payment_status", paymentStatus);
  }

  if (includeAll) {
    query = query.range(0, 9999);
  } else {
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const transactions = buildTransactions((data ?? []) as OrderRow[]);

  return {
    data: transactions,
    total: count ?? 0,
  };
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ tenantId: string }> },
) {
  const { tenantId } = await context.params;
  const auth = await requireTenantAccess(tenantId);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const { admin } = auth;
  const { searchParams } = req.nextUrl;
  const view = searchParams.get("view") ?? "overview";

  if (view === "transactions") {
    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "all";
    const method = searchParams.get("method")?.trim() ?? "all";
    const paymentStatus = searchParams.get("paymentStatus")?.trim() ?? "all";
    const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.max(1, Math.min(100, Number.parseInt(searchParams.get("limit") ?? "10", 10)));
    const includeAll = searchParams.get("all") === "true";

    try {
      const result = await getTransactions(
        admin,
        tenantId,
        search,
        status,
        method,
        paymentStatus,
        page,
        limit,
        includeAll,
      );

      const { data: tenant } = await admin
        .from("tenants")
        .select("business_name")
        .eq("id", tenantId)
        .maybeSingle();

      return NextResponse.json({
        businessName: typeof tenant?.business_name === "string" ? tenant.business_name : "",
        data: result.data,
        total: result.total,
        page: includeAll ? 1 : page,
        limit: includeAll ? Math.max(result.data.length, 1) : limit,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load transactions";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const period = parsePeriod(searchParams.get("period"));

  try {
    const result = await getOverview(admin, tenantId, period);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load sales overview";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
