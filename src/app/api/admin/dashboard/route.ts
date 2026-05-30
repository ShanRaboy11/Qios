import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createEmptyAdminDashboard,
  type AdminDashboardActivityItem,
  type AdminDashboardBarPoint,
  type AdminDashboardData,
  type AdminDashboardMetric,
  type AdminDashboardPlanPoint,
  type AdminDashboardRevenuePoint,
  type AdminDashboardTenantItem,
  type AdminDashboardTransactionItem,
} from "@/lib/adminDashboard";
import {
  formatManilaDate,
  formatMoney,
  getManilaDateKey,
  trendPercent,
} from "@/lib/salesDashboard";

const MANILA_TIME_ZONE = "Asia/Manila";

type TenantRow = {
  id: string;
  business_name: string;
  status: string | null;
  subscription_plan: string | null;
  created_at: string;
};

type OrderRow = {
  id: string;
  tenant_id: string;
  qr_hash: string | null;
  status: string;
  payment_status: string;
  payment_method: string | null;
  total_price: number | string;
  created_at: string;
  table_number: string | null;
};

type PlanRow = {
  name: string;
  color: string;
  badge: string;
  price_monthly: string;
  price_annually: string;
};

type ActivityRow = {
  id: string;
  actor_name: string;
  actor_role: string;
  action_type: string;
  description: string;
  target_tenant_name: string | null;
  created_at: string;
};

async function requireSuperAdmin() {
  const server = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  const {
    data: { user },
    error: userError,
  } = await server.auth.getUser();

  if (userError || !user) {
    return { ok: false as const, status: 401, message: "Unauthorized" };
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { ok: false as const, status: 403, message: "Profile not found" };
  }

  if (profile.role !== "super_admin") {
    return { ok: false as const, status: 403, message: "Requires super_admin role" };
  }

  return { ok: true as const, admin, userId: user.id };
}

function toNumber(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function shiftMonths(date: Date, months: number) {
  const next = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

function startOfMonthKey(date: Date) {
  return monthKey(date);
}

function startOfDayManila(date: Date) {
  return getManilaDateKey(date);
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: MANILA_TIME_ZONE,
    weekday: "short",
  }).format(date);
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: MANILA_TIME_ZONE,
    month: "short",
  }).format(date);
}

function initialsFromName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "Q";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "Q";
  const second = parts.length > 1 ? parts[1]?.[0] ?? "" : "";
  return `${first}${second}`.toUpperCase().slice(0, 2);
}

function colorForIndex(index: number) {
  const palette = [
    "bg-[#E6FFE6] text-[#22C55E]",
    "bg-[#E6F0FF] text-[#3B82F6]",
    "bg-[#FFF4E6] text-[#F97316]",
    "bg-[#F3E8FF] text-[#A855F7]",
    "bg-[#FFEBE6] text-[#EF4444]",
    "bg-[#F2F2F2] text-[#2D2D2D]",
  ];

  return palette[index % palette.length];
}

function planColorFallback(index: number) {
  const palette = ["#FF5269", "#FFDC72", "#F28C50", "#22C55E", "#3B82F6", "#A855F7"];
  return palette[index % palette.length];
}

function resolveBusinessName(tenant: TenantRow) {
  return tenant.business_name?.trim() || "Unnamed Tenant";
}

function formatTenantStatusLabel(status: string | null) {
  const normalized = status?.trim().toLowerCase();
  if (normalized === "approved") return "active";
  if (normalized === "pending") return "pending";
  if (normalized === "rejected") return "rejected";
  if (normalized === "suspended") return "suspended";
  if (normalized === "onboarding") return "onboarding";
  return "active";
}

function mapMetricTrend(value: number, previous: number, suffix = "%") {
  const trend = trendPercent(value, previous);
  const rounded = Number.isFinite(trend) ? trend.toFixed(1) : "0.0";
  return `${trend >= 0 ? "+" : ""}${rounded}${suffix}`;
}

function buildCompaniesSeries(tenants: TenantRow[]): AdminDashboardBarPoint[] {
  const start = new Date();
  start.setDate(start.getDate() - 6);
  const buckets = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return {
      key: startOfDayManila(day),
      name: formatDayLabel(day),
      value: 0,
    };
  });

  const counts = new Map<string, number>();
  for (const tenant of tenants) {
    const key = startOfDayManila(new Date(tenant.created_at));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return buckets.map((bucket, index, array) => ({
    name: bucket.name,
    value: counts.get(bucket.key) ?? 0,
    isHighlighted: index === array.length - 1 && (counts.get(bucket.key) ?? 0) > 0,
  }));
}

function buildRevenueSeries(orders: OrderRow[]): AdminDashboardRevenuePoint[] {
  const now = new Date();
  const currentMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const start = shiftMonths(currentMonth, -11);
  const buckets = Array.from({ length: 12 }, (_, index) => {
    const monthDate = shiftMonths(start, index);
    return {
      key: monthKey(monthDate),
      name: formatMonthLabel(monthDate),
      value: 0,
    };
  });

  const totals = new Map<string, number>();
  for (const order of orders) {
    const key = monthKey(new Date(order.created_at));
    totals.set(key, (totals.get(key) ?? 0) + toNumber(order.total_price));
  }

  return buckets.map((bucket) => ({
    name: bucket.name,
    value: totals.get(bucket.key) ?? 0,
  }));
}

function buildPlanSeries(
  tenants: TenantRow[],
  planRows: PlanRow[],
): AdminDashboardPlanPoint[] {
  const planLookup = new Map(
    planRows.map((plan) => [plan.name.trim().toLowerCase(), plan]),
  );
  const counts = new Map<string, { count: number; color: string }>();

  tenants.forEach((tenant, index) => {
    const key = (tenant.subscription_plan ?? "").trim().toLowerCase() || "unassigned";
    const existing = counts.get(key) ?? {
      count: 0,
      color:
        planLookup.get(key)?.color ||
        (key === "unassigned" ? "#9CA3AF" : planColorFallback(index)),
    };
    existing.count += 1;
    counts.set(key, existing);
  });

  const total = tenants.length || 1;

  return Array.from(counts.entries())
    .map(([key, entry], index) => ({
      name:
        key === "unassigned"
          ? "Unassigned"
          : planLookup.get(key)?.name || key,
      value: Math.round((entry.count / total) * 100),
      color: entry.color || planColorFallback(index),
    }))
    .sort((a, b) => b.value - a.value);
}

function buildRecentTransactions(
  orders: OrderRow[],
  tenantMap: Map<string, TenantRow>,
): AdminDashboardTransactionItem[] {
  return orders.slice(0, 5).map((order, index) => {
    const tenant = tenantMap.get(order.tenant_id);
    const businessName = tenant ? resolveBusinessName(tenant) : "Unknown Tenant";
    const plan = tenant?.subscription_plan?.trim() || "Unassigned";
    const date = formatManilaDate(order.created_at);

    return {
      id: order.id,
      name: businessName,
      subtitle: `${order.qr_hash ?? order.id.slice(0, 8)} • ${date}`,
      amount: formatMoney(toNumber(order.total_price)),
      plan,
      icon: initialsFromName(businessName),
      color: colorForIndex(index),
    };
  });
}

function buildRecentTenants(
  tenants: TenantRow[],
  profileCounts: Map<string, number>,
): AdminDashboardTenantItem[] {
  return tenants.slice(0, 5).map((tenant, index) => {
    const businessName = resolveBusinessName(tenant);
    const totalStaff = profileCounts.get(tenant.id) ?? 0;
    return {
      id: tenant.id,
      name: businessName,
      subtitle: `${formatTenantStatusLabel(tenant.status)} • Joined ${formatManilaDate(tenant.created_at)}`,
      users: `${totalStaff} User${totalStaff === 1 ? "" : "s"}`,
      icon: initialsFromName(businessName),
      color: colorForIndex(index),
    };
  });
}

function buildRecentActivities(
  activities: ActivityRow[],
): AdminDashboardActivityItem[] {
  return activities.slice(0, 5).map((activity, index) => {
    const actor = activity.actor_name?.trim() || "System";
    const action = activity.action_type?.trim() || "activity";
    const tenantName = activity.target_tenant_name?.trim();
    const description = activity.description?.trim() || action;

    return {
      id: activity.id,
      name: actor,
      subtitle: `${action} • ${formatManilaDate(activity.created_at)}`,
      detail: tenantName || description,
      icon: initialsFromName(actor),
      color: colorForIndex(index),
    };
  });
}

function mapMetrics({
  tenants,
  companiesSeries,
  revenueSeries,
  latencyMs,
}: {
  tenants: TenantRow[];
  companiesSeries: AdminDashboardBarPoint[];
  revenueSeries: AdminDashboardRevenuePoint[];
  latencyMs: number;
}): AdminDashboardMetric[] {
  const totalCompanies = tenants.length;
  const activeCompanies = tenants.filter((tenant) => tenant.status === "approved").length;

  const now = new Date();
  const currentMonthKey = monthKey(now);
  const previousMonthKey = monthKey(shiftMonths(now, -1));
  const monthTotals = new Map<string, number>();

  revenueSeries.forEach((point, index) => {
    const monthDate = shiftMonths(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)), index - 11);
    monthTotals.set(monthKey(monthDate), point.value);
  });

  const currentMonthRevenue = monthTotals.get(currentMonthKey) ?? 0;
  const previousMonthRevenue = monthTotals.get(previousMonthKey) ?? 0;
  const totalRevenue = revenueSeries.reduce((sum, point) => sum + point.value, 0);
  const currentMonthNewCompanies = tenants.filter(
    (tenant) => monthKey(new Date(tenant.created_at)) === currentMonthKey,
  ).length;
  const previousMonthNewCompanies = tenants.filter(
    (tenant) => monthKey(new Date(tenant.created_at)) === previousMonthKey,
  ).length;

  const totalCompaniesTrend = mapMetricTrend(
    currentMonthNewCompanies,
    previousMonthNewCompanies,
    "%",
  );
  const activePercent = totalCompanies > 0
    ? `${Math.round((activeCompanies / totalCompanies) * 100)}% active`
    : "0% active";
  const latencyTrend = `Fetched in ${latencyMs}ms`;
  const revenueTrendValue = trendPercent(currentMonthRevenue, previousMonthRevenue);
  const revenueTrend = `${revenueTrendValue >= 0 ? "+" : ""}${Number.isFinite(revenueTrendValue) ? revenueTrendValue.toFixed(1) : "0.0"}% vs prev month`;

  return [
    {
      title: "Total Companies",
      value: totalCompanies.toLocaleString(),
      percentage: totalCompaniesTrend,
      badgeColor: "green",
      color: "pink",
      chartData: companiesSeries.map((point) => Math.max(0, point.value)),
    },
    {
      title: "Active Companies",
      value: activeCompanies.toLocaleString(),
      percentage: activePercent,
      badgeColor: "green",
      color: "yellow",
      chartData: companiesSeries.map((point) =>
        point.value > 0 ? Math.min(10, point.value) : 0,
      ),
    },
    {
      title: "Server Latency",
      value: `${latencyMs}ms`,
      percentage: latencyTrend,
      badgeColor: "green",
      color: "green",
      chartData: [latencyMs, latencyMs, latencyMs, latencyMs, latencyMs],
    },
    {
      title: "Total Earnings",
      value: formatMoney(totalRevenue),
      percentage: revenueTrend,
      badgeColor: revenueTrendValue >= 0 ? "green" : "red",
      color: "red",
      chartData: revenueSeries.map((point) => Math.max(0, Math.round(point.value / 1000))),
    },
  ];
}

export async function GET() {
  const auth = await requireSuperAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const { admin } = auth;
  const startedAt = Date.now();
  const warnings: string[] = [];
  const response = createEmptyAdminDashboard();

  const now = new Date();
  const twelveMonthsAgo = shiftMonths(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)), -11);

  const [tenantsResult, revenueOrdersResult, recentOrdersResult, plansResult, activityResult] =
    await Promise.all([
      admin
        .from("tenants")
        .select("id, business_name, status, subscription_plan, created_at")
        .order("created_at", { ascending: false }),
      admin
        .from("orders")
        .select("id, tenant_id, qr_hash, status, payment_status, payment_method, total_price, created_at, table_number")
        .eq("payment_status", "paid")
        .gte("created_at", twelveMonthsAgo.toISOString())
        .order("created_at", { ascending: false }),
      admin
        .from("orders")
        .select("id, tenant_id, qr_hash, status, payment_status, payment_method, total_price, created_at, table_number")
        .eq("payment_status", "paid")
        .order("created_at", { ascending: false })
        .limit(5),
      admin
        .from("subscription_plans")
        .select("name, color, badge, price_monthly, price_annually")
        .order("created_at", { ascending: true }),
      admin
        .from("system_activity_logs")
        .select("id, actor_name, actor_role, action_type, description, target_tenant_name, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  if (tenantsResult.error) {
    warnings.push(tenantsResult.error.message);
  }
  if (revenueOrdersResult.error) {
    warnings.push(revenueOrdersResult.error.message);
  }
  if (recentOrdersResult.error) {
    warnings.push(recentOrdersResult.error.message);
  }
  if (plansResult.error) {
    warnings.push(plansResult.error.message);
  }
  if (activityResult.error) {
    warnings.push(activityResult.error.message);
  }

  const tenants = (tenantsResult.data ?? []) as TenantRow[];
  const revenueOrders = (revenueOrdersResult.data ?? []) as OrderRow[];
  const recentOrders = (recentOrdersResult.data ?? []) as OrderRow[];
  const plans = (plansResult.data ?? []) as PlanRow[];
  const activities = (activityResult.data ?? []) as ActivityRow[];

  const tenantMap = new Map<string, TenantRow>(tenants.map((tenant) => [tenant.id, tenant]));
  const recentTenantIds = tenants.slice(0, 5).map((tenant) => tenant.id);

  let profileCounts = new Map<string, number>();
  if (recentTenantIds.length > 0) {
    const { data: profileRows, error: profileError } = await admin
      .from("profiles")
      .select("tenant_id")
      .in("tenant_id", recentTenantIds);

    if (profileError) {
      warnings.push(profileError.message);
    } else {
      profileCounts = (profileRows ?? []).reduce<Map<string, number>>((acc, profile) => {
        const tenantId = profile.tenant_id as string | null;
        if (!tenantId) return acc;
        acc.set(tenantId, (acc.get(tenantId) ?? 0) + 1);
        return acc;
      }, new Map<string, number>());
    }
  }

  const companiesSeries = buildCompaniesSeries(tenants);
  const revenueSeries = buildRevenueSeries(revenueOrders);
  const plansSeries = buildPlanSeries(tenants, plans);
  const metrics = mapMetrics({
    tenants,
    companiesSeries,
    revenueSeries,
    latencyMs: Math.max(1, Date.now() - startedAt),
  });

  response.metrics = metrics.length > 0 ? metrics : response.metrics;
  response.companiesSeries = companiesSeries.length > 0 ? companiesSeries : response.companiesSeries;
  response.revenueSeries = revenueSeries.length > 0 ? revenueSeries : response.revenueSeries;
  response.plansSeries = plansSeries;
  response.recentTransactions = buildRecentTransactions(recentOrders, tenantMap);
  response.recentTenants = buildRecentTenants(tenants, profileCounts);
  response.recentActivities = buildRecentActivities(activities);
  response.generatedAt = new Date().toISOString();
  response.warnings = warnings;

  return NextResponse.json(response);
}
