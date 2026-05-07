"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Plus, Search } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import { StaffTable, StaffEntry } from "@/components/organisms/StaffTable";
import {
  StaffLeaderboard,
  LeaderboardEntry,
} from "@/components/organisms/StaffLeaderboard";
import {
  LiveActivityFeed,
  ActivityEntry,
} from "@/components/organisms/LiveActivityFeed";
import {
  StaffAnalyticsChart,
  AnalyticsDataPoint,
} from "@/components/organisms/StaffAnalyticsChart";
import { AddStaffModal } from "@/components/organisms/AddStaffModal";
import { StaffProfileModal } from "@/components/organisms/StaffProfileModal";

// mock data
const INITIAL_STAFF: StaffEntry[] = [
  {
    id: "1",
    name: "Angelo Troy Rivera",
    email: "angelo@qios.com",
    role: "Head Chef",
    department: "Kitchen",
    status: "Active",
    lastActive: "Just now",
  },
  {
    id: "2",
    name: "Nathaniel Porcalla",
    email: "nathaniel@qios.com",
    role: "Manager",
    department: "Operations",
    status: "Active",
    lastActive: "5m ago",
  },
  {
    id: "3",
    name: "Akira Morishita",
    email: "akira@qios.com",
    role: "Cashier",
    department: "Front of House",
    status: "Active",
    lastActive: "1m ago",
  },
  {
    id: "4",
    name: "John Lloyd Toreliza",
    email: "john@qios.com",
    role: "Line Cook",
    department: "Kitchen",
    status: "On Leave",
    lastActive: "2 days ago",
  },
  {
    id: "5",
    name: "Michael Claver Jr.",
    email: "michael@qios.com",
    role: "Server",
    department: "Front of House",
    status: "Suspended",
    lastActive: "1 week ago",
  },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: "1",
    rank: 1,
    name: "Angelo Troy Rivera",
    volume: 84,
    performance: "Excellent",
  },
  {
    id: "2",
    rank: 2,
    name: "Nathaniel Porcalla",
    volume: 72,
    performance: "Excellent",
  },
  {
    id: "3",
    rank: 3,
    name: "Akira Morishita",
    volume: 45,
    performance: "Moderate",
  },
  {
    id: "4",
    rank: 4,
    name: "John Lloyd Toreliza",
    volume: 68,
    performance: "Moderate",
  },
  {
    id: "5",
    rank: 5,
    name: "Michael Claver Jr.",
    volume: 20,
    performance: "Poor",
  },
];

const MOCK_ACTIVITIES: ActivityEntry[] = [
  {
    id: "1",
    name: "Maria",
    action: "Completed Order #68321",
    time: "Just now",
    status: "success",
  },
  {
    id: "2",
    name: "Juan",
    action: "Processing Order #5247",
    time: "1m ago",
    status: "warning",
  },
  {
    id: "3",
    name: "Justin",
    action: "Completed Order #2487",
    time: "2m ago",
    status: "success",
  },
  {
    id: "4",
    name: "Ken",
    action: "Cancelled Order #1636",
    time: "3m ago",
    status: "error",
  },
  {
    id: "5",
    name: "DJ",
    action: "Processing Order #1389",
    time: "3m ago",
    status: "warning",
  },
  {
    id: "6",
    name: "Maria",
    action: "Processing Order #8821",
    time: "3m ago",
    status: "warning",
  },
  {
    id: "7",
    name: "Kian",
    action: "Cancelled Order #2571",
    time: "3m ago",
    status: "error",
  },
];

const MOCK_ANALYTICS: AnalyticsDataPoint[] = [
  { time: "8:00", prepTime: 4, orderVolume: 10 },
  { time: "9:00", prepTime: 5, orderVolume: 15 },
  { time: "10:00", prepTime: 6, orderVolume: 20 },
  { time: "11:00", prepTime: 8, orderVolume: 30 },
  { time: "11:30", prepTime: 10, orderVolume: 45 },
  { time: "12:00", prepTime: 14, orderVolume: 75 },
  { time: "12:30", prepTime: 14.5, orderVolume: 78 },
  { time: "13:00", prepTime: 12, orderVolume: 60 },
  { time: "14:00", prepTime: 8, orderVolume: 35 },
  { time: "15:00", prepTime: 6, orderVolume: 25 },
  { time: "16:00", prepTime: 5, orderVolume: 20 },
  { time: "17:00", prepTime: 7, orderVolume: 35 },
  { time: "18:00", prepTime: 10, orderVolume: 60 },
  { time: "19:00", prepTime: 9, orderVolume: 55 },
  { time: "20:00", prepTime: 6, orderVolume: 30 },
];

export default function StaffManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [staffData, setStaffData] = useState<StaffEntry[]>(INITIAL_STAFF);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStaffProfile, setSelectedStaffProfile] =
    useState<StaffEntry | null>(null);

  const router = useRouter();
  const params = useParams();
  const tenantId = params.id as string;

  // simulate network loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredStaff = staffData.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddStaff = (newStaff: StaffEntry) => {
    setStaffData([newStaff, ...staffData]);
  };

  return (
    <div className="flex flex-col w-full">
      {/* dashboard kpis / mini analytics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-text-secondary mb-1">
            Total Active Staff
          </div>
          <div className="text-2xl font-bold text-text-primary">24</div>
          <div className="text-xs text-success-primary mt-2 font-medium">
            ↑ 2 from last month
          </div>
        </div>
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-text-secondary mb-1">
            Avg. Prep Time
          </div>
          <div className="text-2xl font-bold text-text-primary">8.5m</div>
          <div className="text-xs text-success-primary mt-2 font-medium">
            ↓ 1.2m from last week
          </div>
        </div>
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-text-secondary mb-1">
            Total Completed Orders
          </div>
          <div className="text-2xl font-bold text-text-primary">1,284</div>
          <div className="text-xs text-success-primary mt-2 font-medium">
            ↑ 12% from last week
          </div>
        </div>
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-text-secondary mb-1">
            Labor Cost
          </div>
          <div className="text-2xl font-bold text-text-primary">₱42,500</div>
          <div className="text-xs text-text-secondary mt-2 font-medium">
            Within target budget
          </div>
        </div>
      </div>

      {/* main grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* left column (directory & chart) */}
        <div className="lg:col-span-2 space-y-8">
          {/* analytics chart */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <StaffAnalyticsChart data={MOCK_ANALYTICS} />
          </div>

          {/* staff directory table */}
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-bold text-text-primary">
                Staff Directory
              </h3>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search staff..."
                  className="pl-10 py-2 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {isLoading ? (
              <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 min-h-[400px] animate-pulse" />
            ) : (
              <StaffTable
                data={filteredStaff}
                onClearFilters={() => setSearchQuery("")}
                onViewProfile={(staff) => setSelectedStaffProfile(staff)}
              />
            )}
          </div>
        </div>

        {/* right column (leaderboard & feed) */}
        <div className="space-y-8">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <StaffLeaderboard data={MOCK_LEADERBOARD} />
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400 h-[600px]">
            <LiveActivityFeed activities={MOCK_ACTIVITIES} />
          </div>
        </div>
      </div>

      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddStaff}
      />

      <StaffProfileModal
        isOpen={!!selectedStaffProfile}
        onClose={() => setSelectedStaffProfile(null)}
        staff={selectedStaffProfile}
      />
    </div>
  );
}
