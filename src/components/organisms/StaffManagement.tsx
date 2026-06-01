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
import { StaffManagementPageSkeleton } from "@/components/molecules/PageShimmerSkeleton";
import {
  getStaffData,
  addStaffMember,
  editStaffMember,
  resetStaffPassword,
  deactivateStaffMember,
  getStaffLeaderboard,
  getLiveActivities,
} from "@/app/(tenant)/[id]/staff/actions";

export default function StaffManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [staffData, setStaffData] = useState<StaffEntry[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [avgPrepTime, setAvgPrepTime] = useState<number>(0);
  const [totalCompletedOrders, setTotalCompletedOrders] = useState<number>(0);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataPoint[]>([]);
  const [activeStaffChange, setActiveStaffChange] = useState<number>(0);
  const [prepTimeChange, setPrepTimeChange] = useState<number>(0);
  const [completedOrdersChangePercent, setCompletedOrdersChangePercent] =
    useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStaffProfile, setSelectedStaffProfile] =
    useState<StaffEntry | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffEntry | null>(null);

  const router = useRouter();
  const params = useParams();
  const tenantId = params.id as string;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [res, leaderboardRes, activitiesRes] = await Promise.all([
        getStaffData(tenantId),
        getStaffLeaderboard(tenantId),
        getLiveActivities(tenantId),
      ]);
      if (res.success) {
        setStaffData(res.staff);
        setRoles(res.roles);
        setAvgPrepTime(res.avgPrepTime ?? 0);
        setTotalCompletedOrders(res.totalCompletedOrders ?? 0);
        setAnalyticsData(res.analytics ?? []);
        setActiveStaffChange(res.activeStaffChange ?? 0);
        setPrepTimeChange(res.prepTimeChange ?? 0);
        setCompletedOrdersChangePercent(res.completedOrdersChangePercent ?? 0);
      } else {
        console.error("Failed to load staff data:", res.error);
        setStaffData([]);
      }

      if (leaderboardRes.success) {
        setLeaderboard(leaderboardRes.data);
      } else {
        console.error("Failed to load leaderboard:", leaderboardRes.error);
        setLeaderboard([]);
      }

      if (activitiesRes.success) {
        setActivities(activitiesRes.data);
      } else {
        console.error("Failed to load activities:", activitiesRes.error);
        setActivities([]);
      }
    } catch (err) {
      console.error(err);
      setStaffData([]);
      setLeaderboard([]);
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      loadData();
    }
  }, [tenantId]);

  const filteredStaff = staffData.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSaveStaff = async (formData: any) => {
    setIsLoading(true);
    try {
      if (editingStaff) {
        const res = await editStaffMember(
          tenantId,
          editingStaff.id,
          formData.name,
          formData.appRoleId,
          formData.department,
          formData.status,
        );
        if (res.success) {
          await loadData();
        } else {
          alert("Failed to update staff member: " + res.error);
        }
      } else {
        const res = await addStaffMember(
          tenantId,
          formData.name,
          formData.email,
          formData.appRoleId,
          formData.department,
          formData.password,
        );
        if (res.success) {
          await loadData();
        } else {
          alert("Failed to add staff member: " + res.error);
        }
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setEditingStaff(null);
      setIsLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    const staff = staffData.find((s) => s.id === id);
    if (staff) {
      setEditingStaff(staff);
      setIsAddModalOpen(true);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (
      confirm("Are you sure you want to suspend/deactivate this staff member?")
    ) {
      setIsLoading(true);
      try {
        const res = await deactivateStaffMember(tenantId, id);
        if (res.success) {
          await loadData();
        } else {
          alert("Failed to deactivate staff member: " + res.error);
        }
      } catch (err: any) {
        alert("Error: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResetPassword = async (id: string) => {
    const newPassword = prompt(
      "Enter a new temporary password for this staff member:",
      "Temp123!@#",
    );
    if (newPassword === null) return; // user cancelled

    if (newPassword.trim().length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetStaffPassword(tenantId, id, newPassword);
      if (res.success) {
        alert("Password reset successfully.");
      } else {
        alert("Failed to reset password: " + res.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <StaffManagementPageSkeleton />;
  }

  return (
    <div className="flex flex-col w-full">
      {/* dashboard kpis / mini analytics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-text-secondary mb-1">
            Total Active Staff
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {staffData.filter((s) => s.status === "Active").length}
          </div>
          <div
            className={`text-xs mt-2 font-medium ${
              activeStaffChange >= 0
                ? "text-success-primary"
                : "text-error-primary"
            }`}
          >
            {activeStaffChange >= 0 ? "↑" : "↓"} {Math.abs(activeStaffChange)}{" "}
            from last month
          </div>
        </div>
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-text-secondary mb-1">
            Avg. Prep Time
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {avgPrepTime > 0 ? `${avgPrepTime.toFixed(1)}m` : "—"}
          </div>
          <div
            className={`text-xs mt-2 font-medium ${
              prepTimeChange >= 0
                ? "text-success-primary"
                : "text-error-primary"
            }`}
          >
            {prepTimeChange >= 0 ? "↑" : "↓"}{" "}
            {Math.abs(prepTimeChange).toFixed(1)}m from last week
          </div>
        </div>
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-text-secondary mb-1">
            Total Completed Orders
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {totalCompletedOrders.toLocaleString()}
          </div>
          <div
            className={`text-xs mt-2 font-medium ${
              completedOrdersChangePercent >= 0
                ? "text-success-primary"
                : "text-error-primary"
            }`}
          >
            {completedOrdersChangePercent >= 0 ? "↑" : "↓"}{" "}
            {Math.round(Math.abs(completedOrdersChangePercent))}% from last week
          </div>
        </div>
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-text-secondary mb-1">
            Labor Cost
          </div>
          <div className="text-2xl font-bold text-text-primary">
            ₱
            {staffData
              .filter((s) => s.status === "Active")
              .reduce((total, s) => {
                const role = s.role.toLowerCase();
                if (role.includes("admin")) return total + 25000;
                if (role.includes("manager")) return total + 20000;
                if (role.includes("chef")) return total + 18000;
                if (role.includes("cook")) return total + 15000;
                if (role.includes("cashier")) return total + 12000;
                if (role.includes("server")) return total + 10000;
                return total + 10000;
              }, 0)
              .toLocaleString()}
          </div>
          <div className="text-xs text-text-secondary mt-2 font-medium">
            Within target budget
          </div>
        </div>
      </div>

      {/* Row 1 Grid (Analytics Chart & Leaderboard) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <StaffAnalyticsChart data={analyticsData} />
          </div>
        </div>
        <div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 h-full">
            <StaffLeaderboard data={leaderboard} />
          </div>
        </div>
      </div>

      {/* Row 2 Grid (Staff Directory Table & Live Activity Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Staff Directory — flex-col so header stays top, table card fills remaining height */}
        <div className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 flex flex-col gap-4 h-[600px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-xl font-bold text-text-primary">
              Staff Directory
            </h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search staff..."
                  className="pl-10 py-2 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="primary"
                shape="rounded"
                leftIcon={<Plus size={18} />}
                onClick={() => setIsAddModalOpen(true)}
                className="shrink-0"
              >
                Add Staff
              </Button>
            </div>
          </div>
          <StaffTable
            className="flex-1"
            data={filteredStaff}
            onClearFilters={() => setSearchQuery("")}
            onViewProfile={(staff) => setSelectedStaffProfile(staff)}
            onEdit={handleEdit}
            onResetPassword={handleResetPassword}
            onDeactivate={handleDeactivate}
          />
        </div>

        {/* Live Activity Feed */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
          <LiveActivityFeed activities={activities} />
        </div>
      </div>

      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStaff(null);
        }}
        onSave={handleSaveStaff}
        roles={roles}
        editingStaff={editingStaff}
      />

      <StaffProfileModal
        isOpen={!!selectedStaffProfile}
        onClose={() => setSelectedStaffProfile(null)}
        staff={selectedStaffProfile}
      />
    </div>
  );
}
