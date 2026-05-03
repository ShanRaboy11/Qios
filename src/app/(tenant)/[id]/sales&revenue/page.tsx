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

const CHART_DATA = [
  { month: "Jan", ltv: 80, cost: 50 },
  { month: "Feb", ltv: 60, cost: 75 },
  { month: "Mar", ltv: 70, cost: 30 },
  { month: "Apr", ltv: 40, cost: 45 },
  { month: "May", ltv: 90, cost: 40 },
  { month: "Jun", ltv: 75, cost: 25 },
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
      
      {/* Header Section */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Gross Sales" value="$8,458,798" trend={-35} icon={<DollarSign size={24} />} delay={0.1} />
        <StatCard title="Net Revenue" value="$6,120,450" trend={12.5} icon={<ArrowUpRight size={24} />} delay={0.2} />
        <StatCard title="Total Orders" value="3,250" trend={8.2} icon={<ShoppingCart size={24} />} delay={0.3} />
        <StatCard title="Avg. Order Value" value="$2,450" trend={15} icon={<Package size={24} />} delay={0.4} />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Analytics Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-[24px] border border-kds-border-warm shadow-sm overflow-hidden flex flex-col"
        >
          <div className="p-8 border-b border-gray-50 space-y-6">
            <div className="flex flex-wrap gap-2">
              {["Growth Trends", "Peak Periods", "Sales Fluctuations"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "transition-all",
                    activeTab === tab ? "shadow-md" : "hover:bg-brand-primary/5"
                  )}
                >
                  {tab}
                </Button>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <h4 className="h4 text-text-primary">{activeTab}</h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-primary" />
                  <span className="b4 text-text-secondary font-medium">Lifetime Value</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-accent" />
                  <span className="b4 text-text-secondary font-medium">Customer Cost</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 flex-1 flex items-end justify-between gap-4 min-h-[300px]">
            {CHART_DATA.map((item, i) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full flex items-end justify-center gap-1.5 h-48 relative">
                  {/* LTV Bar */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${item.ltv}%` }}
                    transition={{ delay: 0.6 + (i * 0.1), type: "spring", stiffness: 50 }}
                    className="w-1/3 bg-brand-primary rounded-t-lg relative group-hover:brightness-105 transition-all shadow-sm"
                  />
                  {/* Cost Bar */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${item.cost}%` }}
                    transition={{ delay: 0.7 + (i * 0.1), type: "spring", stiffness: 50 }}
                    className="w-1/3 bg-brand-accent rounded-t-lg relative group-hover:brightness-105 transition-all shadow-sm"
                  />
                </div>
                <span className="b4 font-semibold text-text-secondary">{item.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Section */}
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
                      activity.type === "Invoice" ? "bg-green-100 text-green-600" : 
                      activity.type === "Stock" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
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