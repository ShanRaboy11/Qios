export type AdminKPIColor = "pink" | "yellow" | "green" | "red";
export type AdminKPIBadgeColor = "green" | "red";

export interface AdminDashboardMetric {
  title: string;
  value: string;
  percentage: string;
  badgeColor?: AdminKPIBadgeColor;
  color: AdminKPIColor;
  chartData?: number[];
}

export interface AdminDashboardBarPoint {
  name: string;
  value: number;
  isHighlighted?: boolean;
}

export interface AdminDashboardRevenuePoint {
  name: string;
  value: number;
}

export interface AdminDashboardPlanPoint {
  name: string;
  value: number;
  color: string;
}

export interface AdminDashboardTransactionItem {
  id: string;
  name: string;
  subtitle: string;
  amount: string;
  plan: string;
  icon: string;
  color: string;
}

export interface AdminDashboardTenantItem {
  id: string;
  name: string;
  subtitle: string;
  users: string;
  icon: string;
  color: string;
}

export interface AdminDashboardActivityItem {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
}

export interface AdminDashboardData {
  metrics: AdminDashboardMetric[];
  companiesSeries: AdminDashboardBarPoint[];
  revenueSeries: AdminDashboardRevenuePoint[];
  plansSeries: AdminDashboardPlanPoint[];
  recentTransactions: AdminDashboardTransactionItem[];
  recentTenants: AdminDashboardTenantItem[];
  recentActivities: AdminDashboardActivityItem[];
  generatedAt: string;
  warnings: string[];
}

const EMPTY_DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const EMPTY_MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function createEmptyAdminDashboard(): AdminDashboardData {
  return {
    metrics: [
      {
        title: "Total Companies",
        value: "0",
        percentage: "0 new",
        badgeColor: "green",
        color: "pink",
        chartData: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        title: "Active Companies",
        value: "0",
        percentage: "0% active",
        badgeColor: "green",
        color: "yellow",
        chartData: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        title: "Server Latency",
        value: "0ms",
        percentage: "No data",
        badgeColor: "green",
        color: "green",
        chartData: [0, 0, 0, 0, 0],
      },
      {
        title: "Total Earnings",
        value: "₱0.00",
        percentage: "0% vs prev month",
        badgeColor: "green",
        color: "red",
        chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
    companiesSeries: EMPTY_DAY_LABELS.map((name) => ({ name, value: 0 })),
    revenueSeries: EMPTY_MONTH_LABELS.map((name) => ({ name, value: 0 })),
    plansSeries: [],
    recentTransactions: [],
    recentTenants: [],
    recentActivities: [],
    generatedAt: new Date().toISOString(),
    warnings: [],
  };
}
