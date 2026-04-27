import React from "react";
import { AdminKPICard } from "@/components/molecules/AdminKPICard";
import { Users, Building2, Activity, DollarSign } from "lucide-react";

export const AdminMetricsRow = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      <AdminKPICard
        title="Total Companies"
        value="5468"
        percentage="+19.01%"
        badgeColor="green"
        icon={<Users size={20} />}
        color="pink"
        chartData={[3, 5, 4, 7, 5, 8, 4, 6]}
      />
      <AdminKPICard
        title="Active Companies"
        value="4598"
        percentage="-12%"
        badgeColor="green"
        icon={<Building2 size={20} />}
        color="yellow"
        chartData={[8, 7, 5, 6, 4, 5, 3, 4]}
      />
      <AdminKPICard
        title="Server Latency"
        value="34ms"
        percentage="Stable"
        badgeColor="green"
        icon={<Activity size={20} />}
        color="green"
        chartData={[4, 5, 4, 6, 5, 5, 4, 5]}
      />
      <AdminKPICard
        title="Total Earnings"
        value="$89,878,58"
        percentage="-16%"
        badgeColor="red"
        icon={<DollarSign size={20} />}
        color="red"
        chartData={[6, 8, 7, 9, 7, 5, 4, 3]}
      />
    </div>
  );
};
