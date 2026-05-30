"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { TransactionTable } from "@/components/organisms/TransactionTable";
import { DollarSign, TrendingUp, ShoppingBag, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  formatMoney, 
  type SalesMetrics, 
  type SalesTransactionRecord, 
  type SalesTransactionResponse 
} from "@/lib/salesDashboard";

interface MetricCardProps {
  title: string;
  value: string;
  trend: number;
  trendLabel?: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
}

const MetricCard = ({
  title,
  value,
  trend,
  trendLabel = "vs last period",
  icon,
  iconBgColor,
  iconTextColor,
}: MetricCardProps) => {
  const isPositive = trend >= 0;
  return (
    <div className="bg-white rounded-[16px] sm:rounded-[24px] shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col justify-between min-w-0">
      <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
        <div className="space-y-0.5 sm:space-y-1 min-w-0">
          <h3 className="text-[11px] sm:text-sm font-medium text-text-secondary leading-tight">{title}</h3>
          <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-text-primary truncate">{value}</p>
        </div>
        <div className={cn("w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0", iconBgColor, iconTextColor)}>
          <div className="scale-75 sm:scale-100 flex items-center justify-center">{icon}</div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-auto">
        <span className={cn("text-[11px] sm:text-sm font-semibold flex items-center gap-0.5 sm:gap-1", isPositive ? "text-green-600" : "text-red-600")}>
          {isPositive ? "↑" : "↓"} {Math.abs(trend)}%
        </span>
        <span className="text-[10px] sm:text-sm text-text-secondary truncate">{trendLabel}</span>
      </div>
    </div>
  );
};

const SalesMetricCards = ({ metrics, isLoading }: { metrics: SalesMetrics | null; isLoading: boolean }) => {
  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-[16px] sm:rounded-[24px] shadow-sm border border-gray-100 p-4 sm:p-6 animate-pulse">
            <div className="h-4 w-20 bg-gray-100 rounded mb-4" />
            <div className="h-8 w-28 bg-gray-100 rounded mb-4" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
      <MetricCard title="Gross Sales" value={formatMoney(metrics.grossSales)} trend={metrics.grossTrend} icon={<DollarSign size={24} />} iconBgColor="bg-green-100" iconTextColor="text-green-600" />
      <MetricCard title="Net Sales" value={formatMoney(metrics.netSales)} trend={metrics.netTrend} icon={<TrendingUp size={24} />} iconBgColor="bg-orange-100" iconTextColor="text-orange-600" />
      <MetricCard title="Total Orders" value={metrics.totalOrders.toLocaleString()} trend={metrics.totalOrdersTrend} icon={<ShoppingBag size={24} />} iconBgColor="bg-blue-100" iconTextColor="text-blue-600" />
      <MetricCard title="Avg Order Value" value={formatMoney(metrics.averageOrderValue)} trend={metrics.averageOrderValueTrend} icon={<CreditCard size={24} />} iconBgColor="bg-purple-100" iconTextColor="text-purple-600" />
    </div>
  );
};

export default function TransactionsPage() {
  const params = useParams();
  const tenantId = params?.id as string;
  const apiPath = `/api/tenants/${tenantId}/employee/transactions`;

  const [data, setData] = useState<SalesTransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) return;
    const fetchFullData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiPath}?all=true`);
        const json = (await res.json()) as SalesTransactionResponse;
        if (json.data) setData(json.data);
      } catch (e) {
        console.error("Error fetching stats", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFullData();
  }, [tenantId, apiPath]);

  const metrics = useMemo<SalesMetrics | null>(() => {
    const gross = data.reduce((acc, tx) => acc + (tx.total || 0), 0);
    const net = data.filter(tx => tx.status !== 'cancelled').reduce((acc, tx) => acc + (tx.total || 0), 0);
    const count = data.length;
    return {
      grossSales: gross, grossTrend: 100,
      netSales: net, netTrend: 100,
      totalOrders: count, totalOrdersTrend: 100,
      averageOrderValue: count > 0 ? net / count : 0, averageOrderValueTrend: 100
    };
  }, [data]);

  return (
    <>
      <header className="mb-2">
        <h2 className="h2 text-text-primary font-bold">Transactions</h2>
        <p className="b1 text-text-secondary mt-2">
          Review today&apos;s orders and payment history
        </p>
      </header>

      <div className="mt-6">
        <SalesMetricCards metrics={metrics} isLoading={loading} />
      </div>

      <div className="mt-8">
    <TransactionTable
      tenantId={tenantId}
      businessName=""
      apiPath={`/api/tenants/${tenantId}/employee/transactions`}
    />
  </div>
    </>
  );
}