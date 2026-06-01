import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Dropdown } from "@/components/molecules/Dropdown";
import { StaffEntry } from "./StaffTable";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staffData: any) => void;
  roles: { id: string; name: string }[];
  editingStaff?: StaffEntry | null;
}

export const AddStaffModal = ({ isOpen, onClose, onSave, roles, editingStaff }: AddStaffModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    appRoleId: "",
    department: "",
    password: "",
    status: "Active" as "Active" | "On Leave" | "Suspended",
  });

  useEffect(() => {
    if (isOpen) {
      if (editingStaff) {
        setFormData({
          name: editingStaff.name,
          email: editingStaff.email,
          appRoleId: (editingStaff as any).appRoleId || "",
          department: editingStaff.department,
          password: "",
          status: editingStaff.status,
        });
      } else {
        setFormData({
          name: "",
          email: "",
          appRoleId: "",
          department: "",
          password: "",
          status: "Active",
        });
      }
    }
  }, [editingStaff, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };



  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* modal Content */}
      <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">
            {editingStaff ? "Edit Staff Profile" : "Add New Staff"}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-text-secondary mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <Input 
              placeholder="e.g. Jane Doe" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-text-secondary mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <Input 
              type="email"
              placeholder="e.g. jane@qios.com" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!!editingStaff}
              required={!editingStaff}
            />
          </div>

          {!editingStaff && (
            <div>
              <label className="block text-sm font-bold text-text-secondary mb-1.5 uppercase tracking-wider">
                Temporary Password
              </label>
              <Input 
                type="password"
                placeholder="e.g. Temp123!@#" 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          )}

          {editingStaff && (
            <div>
              <Dropdown
                label="Status"
                placeholder="Select Status"
                options={[
                  { label: "Active", value: "Active" },
                  { label: "On Leave", value: "On Leave" },
                  { label: "Suspended", value: "Suspended" },
                ]}
                value={formData.status}
                onSelect={(opt) => setFormData({ ...formData, status: opt.value as any })}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <Dropdown
                label="Role"
                placeholder="Select Role"
                options={roles.map((r) => ({ label: r.name, value: r.id }))}
                value={formData.appRoleId}
                onSelect={(opt) => setFormData({ ...formData, appRoleId: opt.value })}
              />
            </div>
            <div>
              <Dropdown
                label="Department"
                placeholder="Select Dept"
                options={[
                  { label: "Operations", value: "Operations" },
                  { label: "Kitchen", value: "Kitchen" },
                  { label: "Front of House", value: "Front of House" },
                ]}
                value={formData.department}
                onSelect={(opt) => setFormData({ ...formData, department: opt.value })}
              />
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingStaff ? "Save Changes" : "Add Staff"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
