"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  ArrowUpRight, 
  Download, 
  FileText, 
  Package, 
  CreditCard,
  MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Dropdown } from "@/components/molecules/Dropdown";
import { cn } from "@/lib/utils";

// --- Types ---
interface StatCardProps {
  title: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
  delay?: number;
}

// --- Mock Data ---
const RECENT_ACTIVITY = [
  { id: "INV-1234", type: "Invoice", entity: "Acme Corp", amount: "$2,340", time: "2 hours ago", status: "success" },
  { id: "PRD-104", type: "Stock", entity: "Beta LLC", amount: "2 units", time: "1 hour ago", status: "warning" },
  { id: "PA-9283", type: "Payment", entity: "Gamma Inc", amount: "$3,200", time: "30 mins ago", status: "info" },
  { id: "PRD-105", type: "Stock", entity: "Beta LLC", amount: "5 units", time: "15 mins ago", status: "warning" },
];

// Data adjusted to match visual peaks in image
const CHART_DATA = [
  { month: "Jan", ltv: 85, cost: 65 },
  { month: "Feb", ltv: 60, cost: 80 },
  { month: "Mar", ltv: 75, cost: 15 },
  { month: "Apr", ltv: 30, cost: 50 },
  { month: "May", ltv: 95, cost: 40 },
  { month: "Jun", ltv: 80, cost: 30 },
];

// --- Sub-components ---

const StatCard = ({ title, value, trend, icon, delay = 0 }: StatCardProps) => {
  const isPositive = trend > 0;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex-1 min-w-[240px] p-6 bg-white rounded-2xl shadow-sm border border-kds-border-warm hover:shadow-md transition-shadow group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <p className="text-text-secondary b4 font-medium uppercase tracking-wider">{title}</p>
          <h3 className="h3 text-text-primary">{value}</h3>
        </div>
        <div className="p-3 bg-brand-primary/10 rounded-xl group-hover:bg-brand-primary/20 transition-colors text-brand-primary">
          {icon}
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <Badge 
          color={isPositive ? "success" : "error"} 
          variant="subtle" 
          leftIcon={isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        >
          {isPositive ? "+" : ""}{trend}% vs last month
        </Badge>
        <button className="text-text-secondary hover:text-brand-primary b1 font-semibold underline underline-offset-4 decoration-brand-primary/30 transition-colors">
          View All
        </button>
      </div>
    </motion.div>
  );
};

export default function SalesRevenueSuite() {
  const [activeTab, setActiveTab] = useState("Sales Fluctuations");
  const [timeRange, setTimeRange] = useState("all-time");

  return (
    <div className="min-h-screen bg-bg-primary p-6 md:p-12 space-y-8 font-inter">
      
      {/* Header Section - No change */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <h1 className="h2 text-text-primary">Executive Overview</h1>
          <p className="b2 text-text-secondary">Real-time performance tracking and revenue analysis</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Dropdown
            label=""
            size="sm"
            value={timeRange}
            onSelect={(opt) => setTimeRange(opt.value)}
            options={[
              { label: "All Time", value: "all-time" },
              { label: "Last 30 Days", value: "30d" },
              { label: "Last Quarter", value: "quarter" },
            ]}
            className="w-44"
          />
          <Button variant="accent" shape="pill" leftIcon={<Download size={18} />}>
            Export Reports
          </Button>
        </motion.div>
      </div>

      {/* Stats Grid - No change */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Gross Sales" value="$8,458,798" trend={-35} icon={<DollarSign size={24} />} delay={0.1} />
        <StatCard title="Net Revenue" value="$6,120,450" trend={12.5} icon={<ArrowUpRight size={24} />} delay={0.2} />
        <StatCard title="Total Orders" value="3,250" trend={8.2} icon={<ShoppingCart size={24} />} delay={0.3} />
        <StatCard title="Avg. Order Value" value="$2,450" trend={15} icon={<Package size={24} />} delay={0.4} />
      </div>

      {/* ─── IMPLEMENTED PART (IMAGE) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Tab Navigation */}
          <div className="flex gap-3">
            {["Growth Trends", "Peak Periods", "Sales Fluctuations"].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "primary" : "outline"}
                size="sm"
                shape="pill"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 transition-all",
                  activeTab === tab ? "shadow-lg border-transparent" : "bg-white/50 border-orange-200 text-orange-400"
                )}
              >
                {tab}
              </Button>
            ))}
          </div>

          {/* Main Chart Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] p-8 border border-kds-border-warm shadow-sm flex flex-col relative"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-[28px] font-semibold text-text-primary">{activeTab}</h2>
              <Dropdown
                label=""
                size="sm"
                value="all"
                options={[{ label: "All Time", value: "all" }]}
                className="w-32"
              />
            </div>

            <div className="relative h-[320px] flex items-end justify-between px-12 mb-8">
              {/* Left Y-Axis (Currency) */}
              <div className="absolute left-0 h-full flex flex-col justify-between text-[11px] font-medium text-gray-400 py-2">
                <span>$8.8m</span><span>$8.6m</span><span>$8.4m</span><span>$8.2m</span><span>$8m</span>
              </div>

              {/* Right Y-Axis (Units) */}
              <div className="absolute right-0 h-full flex flex-col justify-between text-[11px] font-medium text-gray-400 py-2 text-right">
                <span>150</span><span>120</span><span>60</span><span>30</span><span>0</span>
              </div>

              {/* Horizontal Grid Lines */}
              <div className="absolute inset-x-12 top-0 bottom-0 flex flex-col justify-between pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full border-t border-gray-100" />
                ))}
              </div>

              {/* Bars */}
              {CHART_DATA.map((item, i) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-4 group z-10">
                  <div className="flex items-end justify-center gap-1.5 h-64">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${item.ltv}%` }}
                      className="w-8 md:w-10 bg-[#FFD77A] rounded-t-md shadow-sm"
                    />
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${item.cost}%` }}
                      className="w-8 md:w-10 bg-[#FF5269] rounded-t-md shadow-sm"
                    />
                  </div>
                  <span className="b4 font-semibold text-gray-400">{item.month}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#FFD77A] rounded-sm" />
                <span className="b4 font-bold text-text-secondary uppercase">Lifetime Value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#FF5269] rounded-sm" />
                <span className="b4 font-bold text-text-secondary uppercase">Customer Cost</span>
              </div>
            </div>
          </motion.div>
        </div>
        {/* ─── END IMPLEMENTED PART ─── */}

        {/* Recent Activity Section - No change */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-[24px] border border-kds-border-warm shadow-sm flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h4 className="b2 font-bold text-text-primary">Recent Activity</h4>
            <Button variant="ghost" size="icon">
              <MoreVertical size={18} />
            </Button>
          </div>
          
          <div className="p-4 space-y-3 overflow-y-auto max-h-[500px] scrollbar-none">
            <AnimatePresence>
              {RECENT_ACTIVITY.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + (index * 0.1) }}
                  className="p-4 bg-bg-primary rounded-2xl flex items-center justify-between hover:bg-orange-50/50 transition-colors group cursor-pointer border border-transparent hover:border-brand-primary/10"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-xl transition-transform group-hover:scale-110",
                      activity.type === "Invoice" ? "bg-success-secondary text-success-primary" : 
                      activity.type === "Stock" ? "bg-warning-secondary text-warning-primary" : "bg-blue-100 text-blue-600"
                    )}>
                      {activity.type === "Invoice" && <FileText size={20} />}
                      {activity.type === "Stock" && <Package size={20} />}
                      {activity.type === "Payment" && <CreditCard size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="b2 font-bold text-text-primary">{activity.id}</span>
                        <Badge variant="subtle" color={activity.status as any} className="scale-75 origin-left">
                          {activity.type}
                        </Badge>
                      </div>
                      <p className="b4 text-text-secondary">{activity.entity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="b2 font-bold text-text-primary">{activity.amount}</div>
                    <p className="b5 text-text-tertiary">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="p-6 mt-auto">
            <Button variant="outline" className="w-full">
              View Detailed Audit Log
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}