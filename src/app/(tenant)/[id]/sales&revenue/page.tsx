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
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Dropdown } from "@/components/molecules/Dropdown";
import { cn } from "@/lib/utils";

// --- Mock Data ---
const RECENT_ACTIVITY = [
  { id: "INV-1234", type: "Invoice", entity: "Acme Corp", amount: "$2,340", time: "2 hours ago", color: "success" as const },
  { id: "PRD-104", type: "Stock", entity: "Beta LLC", amount: "2 units", time: "1 hour ago", color: "warning" as const },
  { id: "PA-9283", type: "Payment", entity: "Gamma Inc", amount: "$3,200", time: "30 mins ago", color: "info" as const },
  { id: "PRD-105", type: "Stock", entity: "Beta LLC", amount: "5 units", time: "15 mins ago", color: "warning" as const },
];

const CHART_DATA = [
  { month: "JAN", ltv: 85, cost: 65, ltvLabel: "$8.68m", costLabel: "98 units" },
  { month: "FEB", ltv: 60, cost: 80, ltvLabel: "$8.48m", costLabel: "120 units" },
  { month: "MAR", ltv: 75, cost: 15, ltvLabel: "$8.60m", costLabel: "23 units" },
  { month: "APR", ltv: 30, cost: 50, ltvLabel: "$8.24m", costLabel: "75 units" },
  { month: "MAY", ltv: 95, cost: 40, ltvLabel: "$8.76m", costLabel: "60 units" },
  { month: "JUN", ltv: 80, cost: 30, ltvLabel: "$8.64m", costLabel: "45 units" },
];

// --- Sub-components ---
const StatCard = ({ title, value, trend, icon, delay = 0 }: { title: string, value: string, trend: number, icon: React.ReactNode, delay?: number }) => {
  const isPositive = trend > 0;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
      className="flex-1 min-w-[240px] p-6 bg-white rounded-2xl shadow-sm border border-kds-border-warm transition-shadow group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <p className="text-text-secondary b4 font-bold uppercase tracking-widest opacity-80">{title}</p>
          <h3 className="h3 text-text-primary tracking-tight">{value}</h3>
        </div>
        <div className="p-3 bg-brand-primary/10 rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-colors text-brand-primary">
          {icon}
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <Badge 
          color={isPositive ? "success" : "error"} 
          variant="subtle" 
          leftIcon={isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        >
          {isPositive ? "+" : ""}{trend}%
        </Badge>
        <button className="text-text-secondary hover:text-brand-primary b5 font-bold uppercase flex items-center gap-1 transition-all hover:translate-x-1">
          Details <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default function SalesRevenueSuite() {
  const [activeTab, setActiveTab] = useState("Sales Fluctuations");
  const [timeRange, setTimeRange] = useState("all-time");
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-bg-primary p-6 md:p-12 space-y-10 font-inter kds-fade-in">
      
      {/* ─── Header Section ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-1">
          <h1 className="h2 text-text-primary tracking-tighter">Executive Overview</h1>
          <p className="b2 text-text-secondary">Real-time performance tracking and commercial revenue analysis.</p>
        </div>
      </div>

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Gross Sales" value="$8,458,798" trend={-35} icon={<DollarSign size={24} />} delay={0.1} />
        <StatCard title="Net Revenue" value="$6,120,450" trend={12.5} icon={<ArrowUpRight size={24} />} delay={0.2} />
        <StatCard title="Total Orders" value="3,250" trend={8.2} icon={<ShoppingCart size={24} />} delay={0.3} />
        <StatCard title="Avg. Order Value" value="$2,450" trend={15} icon={<Package size={24} />} delay={0.4} />
      </div>

      <div className="w-full h-px bg-brand-accent/30 my-4" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ─── Analytics Section ─── */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex gap-4">
           {["Growth Trends", "Peak Periods", "Sales Fluctuations"].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "primary" : "outline"}
                size="sm"
                shape="pill"
                onClick={() => setActiveTab(tab)}
                className={cn("px-6 font-normal", activeTab === tab ? "shadow-lg scale-105" : "bg-white/50")}
              >
                {tab}
              </Button>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] p-8 md:p-10 border border-kds-border-warm shadow-sm flex flex-col relative kds-slide-up"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="h4 text-text-primary tracking-tight">{activeTab}</h2>
                <div className="flex items-center">
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
                        className="w-36 md:w-44"
                    />            
                </div>
            </div>

            {/* Graph Area */}
            <div className="relative h-[280px] mb-2">
              <div className="absolute left-0 h-full flex flex-col justify-between b4 text-gray-400 z-0 pointer-events-none">
                {["$8.8m", "$8.6m", "$8.4m", "$8.2m", "$8m"].map(v => <div key={v} className="h-0 flex items-center"><span>{v}</span></div>)}
              </div>

              <div className="absolute right-0 h-full flex flex-col justify-between b4 text-gray-400 text-right z-0 pointer-events-none">
                {["150", "120", "60", "30", "0"].map(v => <div key={v} className="h-0 flex items-center justify-end w-full"><span>{v}</span></div>)}
              </div>
              
              <div className="absolute inset-x-12 top-0 h-full flex flex-col justify-between pointer-events-none z-0">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full border-t border-gray-100" />
                ))}
              </div>

              <div className="absolute inset-x-12 top-0 h-full flex items-end justify-between px-4 z-10">
                {CHART_DATA.map((item) => (
                  <div 
                    key={item.month} 
                    className="flex-1 flex flex-col items-center group/item h-full relative cursor-pointer"
                    onMouseEnter={() => setHoveredMonth(item.month)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    {/* NON-REDUNDANT TOOLTIP: Colors + Values only */}
                    <AnimatePresence>
                        {hoveredMonth === item.month && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: -20 }} 
                                exit={{ opacity: 0 }} 
                                className="absolute -top-12 bg-zinc-900 text-white px-3 py-1.5 rounded-full text-[10px] z-50 shadow-xl pointer-events-none border border-white/10"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-[#FFD77A] rounded-full" />
                                        <span className="font-bold">{item.ltvLabel}</span>
                                    </div>
                                    <div className="w-px h-2 bg-white/20" />
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-[#FF5269] rounded-full" />
                                        <span className="font-bold">{item.costLabel}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className={cn(
                        "flex items-end justify-center gap-1.5 h-full transition-all duration-300",
                        hoveredMonth && hoveredMonth !== item.month ? "opacity-20 grayscale" : "opacity-100"
                    )}>
                        <motion.div initial={{ height: 0 }} animate={{ height: `${item.ltv}%` }} className="w-6 md:w-8 bg-[#FFD77A] rounded-t-md shadow-sm group-hover/item:brightness-105" />
                        <motion.div initial={{ height: 0 }} animate={{ height: `${item.cost}%` }} className="w-6 md:w-8 bg-[#FF5269] rounded-t-md shadow-sm group-hover/item:brightness-105" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center px-[4.5rem] mb-8">
              {CHART_DATA.map((item) => (
                <div key={item.month} className="flex-1 text-center">
                  <span className={cn(
                    "b4 font-bold uppercase tracking-widest transition-colors",
                    hoveredMonth === item.month ? "text-brand-accent scale-110" : "text-gray-400"
                  )}>
                    {item.month}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FFD77A] rounded-full" />
                <span className="b5 font-bold text-text-secondary uppercase tracking-widest">Lifetime Value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FF5269] rounded-full" />
                <span className="b5 font-bold text-text-secondary uppercase tracking-widest">Customer Cost</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Recent Activity Section ─── */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-[32px] border border-kds-border-warm shadow-sm flex flex-col overflow-hidden"
        >
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h4 className="h5 font-medium text-text-primary">Recent Activity</h4>
            <div className="flex items-center gap-2">
                <Button variant="accent" shape="pill" size="sm" leftIcon={<Download size={16} />}>
                    Export Reports
                </Button>
            </div>
          </div>
          
          <div className="p-4 space-y-3 overflow-y-auto max-h-[500px] scrollbar-none">
            <AnimatePresence>
              {RECENT_ACTIVITY.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + (index * 0.1) }}
                  whileHover={{ x: 5, backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-bg-primary rounded-2xl flex items-center justify-between transition-all group cursor-pointer border border-transparent"
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
                        <span className="b2 font-bold text-text-primary group-hover:text-brand-accent transition-colors">{activity.id}</span>
                        <Badge variant="subtle" color={activity.color}>{activity.type}</Badge>
                      </div>
                      <p className="b5 text-text-secondary font-bold uppercase tracking-tighter">{activity.entity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="b2 font-bold text-text-primary">{activity.amount}</div>
                    <p className="b5 text-text-tertiary font-medium">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="p-8 mt-auto">
            <Button variant="outline" shape="pill" className="w-full py-4 text-xs font-bold uppercase tracking-widest">
              View Audit Log
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}