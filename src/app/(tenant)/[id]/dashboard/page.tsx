import React from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Info, Users } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { TenantDashboardHeader } from "@/components/organisms/TenantDashboardHeader";
import { TenantMetricsSection } from "@/components/organisms/TenantMetricsSection";
import { SalesAndPurchaseChart } from "../../../../components/organisms/SalesAndPurchaseChart";
import { OverallInformation } from "@/components/organisms/OverallInformation";
import { DashboardListsSection } from "@/components/organisms/DashboardListsSection";
import { AlertBanner } from "@/components/molecules/AlertBanner";
import {
  formatMoney,
  formatManilaDateRangeLabel,
  getDashboardDateRange,
  getManilaDateKey,
  type DashboardDateRangePreset,
  trendPercent,
} from "@/lib/salesDashboard";
import type {
  SalesAndPurchaseSeries,
  SalesAndRevenuePoint,
} from "../../../../components/organisms/SalesAndPurchaseChart";

type DashboardOrderItemRow = {
  quantity: number;
  unit_price: number | string | null;
  menu_items?:
    | {
        id: string;
        name: string;
        category_id: string;
      }
    | Array<{
        id: string;
        name: string;
        category_id: string;
      }>
    | null;
};

type DashboardOrderRow = {
  id: string;
  qr_hash: string | null;
  status: "pending" | "preparing" | "ready" | "served" | "cancelled";
  payment_status: "unpaid" | "paid";
  total_price: number | string;
  created_at: string;
  order_items?: DashboardOrderItemRow[] | null;
};

type DashboardInventoryRow = {
  id: string;
  name: string;
  unit_type: string;
  current_stock: number | string;
  low_stock_threshold: number | string;
  purchase_price: number | string;
};

type DashboardPurchaseRow = {
  total_cost: number | string;
  created_at: string;
};

type DashboardStatusLogRow = {
  order_id: string;
  status_change: "pending" | "preparing" | "ready" | "served" | "cancelled";
  created_at: string;
};

type DashboardSalesSeries = SalesAndPurchaseSeries;

function toNumber(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCompactCount(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function getFirstName(name: string | null | undefined) {
  const trimmed = name?.trim();
  if (!trimmed) return "Admin";

  const firstName = trimmed.split(/\s+/)[0] || "Admin";
  return firstName.charAt(0).toUpperCase() + firstName.slice(1);
}

function normalizeDashboardRange(
  value: string | undefined,
): DashboardDateRangePreset {
  if (value === "month" || value === "year" || value === "all-time") {
    return value;
  }

  return "week";
}

function formatOrderSummary(items: DashboardOrderItemRow[] | null | undefined) {
  const names =
    items
      ?.map((item) => {
        const menuItem = Array.isArray(item.menu_items)
          ? item.menu_items[0]
          : item.menu_items;

        return menuItem?.name?.trim();
      })
      .filter((name): name is string => Boolean(name)) ?? [];

  if (names.length === 0) {
    return "No items yet";
  }

  if (names.length <= 2) {
    return names.join(", ");
  }

  return `${names.slice(0, 2).join(", ")} +${names.length - 2} more`;
}

function formatStatusLabel(status: DashboardOrderRow["status"]) {
  if (status === "pending") return "Pending";
  if (status === "preparing") return "Preparing";
  if (status === "ready") return "Ready";
  if (status === "served") return "Completed";
  return "Cancelled";
}

function buildTopSellers(
  currentOrders: DashboardOrderRow[],
  previousOrders: DashboardOrderRow[],
  hasComparisonRange: boolean,
) {
  const currentMap = new Map<
    string,
    { name: string; sales: number; revenue: number }
  >();
  const previousMap = new Map<
    string,
    { name: string; sales: number; revenue: number }
  >();

  const accumulate = (
    target: Map<string, { name: string; sales: number; revenue: number }>,
    orders: DashboardOrderRow[],
  ) => {
    for (const order of orders) {
      if (order.payment_status !== "paid") continue;

      for (const item of order.order_items ?? []) {
        const menuItem = Array.isArray(item.menu_items)
          ? item.menu_items[0]
          : item.menu_items;
        if (!menuItem?.id) continue;

        const quantity = toNumber(item.quantity);
        const revenue = quantity * toNumber(item.unit_price);
        const existing = target.get(menuItem.id) ?? {
          name: menuItem.name,
          sales: 0,
          revenue: 0,
        };

        existing.name = menuItem.name;
        existing.sales += quantity;
        existing.revenue += revenue;
        target.set(menuItem.id, existing);
      }
    }
  };

  accumulate(currentMap, currentOrders);
  accumulate(previousMap, previousOrders);

  return Array.from(currentMap.entries())
    .map(([id, item]) => {
      const previousRevenue = previousMap.get(id)?.revenue ?? 0;
      const trend = Math.round(trendPercent(item.revenue, previousRevenue));

      return {
        id,
        name: item.name,
        revenueValue: item.revenue,
        revenueLabel: formatMoney(item.revenue),
        salesLabel: `${formatCompactCount(item.sales)} Sales`,
        trendLabel: hasComparisonRange
          ? `${item.revenue >= previousRevenue ? "↗" : "↘"} ${Math.abs(trend)}%`
          : "—",
        isPositive: hasComparisonRange ? item.revenue >= previousRevenue : true,
      };
    })
    .sort((left, right) => right.revenueValue - left.revenueValue)
    .slice(0, 5)
    .map(({ revenueValue: _revenueValue, ...rest }) => rest);
}

function buildRecentOrders(orders: DashboardOrderRow[]) {
  return orders.slice(0, 5).map((order) => {
    const itemsSummary = formatOrderSummary(order.order_items);

    let statusTone: "warning" | "error" | "success" | "neutral" = "neutral";
    if (order.status === "pending") statusTone = "warning";
    if (order.status === "preparing") statusTone = "warning";
    if (order.status === "ready" || order.status === "served") {
      statusTone = "success";
    }
    if (order.status === "cancelled") statusTone = "error";

    return {
      id: order.id,
      title: order.qr_hash
        ? `#${order.qr_hash}`
        : `#${order.id.slice(0, 8).toUpperCase()}`,
      subtitle: `${itemsSummary} • ${formatMoney(toNumber(order.total_price))}`,
      dateLabel: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "Asia/Manila",
      }).format(new Date(order.created_at)),
      statusLabel: formatStatusLabel(order.status),
      statusTone,
    };
  });
}

function buildLowStockItems(inventoryItems: DashboardInventoryRow[]) {
  return inventoryItems
    .filter(
      (item) =>
        toNumber(item.current_stock) <= toNumber(item.low_stock_threshold),
    )
    .sort(
      (left, right) =>
        toNumber(left.current_stock) - toNumber(right.current_stock),
    )
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      name: item.name,
      skuLabel: `Unit: ${item.unit_type}`,
      stockLabel:
        item.unit_type === "unit"
          ? formatCompactCount(toNumber(item.current_stock))
          : `${formatCompactCount(toNumber(item.current_stock))}${item.unit_type}`,
      stockTone:
        toNumber(item.current_stock) <= toNumber(item.low_stock_threshold) / 2
          ? ("low" as const)
          : ("warning" as const),
    }));
}

function getManilaMonthKey(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
  }).format(value);
}

function getManilaMonthLabel(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    month: "short",
  }).format(value);
}

function buildDailySeries(
  orders: DashboardOrderRow[],
  days: number,
  labelFormatter: (date: Date) => string,
): SalesAndRevenuePoint[] {
  const buckets = Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - index));
    return {
      key: getManilaDateKey(date),
      label: labelFormatter(date),
      sales: 0,
      revenue: 0,
    };
  });

  const lookup = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const order of orders) {
    if (order.payment_status !== "paid") continue;
    const bucket = lookup.get(getManilaDateKey(order.created_at));
    if (!bucket) continue;

    const orderAmount = toNumber(order.total_price);
    bucket.sales += orderAmount;
    bucket.revenue += 0;
  }

  return buckets.map(({ key: _key, ...point }) => point);
}

function buildMonthlySeries(orders: DashboardOrderRow[], months: number) {
  const buckets = Array.from({ length: months }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (months - 1 - index));
    return {
      key: getManilaMonthKey(date),
      label: getManilaMonthLabel(date),
      sales: 0,
      revenue: 0,
    };
  });

  const lookup = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const order of orders) {
    if (order.payment_status !== "paid") continue;
    const bucket = lookup.get(getManilaMonthKey(order.created_at));
    if (!bucket) continue;

    const orderAmount = toNumber(order.total_price);
    bucket.sales += orderAmount;
    bucket.revenue += 0;
  }

  return buckets.map(({ key: _key, ...point }) => point);
}

function buildPurchaseDailySeries(
  purchases: DashboardPurchaseRow[],
  days: number,
  labelFormatter: (date: Date) => string,
): SalesAndRevenuePoint[] {
  const buckets = Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - index));
    return {
      key: getManilaDateKey(date),
      label: labelFormatter(date),
      sales: 0,
      purchase: 0,
      revenue: 0,
    };
  });

  const lookup = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const purchase of purchases) {
    const bucket = lookup.get(getManilaDateKey(purchase.created_at));
    if (!bucket) continue;

    bucket.purchase += toNumber(purchase.total_cost);
  }

  return buckets.map(({ key: _key, ...point }) => point);
}

function buildPurchaseMonthlySeries(
  purchases: DashboardPurchaseRow[],
  months: number,
) {
  const buckets = Array.from({ length: months }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (months - 1 - index));
    return {
      key: getManilaMonthKey(date),
      label: getManilaMonthLabel(date),
      sales: 0,
      purchase: 0,
      revenue: 0,
    };
  });

  const lookup = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const purchase of purchases) {
    const bucket = lookup.get(getManilaMonthKey(purchase.created_at));
    if (!bucket) continue;

    bucket.purchase += toNumber(purchase.total_cost);
  }

  return buckets.map(({ key: _key, ...point }) => point);
}

function mergeSalesAndPurchaseSeries(
  salesSeries: SalesAndRevenuePoint[],
  purchaseSeries: SalesAndRevenuePoint[],
) {
  return salesSeries.map((point, index) => ({
    ...point,
    purchase: purchaseSeries[index]?.purchase ?? 0,
  }));
}

function buildSalesSeries(
  orders: DashboardOrderRow[],
  purchases: DashboardPurchaseRow[],
): DashboardSalesSeries {
  const dayLabel = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  const weekLabel = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      weekday: "short",
    }).format(date);
  const monthLabel = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      month: "short",
      day: "numeric",
    }).format(date);

  return {
    "1D": mergeSalesAndPurchaseSeries(
      buildDailySeries(orders, 1, dayLabel),
      buildPurchaseDailySeries(purchases, 1, dayLabel),
    ),
    "1W": mergeSalesAndPurchaseSeries(
      buildDailySeries(orders, 7, weekLabel),
      buildPurchaseDailySeries(purchases, 7, weekLabel),
    ),
    "1M": mergeSalesAndPurchaseSeries(
      buildDailySeries(orders, 30, monthLabel),
      buildPurchaseDailySeries(purchases, 30, monthLabel),
    ),
    "3M": mergeSalesAndPurchaseSeries(
      buildMonthlySeries(orders, 3),
      buildPurchaseMonthlySeries(purchases, 3),
    ),
    "6M": mergeSalesAndPurchaseSeries(
      buildMonthlySeries(orders, 6),
      buildPurchaseMonthlySeries(purchases, 6),
    ),
    "1Y": mergeSalesAndPurchaseSeries(
      buildMonthlySeries(orders, 12),
      buildPurchaseMonthlySeries(purchases, 12),
    ),
  };
}

async function getTenantDashboardData(
  tenantId: string,
  rangePreset: DashboardDateRangePreset,
) {
  const admin = createSupabaseAdminClient();
  const dateRange = getDashboardDateRange(rangePreset);
  const todayStartIso = `${getManilaDateKey(new Date())}T00:00:00+08:00`;
  const yearStart = new Date();
  yearStart.setFullYear(yearStart.getFullYear() - 1);

  const currentOrdersQuery = admin
    .from("orders")
    .select(
      `
            id,
            qr_hash,
            status,
            payment_status,
            total_price,
            created_at,
            order_items (
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
    .order("created_at", { ascending: false });

  if (dateRange.startIso) {
    currentOrdersQuery.gte("created_at", dateRange.startIso);
  }

  if (dateRange.endIso) {
    currentOrdersQuery.lte("created_at", dateRange.endIso);
  }

  const previousOrdersQuery =
    dateRange.previousStartIso && dateRange.previousEndIso
      ? admin
          .from("orders")
          .select(
            `
            id,
            qr_hash,
            status,
            payment_status,
            total_price,
            created_at,
            order_items (
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
          .gte("created_at", dateRange.previousStartIso)
          .lte("created_at", dateRange.previousEndIso)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as DashboardOrderRow[] });

  const [
    tenantResult,
    currentOrdersResult,
    previousOrdersResult,
    inventoryResult,
    purchaseLogsResult,
    menuCountResult,
    statusLogsResult,
  ] = await Promise.all([
    admin
      .from("tenants")
      .select("business_name, owner_name")
      .eq("id", tenantId)
      .maybeSingle(),
    currentOrdersQuery,
    previousOrdersQuery,
    admin
      .from("inventory_items")
      .select("id, name, unit_type, current_stock, low_stock_threshold")
      .eq("tenant_id", tenantId)
      .order("current_stock", { ascending: true }),
    admin
      .from("inventory_purchase_logs")
      .select("total_cost, created_at")
      .eq("tenant_id", tenantId)
      .gte("created_at", `${getManilaDateKey(yearStart)}T00:00:00+08:00`)
      .order("created_at", { ascending: false }),
    admin
      .from("menu_items")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId),
    admin
      .from("order_status_logs")
      .select("order_id, status_change, created_at")
      .eq("tenant_id", tenantId)
      .gte("created_at", todayStartIso)
      .in("status_change", ["preparing", "ready", "served"]),
  ]);

  const currentOrders = (currentOrdersResult.data ?? []) as DashboardOrderRow[];
  const previousOrders = (previousOrdersResult.data ??
    []) as DashboardOrderRow[];
  const hasComparisonRange = Boolean(
    dateRange.previousStartIso && dateRange.previousEndIso,
  );
  const { data: yearOrdersData } = await admin
    .from("orders")
    .select(
      `
        id,
        qr_hash,
        status,
        payment_status,
        total_price,
        created_at,
        order_items (
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
    .gte("created_at", `${getManilaDateKey(yearStart)}T00:00:00+08:00`)
    .order("created_at", { ascending: false });
  const yearOrders = (yearOrdersData ?? []) as DashboardOrderRow[];
  const inventoryItems = (inventoryResult.data ??
    []) as DashboardInventoryRow[];
  const purchaseLogs = (purchaseLogsResult.data ??
    []) as DashboardPurchaseRow[];
  const statusLogs = (statusLogsResult.data ?? []) as DashboardStatusLogRow[];

  const paidCurrentOrders = currentOrders.filter(
    (order) => order.payment_status === "paid",
  );
  const paidPreviousOrders = previousOrders.filter(
    (order) => order.payment_status === "paid",
  );

  const totalSales = paidCurrentOrders.reduce(
    (sum, order) => sum + toNumber(order.total_price),
    0,
  );
  const previousSales = paidPreviousOrders.reduce(
    (sum, order) => sum + toNumber(order.total_price),
    0,
  );
  const totalOrders = paidCurrentOrders.length;
  const previousTotalOrders = paidPreviousOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  const previousAverageOrderValue =
    previousTotalOrders > 0 ? previousSales / previousTotalOrders : 0;

  const activeOrdersCount = currentOrders.filter(
    (order) =>
      order.payment_status === "paid" &&
      ["pending", "preparing", "ready"].includes(order.status),
  ).length;

  const preparingOrdersCount = currentOrders.filter(
    (order) => order.status === "preparing" && order.payment_status === "paid",
  ).length;

  const readyOrdersCount = currentOrders.filter(
    (order) => order.status === "ready" && order.payment_status === "paid",
  ).length;

  const servedTodayCount = new Set(
    statusLogs
      .filter((log) => log.status_change === "served")
      .map((log) => log.order_id),
  ).size;

  const lowStockItems = buildLowStockItems(inventoryItems);
  const topSellingItems = buildTopSellers(
    currentOrders,
    previousOrders,
    hasComparisonRange,
  );
  const recentOrders = buildRecentOrders(currentOrders);
  const salesChartSeries = buildSalesSeries(yearOrders, purchaseLogs);

  const inventoryCount = inventoryItems.length;
  const lowStockCount = lowStockItems.length;
  const menuCount = menuCountResult.count ?? 0;

  const metricsPrimary = [
    {
      title: "Total Sales",
      value: formatMoney(totalSales),
      percentageChange:
        hasComparisonRange && (previousSales > 0 || totalSales > 0)
          ? Math.round(trendPercent(totalSales, previousSales))
          : undefined,
      icon: <Info size={24} />,
      variant: "filled" as const,
      color: "primary" as const,
    },
    {
      title: "Orders Paid",
      value: formatCompactCount(totalOrders),
      percentageChange:
        hasComparisonRange && (previousTotalOrders > 0 || totalOrders > 0)
          ? Math.round(trendPercent(totalOrders, previousTotalOrders))
          : undefined,
      icon: <CheckCircle2 size={24} />,
      variant: "filled" as const,
      color: "accent" as const,
    },
    {
      title: "Avg Order Value",
      value: formatMoney(averageOrderValue),
      percentageChange:
        hasComparisonRange &&
        (previousAverageOrderValue > 0 || averageOrderValue > 0)
          ? Math.round(
              trendPercent(averageOrderValue, previousAverageOrderValue),
            )
          : undefined,
      icon: <Info size={24} />,
      variant: "filled" as const,
      color: "primary" as const,
    },
    {
      title: "Active Orders",
      value: formatCompactCount(activeOrdersCount),
      percentageChange: undefined,
      icon: <AlertTriangle size={24} />,
      variant: "filled" as const,
      color: "accent" as const,
    },
  ];

  const metricsSecondary = [
    {
      title: "Preparing Now",
      value: formatCompactCount(preparingOrdersCount),
      description: "Live queue in progress",
      icon: <Info size={24} />,
      variant: "outlined" as const,
      color: "primary" as const,
    },
    {
      title: "Served Today",
      value: formatCompactCount(servedTodayCount),
      description: "Scanner-confirmed served orders",
      icon: <CheckCircle2 size={24} />,
      variant: "outlined" as const,
      color: "accent" as const,
    },
    {
      title: "Low Stock Items",
      value: formatCompactCount(lowStockCount),
      description:
        inventoryCount > 0
          ? "Ingredients below threshold"
          : "Add inventory items first",
      icon: <AlertTriangle size={24} />,
      variant: "outlined" as const,
      color: "secondary" as const,
    },
    {
      title: "Menu Items",
      value: formatCompactCount(menuCount),
      description: menuCount > 0 ? "Active menu catalog" : "No menu items yet",
      icon: <Info size={24} />,
      variant: "outlined" as const,
      color: "primary" as const,
    },
  ];

  const overviewStats = [
    {
      label: "Customers",
      value: formatCompactCount(totalOrders),
      icon: <Users className="w-6 h-6 text-brand-accent mb-2" />,
      iconClassName:
        "bg-gray-50 border border-gray-100 hover:border-orange-100",
    },
    {
      label: "Completed Today",
      value: formatCompactCount(servedTodayCount),
      icon: <CheckCircle2 className="w-6 h-6 text-brand-accent mb-2" />,
      iconClassName:
        "bg-gray-50 border border-gray-100 hover:border-orange-100",
    },
    {
      label: "Low Stock",
      value: formatCompactCount(lowStockCount),
      icon: <AlertTriangle className="w-6 h-6 text-brand-primary mb-2" />,
      iconClassName:
        "bg-gray-50 border border-gray-100 hover:border-orange-100",
    },
  ];

  const overviewDonut = [
    {
      name: "Preparing",
      value: preparingOrdersCount || 1,
      color: "var(--brand-accent, #FF5269)",
    },
    {
      name: "Ready",
      value: readyOrdersCount || 1,
      color: "var(--brand-primary, #FFD77A)",
    },
  ];

  return {
    tenantName: tenantResult.data?.business_name || "Tenant Dashboard",
    ownerFirstName: getFirstName(tenantResult.data?.owner_name),
    dateRangePreset: dateRange.preset,
    dateRangeStart: dateRange.startDate
      ? formatManilaDateRangeLabel(
          dateRange.startDate,
          dateRange.endDate,
        ).split(" - ")[0]
      : null,
    dateRangeEnd: dateRange.startDate
      ? formatManilaDateRangeLabel(
          dateRange.startDate,
          dateRange.endDate,
        ).split(" - ")[1]
      : null,
    inventoryAlert: lowStockItems[0] ?? null,
    inventoryCount,
    lowStockCount,
    inventoryAlertHref: `/${tenantId}/inventory`,
    metricsPrimary,
    metricsSecondary,
    overviewStats,
    overviewDonut,
    overviewDetails: [
      {
        value: formatCompactCount(preparingOrdersCount),
        label: "Preparing",
        trend: `${formatCompactCount(activeOrdersCount)} active`,
        trendPositive: true,
      },
      {
        value: formatCompactCount(readyOrdersCount),
        label: "Ready",
        trend: `${formatCompactCount(servedTodayCount)} today`,
        trendPositive: true,
      },
    ] as [
      { value: string; label: string; trend: string; trendPositive: boolean },
      { value: string; label: string; trend: string; trendPositive: boolean },
    ],
    topSellingItems,
    lowStockItems,
    recentOrders,
    salesChartSeries,
  };
}

export default async function TenantDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ range?: string }>;
}) {
  const { id: tenantId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const rangePreset = normalizeDashboardRange(resolvedSearchParams?.range);
  const dashboard = await getTenantDashboardData(tenantId, rangePreset);

  const alert =
    dashboard.inventoryCount > 0 ? (
      dashboard.lowStockCount > 0 && dashboard.inventoryAlert ? (
        <AlertBanner
          message={
            <>
              Your Ingredient{" "}
              <span className="text-[#EF4444]">
                {dashboard.inventoryAlert.name} is running low.
              </span>{" "}
              <Link
                href={dashboard.inventoryAlertHref}
                className="underline decoration-[#EF4444] text-[#EF4444]"
              >
                Add Stock
              </Link>
            </>
          }
          className="bg-[#FFF6F8] border-[#ec1313]"
          icon={<AlertTriangle size={16} className="text-[#EF4444] shrink-0" />}
        />
      ) : (
        <AlertBanner
          message={
            <>
              Inventory levels look healthy.{" "}
              <span className="text-[#16A34A]">
                All tracked ingredients are above threshold.
              </span>{" "}
              <Link
                href={dashboard.inventoryAlertHref}
                className="underline decoration-[#16A34A] text-[#16A34A]"
              >
                Review Inventory
              </Link>
            </>
          }
          className="bg-[#F0FDF4] border-[#16A34A]"
          icon={<CheckCircle2 size={16} className="text-[#16A34A] shrink-0" />}
        />
      )
    ) : (
      <AlertBanner
        message={
          <>
            No ingredients have been added yet.{" "}
            <Link
              href={dashboard.inventoryAlertHref}
              className="underline decoration-[#D97706] text-[#D97706]"
            >
              Set Up Inventory
            </Link>
          </>
        }
        className="bg-[#FFFBEB] border-[#D97706]"
        icon={<Info size={16} className="text-[#D97706] shrink-0" />}
      />
    );

  return (
    <>
      <TenantDashboardHeader
        adminName={dashboard.ownerFirstName}
        rangePreset={dashboard.dateRangePreset}
        startDate={dashboard.dateRangeStart ?? undefined}
        endDate={dashboard.dateRangeEnd ?? undefined}
        subtitle={
          <>
            Live tenant summary for{" "}
            <span className="text-brand-primary font-semibold">
              {dashboard.tenantName}
            </span>
          </>
        }
      />

      {alert}

      <div id="tutorial-metrics">
        <TenantMetricsSection
          primaryCards={dashboard.metricsPrimary}
          secondaryCards={dashboard.metricsSecondary}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div id="tutorial-charts" className="w-full lg:w-[65%]">
          <SalesAndPurchaseChart
            seriesByPeriod={dashboard.salesChartSeries}
            defaultPeriod="1D"
          />
        </div>
        <div id="tutorial-overall" className="w-full lg:w-[35%]">
          <OverallInformation
            heading="Operational Overview"
            stats={dashboard.overviewStats}
            donutTitle="Order Flow"
            donutData={dashboard.overviewDonut}
            details={dashboard.overviewDetails}
            fallbackNote={
              dashboard.inventoryCount === 0
                ? "No inventory records yet"
                : undefined
            }
          />
        </div>
      </div>

      <DashboardListsSection
        topSellingItems={dashboard.topSellingItems}
        lowStockItems={dashboard.lowStockItems}
        recentOrders={dashboard.recentOrders}
        inventoryConfigHref={dashboard.inventoryAlertHref}
      />
    </>
  );
}
