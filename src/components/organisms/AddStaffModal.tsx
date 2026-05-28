import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Dropdown } from "@/components/molecules/Dropdown";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staffData: any) => void;
}

export const AddStaffModal = ({ isOpen, onClose, onSave }: AddStaffModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: `staff-${Date.now()}`, status: "Active", lastActive: "Just now" });
    setFormData({ name: "", email: "", role: "", department: "" });
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
          <h2 className="text-xl font-bold text-text-primary">Add New Staff</h2>
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
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <Dropdown
                label="Role"
                placeholder="Select Role"
                options={[
                  { label: "Manager", value: "Manager" },
                  { label: "Head Chef", value: "Head Chef" },
                  { label: "Line Cook", value: "Line Cook" },
                  { label: "Cashier", value: "Cashier" },
                  { label: "Server", value: "Server" },
                ]}
                value={formData.role}
                onSelect={(opt) => setFormData({ ...formData, role: opt.value })}
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
              Add Staff
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
