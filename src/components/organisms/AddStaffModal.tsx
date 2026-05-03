import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

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
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-text-secondary mb-1.5 uppercase tracking-wider">
                Role
              </label>
              <select 
                className="w-full bg-bg-primary border border-gray-200 rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="" disabled>Select Role</option>
                <option value="Manager">Manager</option>
                <option value="Head Chef">Head Chef</option>
                <option value="Line Cook">Line Cook</option>
                <option value="Cashier">Cashier</option>
                <option value="Server">Server</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-text-secondary mb-1.5 uppercase tracking-wider">
                Department
              </label>
              <select 
                className="w-full bg-bg-primary border border-gray-200 rounded-xl px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              >
                <option value="" disabled>Select Dept</option>
                <option value="Operations">Operations</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Front of House">Front of House</option>
              </select>
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
