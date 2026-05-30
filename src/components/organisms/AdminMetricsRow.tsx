import React from "react";
import { AdminKPICard } from "@/components/molecules/AdminKPICard";
import { Users, Building2, Activity, DollarSign } from "lucide-react";
import type { AdminDashboardMetric } from "@/lib/adminDashboard";

interface AdminMetricsRowProps {
  metrics?: AdminDashboardMetric[];
}

const metricIcons = [
  <Users size={20} key="companies" />,
  <Building2 size={20} key="active" />,
  <Activity size={20} key="latency" />,
  <DollarSign size={20} key="earnings" />,
];

export const AdminMetricsRow = ({ metrics }: AdminMetricsRowProps) => {
  const resolvedMetrics = metrics ?? [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      {(resolvedMetrics.length > 0 ? resolvedMetrics : []).map((metric, index) => (
        <AdminKPICard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          percentage={metric.percentage}
          badgeColor={metric.badgeColor}
          icon={metricIcons[index] ?? <Users size={20} />}
          color={metric.color}
          chartData={metric.chartData}
        />
      ))}
    </div>
  );
};
