import React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityEntry {
  id: string;
  name: string;
  action: string;
  time: string;
  status: "success" | "warning" | "error";
}

interface LiveActivityFeedProps {
  activities: ActivityEntry[];
}

export const LiveActivityFeed = ({ activities }: LiveActivityFeedProps) => {
  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-50">
        <h3 className="font-bold text-xl text-text-primary">Live Activity Feed</h3>
      </div>
      <div className="p-6 overflow-y-auto flex-1 space-y-6 max-h-[500px]">
        {activities.map((activity, idx) => (
          <div key={activity.id} className="relative flex gap-4">
            {/* Timeline Line */}
            {idx !== activities.length - 1 && (
              <div className="absolute left-[5px] top-[14px] bottom-[-24px] w-px bg-gray-100" />
            )}
            
            {/* Status Dot */}
            <div className={cn(
              "w-2.5 h-2.5 rounded-full mt-1.5 z-10 flex-shrink-0 ring-4 ring-white",
              activity.status === "success" ? "bg-green-500" : 
              activity.status === "warning" ? "bg-[#F59E0B]" : "bg-red-500"
            )} />

            {/* Content */}
            <div className="flex-1">
              <p className="text-[13px] text-text-secondary leading-snug">
                <span className="font-bold text-text-primary">{activity.name}</span> {activity.action}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-medium text-[#A3A3A3]">
                <Clock className="w-3 h-3" />
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
