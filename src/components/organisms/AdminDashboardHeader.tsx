import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getTenants } from "@/app/(admin)/admin/tenants/actions";

interface AdminDashboardHeaderProps {
  onCompaniesClick?: () => void;
  onPackagesClick?: () => void;
  isCompaniesActive?: boolean;
}

export const AdminDashboardHeader = ({
  onCompaniesClick,
  onPackagesClick,
  isCompaniesActive,
}: AdminDashboardHeaderProps) => {
  const [latestSubscriber, setLatestSubscriber] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestSubscriber = async () => {
      try {
        const tenants = await getTenants();

        // Get today's date at midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter only tenants that joined today and are Active
        const todaySubscribers = tenants.filter((t) => {
          const joinedDate = new Date(t.joined);
          return joinedDate >= today && t.status === "Active";
        });

        if (todaySubscribers.length > 0) {
          // Pick the most recently joined one
          const latest = todaySubscribers.sort(
            (a, b) =>
              new Date(b.joined).getTime() - new Date(a.joined).getTime(),
          )[0];
          setLatestSubscriber(latest.business_name);
        }
      } catch (err) {
        console.error("Failed to fetch latest subscriber:", err);
      }
    };

    fetchLatestSubscriber();
  }, []);

  return (
    <div className="w-full relative overflow-hidden rounded-[24px] p-6 md:p-10 mb-6 bg-gradient-to-r from-[#F9C379] to-[#F28C50]">
      {/* Abstract Background Bubbles */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-[2px] -translate-x-10 -translate-y-10" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/30 rounded-full blur-[5px] translate-x-10 translate-y-10" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-[#FF7D40]/30 rounded-full blur-[8px]" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Text Section */}
        <div>
          <h1 className="h2 text-text-primary leading-tight mb-2">
            Welcome Back, Admin
          </h1>
          <p className="b1 text-text-primary">
            {latestSubscriber ? (
              <>
                Today,{" "}
                <span className="text-[#FF5269] font-bold">
                  {latestSubscriber}
                </span>{" "}
                Subscribed!
              </>
            ) : (
              "No new subscribers today."
            )}
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCompaniesClick}
            className={cn(
              "px-6 py-2.5 rounded-[12px] font-semibold text-[15px] transition-colors",
              isCompaniesActive
                ? "bg-white text-[#FF5269]"
                : "bg-[#FF5269] text-white hover:bg-[#FF3B55]",
            )}
          >
            {isCompaniesActive ? "Back to Dashboard" : "Companies"}
          </button>
          <button
            onClick={onPackagesClick}
            className="px-6 py-2.5 rounded-[12px] bg-white text-[#2D2D2D] font-semibold text-[15px] hover:bg-gray-50 transition-colors shadow-sm"
          >
            All Packages
          </button>
        </div>
      </div>
    </div>
  );
};
