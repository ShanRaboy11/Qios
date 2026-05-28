import React, { useState } from "react";
import {
  X,
  Mail,
  Building,
  Briefcase,
  Calendar,
  Phone,
  Activity,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Avatar } from "@/components/atoms/Avatar";
import { StaffEntry } from "./StaffTable";

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

  // reset tab when modal closes or staff changes
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab("profile");
    }
  }, [isOpen, staff]);

  if (!isOpen || !staff) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* modal Content */}
      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* header Background (Brand color) */}
          <div className="h-24 bg-gradient-to-r from-[#FFD77A] to-[#FF5269] relative flex-shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors z-50"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-8 pb-8">
            {/* avatar & Basic Info (overlapping header) */}
            <div className="flex flex-col items-center -mt-12 mb-6 relative z-10">
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
              <p className="text-text-secondary font-medium mt-1">
                {staff.role}
              </p>
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

            {/* content Sections */}
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
                          +63 912 345 6789
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
                          Jan 12, 2024
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
                  {[
                    {
                      day: "Monday",
                      time: "9:00 AM - 5:00 PM",
                      status: "shift",
                    },
                    {
                      day: "Tuesday",
                      time: "9:00 AM - 5:00 PM",
                      status: "shift",
                    },
                    { day: "Wednesday", time: "Day Off", status: "off" },
                    {
                      day: "Thursday",
                      time: "11:00 AM - 7:00 PM",
                      status: "shift",
                    },
                    {
                      day: "Friday",
                      time: "11:00 AM - 7:00 PM",
                      status: "shift",
                    },
                    {
                      day: "Saturday",
                      time: "12:00 PM - 8:00 PM",
                      status: "shift",
                      current: true,
                    },
                    {
                      day: "Sunday",
                      time: "12:00 PM - 8:00 PM",
                      status: "shift",
                    },
                  ].map((schedule, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                        schedule.current
                          ? "bg-brand-primary/5 border-brand-primary/20"
                          : "bg-white border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            schedule.status === "off"
                              ? "bg-gray-300"
                              : schedule.current
                                ? "bg-brand-primary"
                                : "bg-green-500"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${schedule.current ? "text-brand-primary" : "text-text-primary"}`}
                        >
                          {schedule.day}
                        </span>
                      </div>
                      <span
                        className={`text-sm ${
                          schedule.status === "off"
                            ? "text-text-tertiary font-medium italic"
                            : "text-text-secondary"
                        }`}
                      >
                        {schedule.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* action Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
          {activeTab === "profile" ? (
            <>
              <Button
                variant="ghost"
                className="text-text-secondary"
                onClick={() => setActiveTab("schedule")}
              >
                View Schedule
              </Button>
              <Button variant="primary">Edit Profile</Button>
            </>
          ) : (
            <Button
              variant="ghost"
              className="text-text-secondary w-full justify-center"
              onClick={() => setActiveTab("profile")}
            >
              Back to Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
