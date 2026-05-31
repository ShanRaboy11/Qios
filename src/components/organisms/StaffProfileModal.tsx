import React, { useEffect, useState } from "react";
import {
  Activity,
  Building,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Avatar } from "@/components/atoms/Avatar";
import { StaffEntry } from "./StaffTable";

const defaultWeeklySchedule = [
  { day: "Monday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Tuesday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Wednesday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Thursday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Friday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Saturday", enabled: true, start: "09:00", end: "15:00" },
  { day: "Sunday", enabled: false, start: "09:00", end: "17:00" },
];

interface StaffProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffEntry | null;
}

export const StaffProfileModal = ({
  isOpen,
  onClose,
  staff,
}: StaffProfileModalProps) => {
  const [activeTab, setActiveTab] = useState<"profile" | "schedule">("profile");

  useEffect(() => {
    if (isOpen) {
      setActiveTab("profile");
    }
  }, [isOpen, staff]);

  if (!isOpen || !staff) return null;

  const scheduleRows = staff.weeklySchedule?.length
    ? staff.weeklySchedule
    : defaultWeeklySchedule;

  const formattedDateJoined = staff.dateJoined
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(staff.dateJoined))
    : "—";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="h-24 bg-gradient-to-r from-[#FFD77A] to-[#FF5269] relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors z-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 pt-0 pb-8 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col items-center -mt-12 mb-6 relative z-20">
            <div className="p-1.5 bg-white rounded-full shadow-sm mb-3">
              <Avatar
                initials={staff.name}
                src={staff.avatar}
                size="xl"
                status={
                  staff.status === "Active"
                    ? "online"
                    : staff.status === "On Leave"
                      ? "away"
                      : "offline"
                }
              />
            </div>
            <h2 className="text-2xl font-bold text-text-primary text-center">
              {staff.name}
            </h2>
            <p className="text-text-secondary font-medium mt-1">{staff.role}</p>
            <div className="mt-3">
              <Badge
                color={
                  staff.status === "Active"
                    ? "success"
                    : staff.status === "On Leave"
                      ? "warning"
                      : "error"
                }
                variant="subtle"
                shape="pill"
              >
                {staff.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 bg-gray-50 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === "profile"
                  ? "bg-white text-brand-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("schedule")}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === "schedule"
                  ? "bg-white text-brand-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Schedule
            </button>
          </div>

          {activeTab === "profile" ? (
            <div className="space-y-4">
              <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                      <Mail size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] text-text-secondary font-bold uppercase">
                        Email Address
                      </div>
                      <div className="text-sm font-medium text-text-primary">
                        {staff.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                      <Phone size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] text-text-secondary font-bold uppercase">
                        Phone Number
                      </div>
                      <div className="text-sm font-medium text-text-primary">
                        {staff.phoneNumber || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">
                  Work Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                      <Building size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] text-text-secondary font-bold uppercase">
                        Department
                      </div>
                      <div className="text-sm font-medium text-text-primary">
                        {staff.department}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] text-text-secondary font-bold uppercase">
                        Employee ID
                      </div>
                      <div className="text-sm font-medium text-text-primary">
                        EMP-{staff.id.padStart(4, "0")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] text-text-secondary font-bold uppercase">
                        Date Joined
                      </div>
                      <div className="text-sm font-medium text-text-primary">
                        {formattedDateJoined}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                      <Activity size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] text-text-secondary font-bold uppercase">
                        Last Active
                      </div>
                      <div className="text-sm font-medium text-text-primary">
                        {staff.lastActive}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Weekly Schedule
                </h3>
                <span className="text-xs font-medium text-brand-primary bg-orange-50 px-2 py-1 rounded-md">
                  This Week
                </span>
              </div>

              <div className="space-y-2">
                {scheduleRows.map((schedule) => (
                  <div
                    key={schedule.day}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                      schedule.enabled
                        ? "bg-white border-gray-100 hover:bg-gray-50"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          schedule.enabled ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={`font-medium text-sm ${
                          schedule.enabled
                            ? "text-text-primary"
                            : "text-gray-400"
                        }`}
                      >
                        {schedule.day}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        schedule.enabled
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {schedule.enabled
                        ? `${schedule.start} - ${schedule.end}`
                        : "Day Off"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
