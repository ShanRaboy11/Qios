import React from "react";
import { X, Mail, Building, Briefcase, Calendar, Phone, Activity } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Avatar } from "@/components/atoms/Avatar";
import { StaffEntry } from "./StaffTable";

interface StaffProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffEntry | null;
}

export const StaffProfileModal = ({ isOpen, onClose, staff }: StaffProfileModalProps) => {
  if (!isOpen || !staff) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Header Background (Brand color) */}
          <div className="h-24 bg-gradient-to-r from-[#FFD77A] to-[#FF5269] relative flex-shrink-0">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors z-50"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-8 pb-8">
            {/* Avatar & Basic Info (overlapping header) */}
            <div className="flex flex-col items-center -mt-12 mb-6 relative z-10">
            <div className="p-1.5 bg-white rounded-full shadow-sm mb-3">
              <Avatar 
                initials={staff.name} 
                src={staff.avatar} 
                size="lg"
                status={staff.status === "Active" ? "online" : staff.status === "On Leave" ? "away" : "offline"}
                className="w-20 h-20 text-2xl"
              />
            </div>
            <h2 className="text-2xl font-bold text-text-primary text-center">{staff.name}</h2>
            <p className="text-text-secondary font-medium mt-1">{staff.role}</p>
            <div className="mt-3">
              <Badge 
                color={
                  staff.status === "Active" ? "success" : 
                  staff.status === "On Leave" ? "warning" : "error"
                }
                variant="subtle"
                shape="pill"
              >
                {staff.status}
              </Badge>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] text-text-secondary font-bold uppercase">Email Address</div>
                    <div className="text-sm font-medium text-text-primary">{staff.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                    <Phone size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] text-text-secondary font-bold uppercase">Phone Number</div>
                    <div className="text-sm font-medium text-text-primary">+63 912 345 6789</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">Work Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                    <Building size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] text-text-secondary font-bold uppercase">Department</div>
                    <div className="text-sm font-medium text-text-primary">{staff.department}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] text-text-secondary font-bold uppercase">Employee ID</div>
                    <div className="text-sm font-medium text-text-primary">EMP-{staff.id.padStart(4, '0')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] text-text-secondary font-bold uppercase">Date Joined</div>
                    <div className="text-sm font-medium text-text-primary">Jan 12, 2024</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm">
                    <Activity size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] text-text-secondary font-bold uppercase">Last Active</div>
                    <div className="text-sm font-medium text-text-primary">{staff.lastActive}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
          <Button variant="ghost" className="text-text-secondary">
            View Schedule
          </Button>
          <Button variant="primary">
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};
