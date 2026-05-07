"use client";

import React from "react";
import RolesManagement from "@/components/organisms/RolesManagement";
import { Button } from "@/components/atoms/Button";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/atoms/Input";
import { FeatureToggle } from "@/components/molecules/FeatureToggle";
import { ActionConfirmationModal } from "@/components/molecules/ConfirmationModal";
import { Plus, Search, Shield, ShieldAlert, Check, Copy, Trash2, GripVertical, ShoppingCart, Package, LineChart, QrCode, Users, X, Edit2, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

// types
type PermissionGroup = {
  [key: string]: boolean;
};

type Permissions = {
  auth: PermissionGroup;
  orders: PermissionGroup;
  inventory: PermissionGroup;
  analytics: PermissionGroup;
  misc: PermissionGroup;
};

type Employee = {
  id: string;
  name: string;
  username: string;
  password?: string;
};

type Role = {
  id: string;
  name: string;
  color: string;
  employees: Employee[];
  permissions: Permissions;
};

// initial data
const DEFAULT_PERMISSIONS: Permissions = {
  auth: {
    "Employee Authentication": false,
    "Employee Account Management": false,
    "Role Management Access": false,
  },
  orders: {
    "Order Retrieval": false,
    "Order Modification": false,
    "Order Validation": false,
    "Payment Confirmation": false,
    "Cancellation & Void Monitoring": false,
    "Order Queue Management": false,
    "Order Status Updating": false,
  },
  inventory: {
    "Inventory Monitoring": false,
    "Stock Deduction Overview": false,
    "Physical Stock Input": false,
    "Variance Reports": false,
    "Shrinkage Alerts": false,
  },
  analytics: {
    "Revenue Dashboard": false,
    "Operational Analytics": false,
    "Staff Activity Monitoring": false,
  },
  misc: {
    "QR Code Scanning": false,
  },
};

const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  "Employee Authentication": "Allow users to log into the application.",
  "Employee Account Management": "Create, edit, and deactivate employee accounts.",
  "Role Management Access": "Manage roles and configure permissions.",
  "Order Retrieval": "View and search existing orders.",
  "Order Modification": "Edit order details after placement.",
  "Order Validation": "Approve and validate pending orders.",
  "Payment Confirmation": "Process and confirm payments.",
  "Cancellation & Void Monitoring": "Cancel orders and monitor voided items.",
  "Order Queue Management": "Manage the sequence and priority of orders.",
  "Order Status Updating": "Change the status of active orders.",
  "Inventory Monitoring": "View current stock levels.",
  "Stock Deduction Overview": "Monitor automatic stock deductions.",
  "Physical Stock Input": "Manually adjust and input physical stock counts.",
  "Variance Reports": "Generate and view discrepancy reports.",
  "Shrinkage Alerts": "Receive notifications for missing stock.",
  "Revenue Dashboard": "Access high-level revenue and sales data.",
  "Operational Analytics": "View metrics on daily operations.",
  "Staff Activity Monitoring": "Track staff actions and productivity.",
  "QR Code Scanning": "Use the device camera to scan QR codes.",
};

const INITIAL_ROLES: Role[] = [
  {
    id: "r1",
    name: "Manager",
    color: "bg-warning-primary",
    employees: [
      { id: "e1", name: "Alice Johnson", username: "alice.j", password: "password123" },
      { id: "e2", name: "Bob Smith", username: "bob.s", password: "password123" },
      { id: "e3", name: "Charlie Davis", username: "charlie.d", password: "password123" },
    ],
    permissions: {
      auth: { "Employee Authentication": true, "Employee Account Management": true, "Role Management Access": true },
      orders: { "Order Retrieval": true, "Order Modification": true, "Order Validation": true, "Payment Confirmation": true, "Cancellation & Void Monitoring": true, "Order Queue Management": true, "Order Status Updating": true },
      inventory: { "Inventory Monitoring": true, "Stock Deduction Overview": true, "Physical Stock Input": true, "Variance Reports": true, "Shrinkage Alerts": true },
      analytics: { "Revenue Dashboard": true, "Operational Analytics": true, "Staff Activity Monitoring": true },
      misc: { "QR Code Scanning": true },
    },
  },
  {
    id: "r2",
    name: "Cashier",
    color: "bg-brand-secondary",
    employees: [
      { id: "e4", name: "David Wilson", username: "david.w", password: "password123" },
    ],
    permissions: {
      auth: { "Employee Authentication": true, "Employee Account Management": false, "Role Management Access": false },
      orders: { "Order Retrieval": true, "Order Modification": false, "Order Validation": true, "Payment Confirmation": true, "Cancellation & Void Monitoring": false, "Order Queue Management": true, "Order Status Updating": true },
      inventory: { "Inventory Monitoring": false, "Stock Deduction Overview": false, "Physical Stock Input": false, "Variance Reports": false, "Shrinkage Alerts": false },
      analytics: { "Revenue Dashboard": false, "Operational Analytics": false, "Staff Activity Monitoring": false },
      misc: { "QR Code Scanning": true },
    },
  },
  {
    id: "r3",
    name: "Kitchen",
    color: "bg-brand-primary",
    employees: [],
    permissions: {
      auth: { "Employee Authentication": true, "Employee Account Management": false, "Role Management Access": false },
      orders: { "Order Retrieval": true, "Order Modification": false, "Order Validation": false, "Payment Confirmation": false, "Cancellation & Void Monitoring": false, "Order Queue Management": true, "Order Status Updating": true },
      inventory: { "Inventory Monitoring": true, "Stock Deduction Overview": true, "Physical Stock Input": false, "Variance Reports": false, "Shrinkage Alerts": false },
      analytics: { "Revenue Dashboard": false, "Operational Analytics": false, "Staff Activity Monitoring": false },
      misc: { "QR Code Scanning": false },
    },
  },
];

const PRESET_COLORS = [
  "bg-warning-primary", // red
  "bg-brand-accent", // pinkish red
  "bg-brand-primary", // orange
  "bg-brand-secondary", // yellow
  "bg-success-primary", // green
  "bg-[#3b82f6]", // blue
  "bg-[#8b5cf6]", // purple
  "bg-text-primary", // dark
];

export default function RolesPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params.id as string;
export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0].id);
  const [draftRole, setDraftRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"permissions" | "employees">("permissions");
  const [confirmationAction, setConfirmationAction] = useState<"save" | "copy" | "delete" | null>(null);
  
  // modal & employee states
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeCredentials, setNewEmployeeCredentials] = useState<{username: string, password: string} | null>(null);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");

  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [showTemplateReminder, setShowTemplateReminder] = useState(false);

  // drag and drop state
  const [draggedRoleId, setDraggedRoleId] = useState<string | null>(null);

  const activeRole = roles.find((r) => r.id === selectedRoleId);
  const hasConfirmationOpen = confirmationAction !== null;
  
  // initialize draft when active role changes
  useEffect(() => {
    if (activeRole) {
      setDraftRole(JSON.parse(JSON.stringify(activeRole))); // deep copy
      setEmployeeSearchQuery(""); // reset search when switching roles
      setShowTemplateReminder(false);
    }
  }, [activeRole]);

  const hasChanges = JSON.stringify(activeRole) !== JSON.stringify(draftRole);

  const handlePermissionChange = (category: keyof Permissions, key: string, value: boolean) => {
    if (!draftRole) return;
    setDraftRole({
      ...draftRole,
      permissions: {
        ...draftRole.permissions,
        [category]: {
          ...draftRole.permissions[category],
          [key]: value,
        },
      },
    });
  };

  const handleSave = () => {
    if (!draftRole) return;
    setRoles(roles.map((r) => (r.id === draftRole.id ? draftRole : r)));
    setConfirmationAction(null);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedRoleId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedRoleId || draggedRoleId === targetId) return;

    const newRoles = [...roles];
    const draggedIndex = newRoles.findIndex(r => r.id === draggedRoleId);
    const targetIndex = newRoles.findIndex(r => r.id === targetId);

    const [draggedRole] = newRoles.splice(draggedIndex, 1);
    newRoles.splice(targetIndex, 0, draggedRole);

    setRoles(newRoles);
    setDraggedRoleId(null);
  };

  const handleDiscard = () => {
    if (activeRole) {
      setDraftRole(JSON.parse(JSON.stringify(activeRole)));
    }
  };

  const handleConfirmCreateRole = (templateRole?: Role) => {
    const newRole: Role = {
      id: `r${Date.now()}`,
      name: templateRole ? templateRole.name : "New Role",
      color: templateRole ? templateRole.color : PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
      employees: [],
      permissions: templateRole ? JSON.parse(JSON.stringify(templateRole.permissions)) : JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS)),
    };
    setRoles([...roles, newRole]);
    setSelectedRoleId(newRole.id);
    setIsCreateRoleModalOpen(false);
    if (templateRole) setShowTemplateReminder(true);
    setConfirmationAction(null);
  };

  const handleDuplicate = () => {
    if (!activeRole) return;
    const newRole: Role = {
      ...JSON.parse(JSON.stringify(activeRole)),
      id: `r${Date.now()}`,
      name: `${activeRole.name} (Copy)`,
      employees: [],
    };
    setRoles([...roles, newRole]);
    setSelectedRoleId(newRole.id);
    setConfirmationAction(null);
  };

  const handleAddEmployee = () => {
    if (!draftRole || !newEmployeeName.trim()) return;

    // generate credentials
    const firstName = newEmployeeName.split(" ")[0].toLowerCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const username = `${firstName}.${randomSuffix}`;
    const password = `pass${randomSuffix}!`;

    const newEmployee: Employee = {
      id: `e${Date.now()}`,
      name: newEmployeeName,
      username,
      password,
    };

    setDraftRole({
      ...draftRole,
      employees: [...draftRole.employees, newEmployee]
    });
    setNewEmployeeCredentials({ username, password });
    setNewEmployeeName("");
  };

  const handleRemoveEmployee = (empId: string) => {
    if (!draftRole) return;
    setDraftRole({
      ...draftRole,
      employees: draftRole.employees.filter((e) => e.id !== empId)
    });
  };

  const handleDelete = () => {
    if (roles.length <= 1) return; // don't delete last role
    const newRoles = roles.filter((r) => r.id !== selectedRoleId);
    setRoles(newRoles);
    setSelectedRoleId(newRoles[0].id);
    setConfirmationAction(null);
  };

  const runConfirmedAction = () => {
    if (confirmationAction === "save") {
      handleSave();
      return;
    }

    if (confirmationAction === "copy") {
      handleDuplicate();
      return;
    }

    if (confirmationAction === "delete") {
      handleDelete();
    }
  };

  const formatRoleName = (name: string) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1) : name;

  const filteredRoles = roles.filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="h2 text-text-primary">Role Management</h2>
          <p className="b1 text-text-secondary mt-2">
            Configure system roles and their permissions
          </p>
    <div className="flex flex-col h-full bg-bg-primary overflow-hidden rounded-2xl md:rounded-[32px] border-4 border-white shadow-xl max-w-7xl mx-4 xl:mx-auto my-4 md:my-8">
      {/* header */}
      <div className="flex-shrink-0 px-4 md:px-8 pt-6 md:pt-10 pb-4 md:pb-6">
        <h1 className="h2 text-text-primary mb-2">Role Management</h1>
        <p className="b1 text-text-secondary">Manage role permissions and access controls</p>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        {/* sidebar */}
        <div className="w-full md:w-[320px] flex flex-col flex-shrink-0 border-b-2 md:border-b-0 md:border-r-2 border-white/50 bg-white/30 backdrop-blur-md h-[40%] md:h-auto min-h-[250px]">
          <div className="p-4 md:p-6 pb-4 flex flex-col gap-4">
            <Button
              variant="primary"
              className="w-full"
              leftIcon={<Plus size={18} />}
              onClick={() => setIsCreateRoleModalOpen(true)}
            >
              New Role
            </Button>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={18} className="text-text-secondary" />
              </div>
              <Input
                placeholder="Search roles"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 !py-2.5 rounded-xl !bg-white/60 !border-white/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 md:px-4 pb-6 custom-scrollbar">
            <div className="flex flex-col gap-2">
              {filteredRoles.map((role, index) => (
                <div
                  key={role.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, role.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, role.id)}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={cn(
                    "group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-300",
                    selectedRoleId === role.id
                      ? "bg-white shadow-md border border-white/60 transform scale-[1.02]"
                      : "hover:bg-white/40 border border-transparent",
                    draggedRoleId === role.id && "opacity-50 border-dashed border-2 border-brand-primary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="cursor-grab text-text-secondary/50 hover:text-text-primary active:cursor-grabbing">
                      <GripVertical size={16} />
                    </div>
                    <div className={cn("w-3 h-3 rounded-full shadow-sm", role.color)} />
                    <div className="flex flex-col">
                      <span className={cn(
                        "b2 font-bold transition-colors",
                        selectedRoleId === role.id ? "text-text-primary" : "text-text-primary/80"
                      )}>
                        {formatRoleName(role.name)}
                      </span>
                      <span className="b5 text-text-secondary">
                        {role.employees.length} {role.employees.length === 1 ? 'user' : 'users'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* main panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-white/50">
          {draftRole ? (
            <>
              {/* role settings header */}
              <div className="p-4 md:p-8 pb-4 md:pb-6 border-b-2 border-white/50 flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 w-full max-w-xl flex flex-col sm:flex-row gap-4 md:gap-6">
                  <div className="flex-1">
                    <label className="b4 font-bold text-text-secondary mb-2 block uppercase tracking-wider">Role Name</label>
                    <Input
                      value={draftRole.name}
                      onChange={(e) => setDraftRole({ ...draftRole, name: e.target.value })}
                      className="text-lg !bg-white/80 !py-1.5 !h-10"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="b4 font-bold text-text-secondary mb-3 block uppercase tracking-wider">Role Color</label>
                    <div className="flex gap-2 sm:gap-3 flex-nowrap pb-1">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => setDraftRole({ ...draftRole, color })}
                          className={cn(
                            "w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 rounded-full shadow-md transition-transform duration-200 hover:scale-110 flex items-center justify-center",
                            color,
                            draftRole.color === color && "ring-4 ring-brand-primary/30 scale-110"
                          )}
                        >
                          {draftRole.color === color && <Check className="text-white w-3 h-3 sm:w-4 sm:h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 self-end sm:self-auto mt-2 sm:mt-0">
                  <Button variant="ghost" size="icon" onClick={() => setConfirmationAction("copy")} title="Duplicate Role">
                    <Copy size={18} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setConfirmationAction("delete")} 
                    title="Delete Role"
                    className="hover:bg-warning-secondary hover:text-warning-primary"
                    disabled={roles.length <= 1}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>

              {/* tabs */}
              <div className="flex gap-4 md:gap-6 px-4 md:px-8 border-b-2 border-white/50 pt-4 flex-shrink-0 overflow-x-auto no-scrollbar">
                <button 
                  className={cn("pb-3 border-b-2 font-bold b2 transition-colors", activeTab === "permissions" ? "border-brand-primary text-brand-primary" : "border-transparent text-text-secondary hover:text-text-primary")}
                  onClick={() => setActiveTab("permissions")}
                >
                  Permissions
                </button>
                <button 
                  className={cn("pb-3 border-b-2 font-bold b2 transition-colors", activeTab === "employees" ? "border-brand-primary text-brand-primary" : "border-transparent text-text-secondary hover:text-text-primary")}
                  onClick={() => setActiveTab("employees")}
                >
                  Manage Employees
                </button>
              </div>

              {/* main tab content */}
              <div className="flex-1 flex flex-col min-h-0 relative">
                {activeTab === "permissions" ? (
                  <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-8 pb-4">
                      
                      {showTemplateReminder && (
                        <div className="bg-warning-secondary/30 border border-warning-primary/30 rounded-xl md:rounded-[24px] p-4 flex items-start gap-3">
                          <ShieldAlert className="text-warning-primary flex-shrink-0 mt-0.5" size={18} />
                          <div>
                            <h4 className="b3 font-bold text-warning-primary">Review Predefined Permissions</h4>
                            <p className="b4 text-warning-primary/80">You've applied a predefined template. Please review and confirm the access levels below.</p>
                          </div>
                          <button onClick={() => setShowTemplateReminder(false)} className="ml-auto text-warning-primary/60 hover:text-warning-primary transition-colors">
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      
                      {/* category sections */}
                      {Object.entries({
                        "Authentication & Roles": { key: "auth" as keyof Permissions, data: draftRole.permissions.auth, icon: <Shield size={18}/> },
                        "Orders & Payments": { key: "orders" as keyof Permissions, data: draftRole.permissions.orders, icon: <ShoppingCart size={18} /> },
                        "Inventory": { key: "inventory" as keyof Permissions, data: draftRole.permissions.inventory, icon: <Package size={18} /> },
                        "Analytics & Dashboards": { key: "analytics" as keyof Permissions, data: draftRole.permissions.analytics, icon: <LineChart size={18} /> },
                        "Miscellaneous": { key: "misc" as keyof Permissions, data: draftRole.permissions.misc, icon: <QrCode size={18} /> },
                      }).map(([categoryName, { key: categoryKey, data, icon }]) => (
                        <div key={categoryName} className="bg-white rounded-xl md:rounded-[24px] shadow-sm border border-black/[0.03] overflow-hidden">
                          <div className="px-4 md:px-6 py-3 md:py-4 bg-brand-secondary/10 border-b border-black/[0.03] flex items-center gap-2">
                            {icon && <span className="text-brand-primary">{icon}</span>}
                            <h3 className="b3 font-bold text-text-primary uppercase tracking-wider">{categoryName}</h3>
                          </div>
                          <div className="p-2 flex flex-col">
                            {Object.entries(data).map(([permissionName, isEnabled]) => (
                              <FeatureToggle
                                key={permissionName}
                                label={permissionName}
                                description={PERMISSION_DESCRIPTIONS[permissionName]}
                                checked={isEnabled}
                                variant="accent"
                                onChange={(checked) => handlePermissionChange(categoryKey, permissionName, checked)}
                                className="!rounded-xl"
                              />
                            ))}
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto flex flex-col gap-4 md:gap-6 pb-4">
                      <div className="bg-white rounded-xl md:rounded-[24px] shadow-sm border border-black/[0.03] p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="b2 font-bold text-text-primary mb-1">Add Employees</h3>
                          <p className="b4 text-text-secondary">Create a new employee profile to assign them to this role.</p>
                        </div>
                        <Button variant="outline" leftIcon={<Plus size={16} />} onClick={() => setIsAddEmployeeModalOpen(true)}>
                          Add Employee
                        </Button>
                      </div>
                      
                      <div className="bg-white rounded-xl md:rounded-[24px] shadow-sm border border-black/[0.03] overflow-hidden flex flex-col">
                         <div className="px-4 md:px-6 py-4 bg-brand-secondary/10 border-b border-black/[0.03] flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <Users size={18} className="text-brand-primary" />
                             <h3 className="b3 font-bold text-text-primary uppercase tracking-wider">Employees with this role</h3>
                           </div>
                         </div>
                         <div className="p-4 border-b border-black/[0.03]">
                           <div className="relative w-full">
                             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                               <Search size={14} className="text-text-secondary" />
                             </div>
                             <Input
                               placeholder="Search employees"
                               value={employeeSearchQuery}
                               onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                               className="pl-9 !py-2 !text-sm rounded-xl"
                             />
                           </div>
                         </div>
                         <div className="flex flex-col">
                           {draftRole.employees.length > 0 ? (
                              draftRole.employees
                                .filter(e => e.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()))
                                .map((employee) => (
                                <div key={employee.id} className="p-4 md:px-6 border-b border-black/[0.03] last:border-b-0 flex items-center justify-between hover:bg-black/[0.01]">
                                  <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold b2">
                                      {employee.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="b2 font-bold text-text-primary">{employee.name}</p>
                                      <p className="b4 text-text-secondary truncate max-w-[120px] sm:max-w-none">@{employee.username}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="hover:bg-warning-secondary hover:text-warning-primary" onClick={() => handleRemoveEmployee(employee.id)}>
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </div>
                              ))
                           ) : (
                              <div className="p-8 text-center text-text-secondary b2">
                                No employees assigned to this role yet.
                              </div>
                           )}
                           {draftRole.employees.length > 0 && draftRole.employees.filter(e => e.name.toLowerCase().includes(employeeSearchQuery.toLowerCase())).length === 0 && (
                             <div className="p-8 text-center text-text-secondary b2">
                               No employees match your search.
                             </div>
                           )}
                         </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* global action footer */}
              <div className="p-4 md:p-6 border-t-2 border-white/50 flex items-center justify-end gap-2 md:gap-4 flex-shrink-0 z-10 bg-white/50 md:bg-transparent">
                {hasChanges && (
                  <div className="flex flex-col mr-auto">
                    <span className="b2 font-bold text-text-primary">Unsaved changes</span>
                    <span className="b4 text-text-secondary hidden sm:inline">You have modified this role's configuration.</span>
                  </div>
                )}
                {hasChanges && (
                  <Button variant="ghost" onClick={handleDiscard} className="text-warning-primary hover:bg-warning-secondary">
                    Discard Changes
                  </Button>
                )}
                <Button 
                  variant={hasChanges ? "primary" : "ghost"}
                  onClick={() => setConfirmationAction("save")} 
                  disabled={!hasChanges}
                  className={cn(!hasChanges && "opacity-50")}
                >
                  Save Changes
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-text-secondary b2">
              Select a role to manage its permissions
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            shape="rounded"
            leftIcon={<ArrowLeft size={18} />}
            onClick={() => router.push(`/${tenantId}/staff`)}
          >
            Back to Staff
          </Button>
        </div>
      </div>
      <RolesManagement />
    </>
      </div>
      
      {/* scrollbar styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        <ActionConfirmationModal
          isOpen={hasConfirmationOpen}
          action={confirmationAction}
          title={
            confirmationAction === "save"
              ? "Save Role Changes?"
              : confirmationAction === "copy"
                ? "Copy This Role?"
                : "Delete This Role?"
          }
          message={
            confirmationAction === "save" ? (
              <>
                Your edits to <span className="font-semibold text-text-primary">"{draftRole?.name ?? "this role"}"</span> will be saved locally.
              </>
            ) : confirmationAction === "copy" ? (
              <>
                A new copy of <span className="font-semibold text-text-primary">"{activeRole?.name ?? "this role"}"</span> will be created locally.
              </>
            ) : (
              <>
                Are you sure you want to remove <span className="font-semibold text-text-primary">"{activeRole?.name ?? "this role"}"</span>? This cannot be undone.
              </>
            )
          }
          confirmLabel={
            confirmationAction === "save"
              ? "Save Changes"
              : confirmationAction === "copy"
                ? "Create Copy"
                : "Yes, Delete"
          }
          confirmVariant={confirmationAction === "delete" ? "outline" : "primary"}
          activePlanName={activeRole?.name}
          draftPlanName={draftRole?.name}
          onClose={() => setConfirmationAction(null)}
          onConfirm={runConfirmedAction}
        />
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.2);
        }
      `}} />

      {/* create role modal */}
      {isCreateRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl md:rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 md:px-8 py-4 md:py-6 flex items-center justify-between border-b border-black/[0.05] flex-shrink-0">
              <h2 className="b2 font-bold text-text-primary">Create New Role</h2>
              <button onClick={() => setIsCreateRoleModalOpen(false)} className="text-text-secondary hover:text-text-primary transition-colors p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto">
              <p className="b3 text-text-secondary font-semibold mb-6">Choose a predefined template to quickly set up permissions, or start from scratch.</p>
              
              <div className="flex flex-col gap-3 mb-6">
                {INITIAL_ROLES.map((template) => (
                  <button 
                    key={template.id}
                    onClick={() => handleConfirmCreateRole(template)}
                    className="flex items-center gap-4 p-4 rounded-xl border border-black/[0.05] hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all text-left group"
                  >
                    <div className={cn("w-4 h-4 rounded-full flex-shrink-0", template.color)} />
                    <div>
                      <span className="b2 font-bold text-text-primary group-hover:text-brand-primary transition-colors">{template.name} Template</span>
                      <p className="b4 text-text-secondary">Pre-configured with standard {template.name.toLowerCase()} access.</p>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="relative flex items-center py-2 mb-4">
                <div className="flex-grow border-t border-black/[0.05]"></div>
                <span className="flex-shrink-0 mx-4 b4 font-bold text-text-secondary uppercase">or</span>
                <div className="flex-grow border-t border-black/[0.05]"></div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleConfirmCreateRole()}
              >
                Skip & Start from Scratch
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* add employee modal */}
      {isAddEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl md:rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 md:px-8 py-4 md:py-6 flex items-center justify-between border-b border-black/[0.05]">
              <h2 className="b2 font-bold text-text-primary">Add New Employee</h2>
              <button onClick={() => {setIsAddEmployeeModalOpen(false); setNewEmployeeCredentials(null);}} className="text-text-secondary hover:text-text-primary transition-colors p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              {!newEmployeeCredentials ? (
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="b4 font-bold text-text-secondary mb-2 block uppercase tracking-wider">Employee Name</label>
                    <Input 
                      placeholder="e.g. Jane Doe" 
                      value={newEmployeeName} 
                      onChange={(e) => setNewEmployeeName(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <Button 
                    variant="primary" 
                    className="w-full" 
                    onClick={handleAddEmployee}
                    disabled={!newEmployeeName.trim()}
                  >
                    Generate Credentials & Assign
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-6 text-center">
                  <div className="w-16 h-16 bg-success-secondary text-success-primary rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check size={32} strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="b2 font-bold text-text-primary mb-1">Employee Added Successfully!</h3>
                    <p className="b4 text-text-secondary">Please copy these generated credentials. The password cannot be recovered later.</p>
                  </div>
                  
                  <div className="bg-bg-primary rounded-2xl p-4 text-left flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="b4 text-text-secondary font-bold">USERNAME</span>
                      <span className="b3 text-text-primary font-mono bg-white px-2 py-1 rounded-md border border-black/[0.05]">{newEmployeeCredentials.username}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="b4 text-text-secondary font-bold">PASSWORD</span>
                      <span className="b3 text-text-primary font-mono bg-white px-2 py-1 rounded-md border border-black/[0.05]">{newEmployeeCredentials.password}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    leftIcon={<Copy size={16} />}
                    onClick={() => {
                      navigator.clipboard.writeText(`Username: ${newEmployeeCredentials.username}\nPassword: ${newEmployeeCredentials.password}`);
                      setIsAddEmployeeModalOpen(false);
                      setNewEmployeeCredentials(null);
                    }}
                  >
                    Copy & Close
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
