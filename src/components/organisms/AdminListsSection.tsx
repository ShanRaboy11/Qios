import React from "react";
import { DashboardListItem } from "@/components/molecules/DashboardListItem";

// Dummy Data
const transactions = [
  {
    id: 1,
    name: "Stellar Dynamics",
    sub: "#12457 • 14 Jan 2025",
    amount: "+$245",
    plan: "Basic",
    icon: "S",
    color: "bg-[#E6FFE6] text-[#22C55E]",
  },
  {
    id: 2,
    name: "Quantum Nexus",
    sub: "#65974 • 10 Jan 2025",
    amount: "+$395",
    plan: "Enterprise",
    icon: "Q",
    color: "bg-[#E6F0FF] text-[#3B82F6]",
  },
  {
    id: 3,
    name: "Aurora Technologies",
    sub: "#22457 • 08 Jan 2025",
    amount: "+$145",
    plan: "Advanced",
    icon: "A",
    color: "bg-[#F3E8FF] text-[#A855F7]",
  },
  {
    id: 4,
    name: "TerraFusion Energy",
    sub: "#43412 • 06 Jan 2025",
    amount: "+$758",
    plan: "Enterprise",
    icon: "T",
    color: "bg-[#FFEBE6] text-[#EF4444]",
  },
  {
    id: 5,
    name: "Epicurean Delights",
    sub: "#43567 • 03 Jan 2025",
    amount: "+$977",
    plan: "Premium",
    icon: "E",
    color: "bg-[#E6F0FF] text-[#3B82F6]",
  },
];

const registered = [
  {
    id: 1,
    name: "Pitch",
    sub: "Basic (Monthly)",
    users: "150 Users",
    icon: "P",
    color: "bg-[#2D2D2D] text-white",
  },
  {
    id: 2,
    name: "Initech",
    sub: "Enterprise (Yearly)",
    users: "200 Users",
    icon: "I",
    color: "bg-[#F3E8FF] text-[#A855F7]",
  },
  {
    id: 3,
    name: "Umbrella Corp",
    sub: "Advanced (Monthly)",
    users: "108 Users",
    icon: "U",
    color: "bg-[#FFEBE6] text-[#EF4444]",
  },
  {
    id: 4,
    name: "Capital Partners",
    sub: "Enterprise (Monthly)",
    users: "110 Users",
    icon: "C",
    color: "bg-[#FFF4E6] text-[#F97316]",
  },
  {
    id: 5,
    name: "Massive Dynamic",
    sub: "Premium (Yearly)",
    users: "120 Users",
    icon: "M",
    color: "bg-[#F2F2F2] text-[#2D2D2D]",
  },
];

const expiry = [
  {
    id: 1,
    name: "Silicon Corp",
    sub: "Expired : 10 Apr 2025",
    icon: "S",
    color: "bg-[#E6F0FF] text-[#3B82F6]",
  },
  {
    id: 2,
    name: "Hubspot",
    sub: "Expired : 12 Jun 2025",
    icon: "H",
    color: "bg-[#FFF4E6] text-[#F97316]",
  },
  {
    id: 3,
    name: "Licon Industries",
    sub: "Expired : 16 Jun 2025",
    icon: "L",
    color: "bg-[#E6F0FF] text-[#3B82F6]",
  },
  {
    id: 4,
    name: "TerraFusion Energy",
    sub: "Expired : 12 May 2025",
    icon: "T",
    color: "bg-[#FFEBE6] text-[#EF4444]",
  },
  {
    id: 5,
    name: "Epicurean Delights",
    sub: "Expired : 15 May 2025",
    icon: "E",
    color: "bg-[#E6F0FF] text-[#3B82F6]",
  },
];

export interface AdminListsSectionProps {
  onViewSystemActivity?: () => void;
  onViewPendingTenants?: () => void;
}

export const AdminListsSection = ({ onViewSystemActivity, onViewPendingTenants }: AdminListsSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 pb-10">
      {/* Recent Transactions */}
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
          {transactions.map((item, index) => (
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
              subtitle={item.sub}
              isLast={index === transactions.length - 1}
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
          ))}
        </div>
      </div>

      {/* Recently Registered */}
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
          {registered.map((item, index) => (
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
              subtitle={item.sub}
              isLast={index === registered.length - 1}
              rightContent={
                <span className="font-semibold text-[#2D2D2D] text-[14px] mt-2">
                  {item.users}
                </span>
              }
            />
          ))}
        </div>
      </div>

      {/* Recent Plan Expiry */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-transparent">
        <div className="flex justify-between items-center mb-5">
          <span className="h4 font-semibold text-text-primary">
            Recent Plan Expiry
          </span>
          <button className="text-[13px] font-bold text-text-secondary hover:text-text-primary underline">
            View All
          </button>
        </div>
        <div className="flex flex-col">
          {expiry.map((item, index) => (
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
              subtitle={item.sub}
              isLast={index === expiry.length - 1}
              rightContent={
                <button className="text-[13px] font-medium text-[#FF5269] hover:underline mt-2">
                  Send Reminder
                </button>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};
