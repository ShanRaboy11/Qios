import React from "react";
import { DashboardListItem } from "@/components/molecules/DashboardListItem";
import type {
  AdminDashboardActivityItem,
  AdminDashboardTenantItem,
  AdminDashboardTransactionItem,
} from "@/lib/adminDashboard";

export interface AdminListsSectionProps {
  onViewSystemActivity?: () => void;
  onViewPendingTenants?: () => void;
  recentTransactions?: AdminDashboardTransactionItem[];
  recentTenants?: AdminDashboardTenantItem[];
  recentActivities?: AdminDashboardActivityItem[];
}

export const AdminListsSection = ({
  onViewSystemActivity,
  onViewPendingTenants,
  recentTransactions = [],
  recentTenants = [],
  recentActivities = [],
}: AdminListsSectionProps) => {
  const hasTransactions = recentTransactions.length > 0;
  const hasTenants = recentTenants.length > 0;
  const hasActivities = recentActivities.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 pb-10">
      {/* recent Transactions */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-transparent">
        <div className="flex justify-between items-center mb-5">
          <span className="h4 font-semibold text-text-primary">
            Recent Transactions
          </span>
          <button
            onClick={onViewSystemActivity}
            className="text-[13px] font-bold text-text-secondary hover:text-text-primary underline"
          >
            View All
          </button>
        </div>
        <div className="flex flex-col">
          {hasTransactions ? (
            recentTransactions.map((item, index) => (
              <DashboardListItem
                key={item.id}
                icon={
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[18px] ${item.color}`}
                  >
                    {item.icon}
                  </div>
                }
                title={item.name}
                subtitle={item.subtitle}
                isLast={index === recentTransactions.length - 1}
                rightContent={
                  <>
                    <span className="font-bold text-[#2D2D2D] text-[15px]">
                      {item.amount}
                    </span>
                    <span className="text-[12px] text-text-secondary">
                      {item.plan}
                    </span>
                  </>
                }
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-text-secondary">
              No recent transactions yet.
            </div>
          )}
        </div>
      </div>

      {/* recently Registered */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-transparent">
        <div className="flex justify-between items-center mb-5">
          <span className="h4 font-semibold text-text-primary">
            Recently Registered
          </span>
          <button
            onClick={onViewPendingTenants}
            className="text-[13px] font-bold text-text-secondary hover:text-text-primary underline"
          >
            View All
          </button>
        </div>
        <div className="flex flex-col">
          {hasTenants ? (
            recentTenants.map((item, index) => (
              <DashboardListItem
                key={item.id}
                icon={
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[18px] ${item.color}`}
                  >
                    {item.icon}
                  </div>
                }
                title={item.name}
                subtitle={item.subtitle}
                isLast={index === recentTenants.length - 1}
                rightContent={
                  <span className="font-semibold text-[#2D2D2D] text-[14px] mt-2">
                    {item.users}
                  </span>
                }
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-text-secondary">
              No tenant registrations yet.
            </div>
          )}
        </div>
      </div>

      {/* recent Activity */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-transparent">
        <div className="flex justify-between items-center mb-5">
          <span className="h4 font-semibold text-text-primary">
            Recent Activity
          </span>
          <button
            onClick={onViewSystemActivity}
            className="text-[13px] font-bold text-text-secondary hover:text-text-primary underline"
          >
            View All
          </button>
        </div>
        <div className="flex flex-col">
          {hasActivities ? (
            recentActivities.map((item, index) => (
              <DashboardListItem
                key={item.id}
                icon={
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[18px] ${item.color}`}
                  >
                    {item.icon}
                  </div>
                }
                title={item.name}
                subtitle={item.subtitle}
                isLast={index === recentActivities.length - 1}
                rightContent={
                  <span className="text-[13px] font-medium text-[#2D2D2D] mt-2">
                    {item.detail}
                  </span>
                }
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-text-secondary">
              No system activity yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
