import React from "react";
import { Badge } from "@/components/atoms/Badge";

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  volume: number;
  performance: "Excellent" | "Moderate" | "Poor";
}

interface StaffLeaderboardProps {
  data: LeaderboardEntry[];
}

export const StaffLeaderboard = ({ data }: StaffLeaderboardProps) => {
  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-50">
        <h3 className="font-bold text-xl text-text-primary">
          Staff Performance Leaderboard
        </h3>
        <p className="text-sm text-text-secondary mt-1">
          Ranked by efficiency score and transaction velocity
        </p>
      </div>
      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-[#FF5269] text-white text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3 px-6 w-20 text-center">Rank</th>
              <th className="py-3 px-6">Staff Name</th>
              <th className="py-3 px-6 text-center">Volume</th>
              <th className="py-3 px-6 text-center">Performance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-4 px-6 font-medium text-text-primary text-center">
                  {entry.rank}
                </td>
                <td className="py-4 px-6 font-medium text-text-primary">
                  {entry.name}
                </td>
                <td className="py-4 px-6 font-bold text-text-primary text-center">
                  {entry.volume}
                </td>
                <td className="py-4 px-6 text-center">
                  <Badge
                    color={
                      entry.performance === "Excellent"
                        ? "success"
                        : entry.performance === "Moderate"
                          ? "warning"
                          : "error"
                    }
                    variant="subtle"
                    shape="pill"
                    className="justify-center"
                  >
                    {entry.performance}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
