export type SalesPeriod = "today" | "week" | "month";

export interface SalesMetrics {
  grossSales: number;
  netSales: number;
  totalOrders: number;
  averageOrderValue: number;
  grossTrend: number;
  netTrend: number;
  totalOrdersTrend: number;
  averageOrderValueTrend: number;
}

export interface RevenuePoint {
  label: string;
  sales: number;
  orders: number;
}

export interface TopSellingItem {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  trend: number;
}

export interface SalesOverviewResponse {
  businessName: string;
  period: SalesPeriod;
  generatedAt: string;
  metrics: SalesMetrics;
  revenueSeries: RevenuePoint[];
  topItems: TopSellingItem[];
}

export interface SalesTransactionRecord {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  createdAt: string;
  items: string;
  method: string;
  status: string;
  paymentStatus: string;
  total: number;
  tableNumber: string | null;
}

export interface SalesTransactionResponse {
  businessName: string;
  data: SalesTransactionRecord[];
  total: number;
  page: number;
  limit: number;
}

export type DashboardDateRangePreset = "week" | "month" | "year" | "all-time";

export interface DashboardDateRange {
  preset: DashboardDateRangePreset;
  startDate: Date | null;
  endDate: Date;
  startIso: string | null;
  endIso: string;
  previousStartIso: string | null;
  previousEndIso: string | null;
  label: string;
}

const MANILA_TIME_ZONE = "Asia/Manila";

function getIntlParts(
  date: Date,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormatPart[] {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: MANILA_TIME_ZONE,
    ...options,
  }).formatToParts(date);
}

export function getManilaDateKey(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  const parts = getIntlParts(value, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

export function getManilaHourKey(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  const parts = getIntlParts(value, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  });

  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";
  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";

  return `${year}-${month}-${day}-${hour}`;
}

export function formatManilaDate(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: MANILA_TIME_ZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export function formatManilaTime(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: MANILA_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function trendPercent(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
}

function shiftManilaDateKey(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T00:00:00+08:00`);
  date.setUTCDate(date.getUTCDate() + days);
  return getManilaDateKey(date);
}

export function getPeriodRange(period: SalesPeriod) {
  const todayKey = getManilaDateKey(new Date());
  const dayCount = period === "today" ? 1 : period === "week" ? 7 : 30;
  const currentStartKey = shiftManilaDateKey(todayKey, -(dayCount - 1));
  const previousStartKey = shiftManilaDateKey(currentStartKey, -dayCount);

  return {
    currentStartIso: `${currentStartKey}T00:00:00+08:00`,
    currentEndIso: new Date().toISOString(),
    previousStartIso: `${previousStartKey}T00:00:00+08:00`,
    previousEndIso: `${currentStartKey}T00:00:00+08:00`,
  };
}

export function formatManilaDateRangeLabel(
  startDate: Date | string | null,
  endDate: Date | string | null,
) {
  if (!startDate || !endDate) {
    return "All Time";
  }

  const formatDate = (date: Date | string) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: MANILA_TIME_ZONE,
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(typeof date === "string" ? new Date(date) : date);

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function getDashboardDateRange(
  preset: DashboardDateRangePreset = "week",
): DashboardDateRange {
  const endDate = new Date();
  const startDate = new Date(endDate);

  if (preset === "week") {
    startDate.setDate(startDate.getDate() - 6);
    const previousEndDate = new Date(startDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);
    const previousStartDate = new Date(previousEndDate);
    previousStartDate.setDate(previousStartDate.getDate() - 6);

    return {
      preset,
      startDate,
      endDate,
      startIso: `${getManilaDateKey(startDate)}T00:00:00+08:00`,
      endIso: `${getManilaDateKey(endDate)}T23:59:59.999+08:00`,
      previousStartIso: `${getManilaDateKey(previousStartDate)}T00:00:00+08:00`,
      previousEndIso: `${getManilaDateKey(previousEndDate)}T23:59:59.999+08:00`,
      label: formatManilaDateRangeLabel(startDate, endDate),
    };
  }

  if (preset === "month") {
    startDate.setDate(startDate.getDate() - 29);
    const previousEndDate = new Date(startDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);
    const previousStartDate = new Date(previousEndDate);
    previousStartDate.setDate(previousStartDate.getDate() - 29);

    return {
      preset,
      startDate,
      endDate,
      startIso: `${getManilaDateKey(startDate)}T00:00:00+08:00`,
      endIso: `${getManilaDateKey(endDate)}T23:59:59.999+08:00`,
      previousStartIso: `${getManilaDateKey(previousStartDate)}T00:00:00+08:00`,
      previousEndIso: `${getManilaDateKey(previousEndDate)}T23:59:59.999+08:00`,
      label: formatManilaDateRangeLabel(startDate, endDate),
    };
  }

  if (preset === "year") {
    startDate.setDate(startDate.getDate() - 364);
    const previousEndDate = new Date(startDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);
    const previousStartDate = new Date(previousEndDate);
    previousStartDate.setDate(previousStartDate.getDate() - 364);

    return {
      preset,
      startDate,
      endDate,
      startIso: `${getManilaDateKey(startDate)}T00:00:00+08:00`,
      endIso: `${getManilaDateKey(endDate)}T23:59:59.999+08:00`,
      previousStartIso: `${getManilaDateKey(previousStartDate)}T00:00:00+08:00`,
      previousEndIso: `${getManilaDateKey(previousEndDate)}T23:59:59.999+08:00`,
      label: formatManilaDateRangeLabel(startDate, endDate),
    };
  }

  return {
    preset,
    startDate: null,
    endDate,
    startIso: null,
    endIso: `${getManilaDateKey(endDate)}T23:59:59.999+08:00`,
    previousStartIso: null,
    previousEndIso: null,
    label: "All Time",
  };
}
