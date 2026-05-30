import React from "react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { KPICard } from "@/components/molecules/KPICard";
import { DashboardListItem } from "@/components/molecules/DashboardListItem";
import { Clock, CheckCircle2, ChefHat, Activity } from "lucide-react";
import { getManilaDateKey } from "@/lib/salesDashboard";

type DashboardOrderItem = {
  quantity: number;
  menu_items?: { name?: string | null } | null;
};

type DashboardOrderRow = {
  id: string;
  qr_hash: string | null;
  status: "pending" | "preparing" | "ready" | "served" | "cancelled";
  payment_status: "unpaid" | "paid";
  total_price: number;
  created_at: string;
  updated_at: string;
  order_items?: DashboardOrderItem[] | null;
};

type DashboardStatusLogRow = {
  order_id: string;
  status_change: "pending" | "preparing" | "ready" | "served" | "cancelled";
  created_at: string;
};

type DashboardActivity = {
  orderNumber: string;
  itemSummary: string;
  timeLabel: string;
  statusLabel: string;
  icon: React.ReactNode;
  iconClassName: string;
};

function formatRelativeTime(value: string) {
  const deltaMs = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(deltaMs) || deltaMs < 0) return "Just now";

  const minutes = Math.floor(deltaMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatPrepTime(minutes: number) {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "0 minutes";
  }

  const rounded = Math.round(minutes * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)} minutes`;
}

function summarizeOrderItems(items: DashboardOrderItem[] | null | undefined) {
  const names =
    items
      ?.map((item) => item.menu_items?.name?.trim())
      .filter((name): name is string => Boolean(name)) ?? [];

  if (names.length === 0) {
    return "No items listed";
  }

  if (names.length <= 2) {
    return names.join(", ");
  }

  return `${names.slice(0, 2).join(", ")} +${names.length - 2} more`;
}

function buildPrepAverage(logs: DashboardStatusLogRow[]) {
  const logsByOrder = new Map<string, DashboardStatusLogRow[]>();

  for (const log of logs) {
    const group = logsByOrder.get(log.order_id) ?? [];
    group.push(log);
    logsByOrder.set(log.order_id, group);
  }

  const prepDurations: number[] = [];

  for (const group of logsByOrder.values()) {
    const sorted = [...group].sort(
      (left, right) =>
        new Date(left.created_at).getTime() -
        new Date(right.created_at).getTime(),
    );

    const prepStart = sorted.find((log) => log.status_change === "preparing");
    if (!prepStart) continue;

    const prepStartTime = new Date(prepStart.created_at).getTime();
    const prepEnd = sorted.find(
      (log) =>
        (log.status_change === "ready" || log.status_change === "served") &&
        new Date(log.created_at).getTime() >= prepStartTime,
    );

    if (!prepEnd) continue;

    const elapsedMinutes =
      (new Date(prepEnd.created_at).getTime() - prepStartTime) / 60000;

    if (elapsedMinutes > 0) {
      prepDurations.push(elapsedMinutes);
    }
  }

  if (prepDurations.length === 0) {
    return 0;
  }

  return (
    prepDurations.reduce((sum, value) => sum + value, 0) / prepDurations.length
  );
}

async function getEmployeeDashboardData(tenantId: string) {
  const admin = createSupabaseAdminClient();
  const todayStartIso = `${getManilaDateKey(new Date())}T00:00:00+08:00`;
  const prepWindowIso = new Date(
    Date.now() - 14 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const [
    activeOrdersResult,
    readyTodayResult,
    prepLogsResult,
    recentLogsResult,
  ] = await Promise.all([
    admin
      .from("orders")
      .select(
        `
          id,
          qr_hash,
          status,
          payment_status,
          total_price,
          created_at,
          updated_at,
          order_items (
            quantity,
            menu_items (
              name
            )
          )
        `,
      )
      .eq("tenant_id", tenantId)
      .eq("payment_status", "paid")
      .in("status", ["pending", "preparing", "ready"])
      .order("created_at", { ascending: false }),
    admin
      .from("order_status_logs")
      .select("order_id")
      .eq("tenant_id", tenantId)
      .eq("status_change", "ready")
      .gte("created_at", todayStartIso),
    admin
      .from("order_status_logs")
      .select("order_id, status_change, created_at")
      .eq("tenant_id", tenantId)
      .gte("created_at", prepWindowIso)
      .in("status_change", ["preparing", "ready", "served"])
      .order("created_at", { ascending: true }),
    admin
      .from("order_status_logs")
      .select("order_id, status_change, created_at")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const activeOrders = (activeOrdersResult.data ?? []) as DashboardOrderRow[];
  const readyTodayCount = new Set(
    (readyTodayResult.data ?? []).map((row) => row.order_id),
  ).size;
  const prepLogs = (prepLogsResult.data ?? []) as DashboardStatusLogRow[];
  const recentLogs = (recentLogsResult.data ?? []) as DashboardStatusLogRow[];

  const recentOrderIds = Array.from(
    new Set(recentLogs.map((log) => log.order_id).filter(Boolean)),
  );

  const recentOrdersResult = recentOrderIds.length
    ? await admin
        .from("orders")
        .select(
          `
          id,
          qr_hash,
          order_items (
            quantity,
            menu_items (
              name
            )
          )
        `,
        )
        .in("id", recentOrderIds)
    : { data: [] as DashboardOrderRow[] };

  const recentOrders = (recentOrdersResult.data ?? []) as DashboardOrderRow[];
  const recentOrderMap = new Map(
    recentOrders.map((order) => [order.id, order]),
  );

  const recentActivities: DashboardActivity[] = recentLogs.map((log) => {
    const order = recentOrderMap.get(log.order_id);
    const orderNumber = order?.qr_hash
      ? `#${order.qr_hash}`
      : `#${log.order_id.slice(0, 8).toUpperCase()}`;
    const itemSummary = summarizeOrderItems(order?.order_items);
    const timeLabel = formatRelativeTime(log.created_at);

    let statusLabel = "Status updated";
    let icon = <Activity size={20} />;
    let iconClassName = "bg-blue-100 text-blue-600";

    if (log.status_change === "preparing") {
      statusLabel = "Prep started";
      icon = <ChefHat size={20} />;
      iconClassName = "bg-brand-accent/10 text-brand-accent";
    } else if (log.status_change === "ready") {
      statusLabel = "Ready for pickup";
      icon = <CheckCircle2 size={20} />;
      iconClassName = "bg-green-100 text-green-600";
    } else if (log.status_change === "served") {
      statusLabel = "Completed";
      icon = <CheckCircle2 size={20} />;
      iconClassName = "bg-emerald-100 text-emerald-600";
    } else if (log.status_change === "cancelled") {
      statusLabel = "Cancelled";
      icon = <Clock size={20} />;
      iconClassName = "bg-gray-100 text-gray-500";
    }

    return {
      orderNumber,
      itemSummary,
      timeLabel,
      statusLabel,
      icon,
      iconClassName,
    };
  });

  const prepAverageMinutes = buildPrepAverage(prepLogs);
  const pendingCount = activeOrders.length;

  return {
    pendingCount,
    readyTodayCount,
    prepAverageMinutes,
    recentActivities,
    hasActivity: recentActivities.length > 0,
  };
}

export default async function EmployeeDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = await params;
  const {
    pendingCount,
    readyTodayCount,
    prepAverageMinutes,
    recentActivities,
    hasActivity,
  } = await getEmployeeDashboardData(tenantId);

  return (
    <>
      <header className="mb-2">
        <h2 className="h2 text-text-primary">Operational Overview</h2>
        <p className="b1 text-text-secondary mt-2">
          Live order flow, scanner activity, and kitchen prep timing
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Pending Orders"
          value={String(pendingCount)}
          description="Pending + preparing"
          icon={<Clock size={24} />}
          color="primary"
        />
        <KPICard
          title="Completed Today"
          value={String(readyTodayCount)}
          description="Orders marked ready today"
          icon={<CheckCircle2 size={24} />}
          color="accent"
        />
        <KPICard
          title="Avg Prep Time"
          value={formatPrepTime(prepAverageMinutes)}
          description="Calculated in minutes from scanner start to ready/served"
          icon={<ChefHat size={24} />}
          color="primary"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-4">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-0">
          {hasActivity ? (
            recentActivities.map((activity, index) => (
              <DashboardListItem
                key={`${activity.orderNumber}-${activity.statusLabel}-${index}`}
                title={activity.orderNumber}
                subtitle={activity.itemSummary}
                icon={
                  <div className={`${activity.iconClassName} p-2 rounded-full`}>
                    {activity.icon}
                  </div>
                }
                rightContent={
                  <div className="text-right">
                    <p className="text-sm font-medium">{activity.timeLabel}</p>
                    <p className="text-xs text-gray-500">
                      {activity.statusLabel}
                    </p>
                  </div>
                }
                isLast={index === recentActivities.length - 1}
              />
            ))
          ) : (
            <div className="py-10 text-center text-text-secondary">
              No recent activity yet.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
