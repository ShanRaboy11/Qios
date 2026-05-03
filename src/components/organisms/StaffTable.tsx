import React, { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Avatar } from "@/components/atoms/Avatar";
import { MoreVertical, Edit2, KeyRound, UserX } from "lucide-react";
import { EmptyState } from "@/components/molecules/EmptyState";

export interface StaffEntry {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department: string;
  status: "Active" | "On Leave" | "Suspended";
  lastActive: string;
}

interface StaffTableProps {
  data: StaffEntry[];
  onEdit?: (id: string) => void;
  onResetPassword?: (id: string) => void;
  onDeactivate?: (id: string) => void;
  onClearFilters?: () => void;
  onViewProfile?: (staff: StaffEntry) => void;
}

export const StaffTable = ({ data, onEdit, onResetPassword, onDeactivate, onClearFilters, onViewProfile }: StaffTableProps) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex items-center justify-center">
        <EmptyState onAction={onClearFilters} />
      </div>
    );
  }

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto min-h-[400px] pb-32">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[12px] font-bold text-text-secondary uppercase tracking-wider">
              <th className="py-4 px-6 font-bold">Staff Member</th>
              <th className="py-4 px-6 font-bold">Role & Department</th>
              <th className="py-4 px-6 font-bold text-center">Status</th>
              <th className="py-4 px-6 font-bold text-center">Last Active</th>
              <th className="py-4 px-6 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((staff) => (
              <tr key={staff.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
                <td className="py-4 px-6">
                  <div 
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-xl p-1 -ml-1 transition-colors group/profile"
                    onClick={() => onViewProfile?.(staff)}
                    role="button"
                    tabIndex={0}
                  >
                    <Avatar 
                      initials={staff.name} 
                      src={staff.avatar} 
                      status={staff.status === "Active" ? "online" : staff.status === "On Leave" ? "away" : "offline"} 
                    />
                    <div>
                      <div className="font-bold text-text-primary group-hover/profile:text-brand-primary transition-colors">{staff.name}</div>
                      <div className="text-xs text-text-secondary">{staff.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-text-primary">{staff.role}</div>
                  <div className="text-xs text-text-secondary">{staff.department}</div>
                </td>
                <td className="py-4 px-6 text-center">
                  <Badge 
                    color={
                      staff.status === "Active" ? "success" : 
                      staff.status === "On Leave" ? "warning" : "error"
                    }
                    variant="subtle"
                    shape="pill"
                    className="justify-center"
                  >
                    {staff.status}
                  </Badge>
                </td>
                <td className="py-4 px-6 text-center text-sm text-text-secondary font-medium">
                  {staff.lastActive}
                </td>
                <td className="py-4 px-6 text-right relative">
                  <button 
                    onClick={() => toggleDropdown(staff.id)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-text-primary transition-colors focus:outline-none"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openDropdownId === staff.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setOpenDropdownId(null)} 
                      />
                      <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <button 
                          onClick={() => { onEdit?.(staff.id); setOpenDropdownId(null); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                          <Edit2 size={16} /> Edit Profile
                        </button>
                        <button 
                          onClick={() => { onResetPassword?.(staff.id); setOpenDropdownId(null); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                          <KeyRound size={16} /> Reset Password
                        </button>
                        <div className="h-px bg-gray-100 my-1" />
                        <button 
                          onClick={() => { onDeactivate?.(staff.id); setOpenDropdownId(null); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                        >
                          <UserX size={16} /> Deactivate Account
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
