"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FeatureToggle } from "@/components/molecules/FeatureToggle";
import { Plus, Search, ShieldAlert, Check, Copy, Trash2, GripVertical, Utensils, Store, LineChart, Package, Link2, X } from "lucide-react";
import { cn } from "@/lib/utils";

// types
type FeatureGroup = {
  [key: string]: boolean;
};

type Features = {
  menu: FeatureGroup;
  store: FeatureGroup;
  sales: FeatureGroup;
  operations: FeatureGroup;
  integrations: FeatureGroup;
};

type SubscriptionPlan = {
  id: string;
  name: string;
  color: string;
  badge: string;
  priceMonthly: string;
  priceAnnually: string;
  features: Features;
};

// initial data
const DEFAULT_FEATURES: Features = {
  menu: {
    "QR mobile ordering": false,
    "Simple digital menu + cart": false,
    "AI chat ordering functionality": false,
    "Customizable menu options": false,
  },
  store: {
    "Staff accounts with login": false,
    "Multi-device support": false,
    "Multi-branch management": false,
    "Custom settings per branch": false,
  },
  sales: {
    "Basic sales summary": false,
    "Live sales dashboard": false,
    "Detailed analytical reports": false,
    "Deep efficiency analytics": false,
  },
  operations: {
    "Order status tracking": false,
    "Inventory & performance tracking": false,
    "Advanced stock tracking": false,
    "Full activity audit logs": false,
  },
  integrations: {
    "External API integration": false,
  },
};

const FEATURE_DESCRIPTIONS: Record<string, string> = {
  "QR mobile ordering": "Allow customers to order via QR codes.",
  "Simple digital menu + cart": "Basic digital menu and cart functionality.",
  "AI chat ordering functionality": "AI-powered chat ordering for customers.",
  "Customizable menu options": "Advanced menu customization and modifiers.",
  "Staff accounts with login": "Create individual staff accounts.",
  "Multi-device support": "Use the system on multiple devices simultaneously.",
  "Multi-branch management": "Manage multiple store locations from one account.",
  "Custom settings per branch": "Configure unique settings for each branch.",
  "Basic sales summary": "View high-level daily sales data.",
  "Live sales dashboard": "Real-time tracking of sales and performance.",
  "Detailed analytical reports": "Generate comprehensive reports and insights.",
  "Deep efficiency analytics": "Advanced analytics for staff and operational efficiency.",
  "Order status tracking": "Track the status of orders in real-time.",
  "Inventory & performance tracking": "Basic inventory monitoring and item performance.",
  "Advanced stock tracking": "Detailed tracking with variance and shrinkage alerts.",
  "Full activity audit logs": "Comprehensive logs of all system activities.",
  "External API integration": "Connect with third-party tools and services.",
};

const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: "p1",
    name: "Basic",
    color: "bg-[#ffc670]",
    badge: "Starter Ready",
    priceMonthly: "1,499",
    priceAnnually: "15,290",
    features: {
      menu: { "QR mobile ordering": true, "Simple digital menu + cart": true, "AI chat ordering functionality": false, "Customizable menu options": false },
      store: { "Staff accounts with login": false, "Multi-device support": false, "Multi-branch management": false, "Custom settings per branch": false },
      sales: { "Basic sales summary": true, "Live sales dashboard": false, "Detailed analytical reports": false, "Deep efficiency analytics": false },
      operations: { "Order status tracking": true, "Inventory & performance tracking": false, "Advanced stock tracking": false, "Full activity audit logs": false },
      integrations: { "External API integration": false },
    }
  },
  {
    id: "p2",
    name: "Business",
    color: "bg-[#ff5269]",
    badge: "Most Popular",
    priceMonthly: "3,499",
    priceAnnually: "35,690",
    features: {
      menu: { "QR mobile ordering": true, "Simple digital menu + cart": true, "AI chat ordering functionality": true, "Customizable menu options": true },
      store: { "Staff accounts with login": true, "Multi-device support": true, "Multi-branch management": false, "Custom settings per branch": false },
      sales: { "Basic sales summary": true, "Live sales dashboard": true, "Detailed analytical reports": true, "Deep efficiency analytics": false },
      operations: { "Order status tracking": true, "Inventory & performance tracking": true, "Advanced stock tracking": false, "Full activity audit logs": false },
      integrations: { "External API integration": false },
    }
  },
  {
    id: "p3",
    name: "Enterprise",
    color: "bg-[#1fad66]",
    badge: "Premium Suite",
    priceMonthly: "7,999",
    priceAnnually: "81,590",
    features: {
      menu: { "QR mobile ordering": true, "Simple digital menu + cart": true, "AI chat ordering functionality": true, "Customizable menu options": true },
      store: { "Staff accounts with login": true, "Multi-device support": true, "Multi-branch management": true, "Custom settings per branch": true },
      sales: { "Basic sales summary": true, "Live sales dashboard": true, "Detailed analytical reports": true, "Deep efficiency analytics": true },
      operations: { "Order status tracking": true, "Inventory & performance tracking": true, "Advanced stock tracking": true, "Full activity audit logs": true },
      integrations: { "External API integration": true },
    }
  }
];

const PRESET_COLORS = [
  "bg-[#ffc670]", // basic
  "bg-[#ff5269]", // business
  "bg-[#1fad66]", // enterprise
  "bg-[#3b82f6]", // blue
  "bg-[#8b5cf6]", // purple
  "bg-text-primary", // dark
];

export default function SubscriptionManagementPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(INITIAL_PLANS);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0].id);
  const [draftPlan, setDraftPlan] = useState<SubscriptionPlan | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  const [showTemplateReminder, setShowTemplateReminder] = useState(false);

  // drag and drop state
  const [draggedPlanId, setDraggedPlanId] = useState<string | null>(null);

  const activePlan = plans.find((p) => p.id === selectedPlanId);
  
  // initialize draft when active plan changes
  useEffect(() => {
    if (activePlan) {
      setDraftPlan(JSON.parse(JSON.stringify(activePlan))); // deep copy
      setShowTemplateReminder(false);
    }
  }, [activePlan]);

  const hasChanges = JSON.stringify(activePlan) !== JSON.stringify(draftPlan);

  const handleFeatureChange = (category: keyof Features, key: string, value: boolean) => {
    if (!draftPlan) return;
    setDraftPlan({
      ...draftPlan,
      features: {
        ...draftPlan.features,
        [category]: {
          ...draftPlan.features[category],
          [key]: value,
        },
      },
    });
  };

  const handleSave = () => {
    if (!draftPlan) return;
    setPlans(plans.map((p) => (p.id === draftPlan.id ? draftPlan : p)));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedPlanId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedPlanId || draggedPlanId === targetId) return;

    const newPlans = [...plans];
    const draggedIndex = newPlans.findIndex(p => p.id === draggedPlanId);
    const targetIndex = newPlans.findIndex(p => p.id === targetId);

    const [draggedPlan] = newPlans.splice(draggedIndex, 1);
    newPlans.splice(targetIndex, 0, draggedPlan);

    setPlans(newPlans);
    setDraggedPlanId(null);
  };

  const handleDiscard = () => {
    if (activePlan) {
      setDraftPlan(JSON.parse(JSON.stringify(activePlan)));
    }
  };

  const handleConfirmCreatePlan = (templatePlan?: SubscriptionPlan) => {
    const newPlan: SubscriptionPlan = {
      id: `p${Date.now()}`,
      name: templatePlan ? templatePlan.name : "New Plan",
      color: templatePlan ? templatePlan.color : PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
      badge: templatePlan ? templatePlan.badge : "",
      priceMonthly: templatePlan ? templatePlan.priceMonthly : "0",
      priceAnnually: templatePlan ? templatePlan.priceAnnually : "0",
      features: templatePlan ? JSON.parse(JSON.stringify(templatePlan.features)) : JSON.parse(JSON.stringify(DEFAULT_FEATURES)),
    };
    setPlans([...plans, newPlan]);
    setSelectedPlanId(newPlan.id);
    setIsCreatePlanModalOpen(false);
    if (templatePlan) setShowTemplateReminder(true);
  };

  const handleDuplicate = () => {
    if (!activePlan) return;
    const newPlan: SubscriptionPlan = {
      ...JSON.parse(JSON.stringify(activePlan)),
      id: `p${Date.now()}`,
      name: `${activePlan.name} (Copy)`,
    };
    setPlans([...plans, newPlan]);
    setSelectedPlanId(newPlan.id);
  };

  const handleDelete = () => {
    if (plans.length <= 1) return; // don't delete last plan
    const newPlans = plans.filter((p) => p.id !== selectedPlanId);
    setPlans(newPlans);
    setSelectedPlanId(newPlans[0].id);
  };

  const filteredPlans = plans.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-bg-primary overflow-hidden rounded-2xl md:rounded-[32px] border-4 border-white shadow-xl max-w-7xl mx-4 xl:mx-auto my-4 md:my-8">
      {/* header */}
      <div className="flex-shrink-0 px-4 md:px-8 pt-6 md:pt-10 pb-4 md:pb-6">
        <h1 className="h2 text-text-primary mb-2">Subscription Plans</h1>
        <p className="b1 text-text-secondary">Configure available subscription plans and their feature access levels.</p>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        {/* sidebar */}
        <div className="w-full md:w-[320px] flex flex-col flex-shrink-0 border-b-2 md:border-b-0 md:border-r-2 border-white/50 bg-white/30 backdrop-blur-md h-[40%] md:h-auto min-h-[250px]">
          <div className="p-4 md:p-6 pb-4 flex flex-col gap-4">
            <Button
              variant="primary"
              className="w-full"
              leftIcon={<Plus size={18} />}
              onClick={() => setIsCreatePlanModalOpen(true)}
            >
              New Plan
            </Button>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={18} className="text-text-secondary" />
              </div>
              <Input
                placeholder="Search plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 !py-2.5 rounded-xl !bg-white/60 !border-white/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 md:px-4 pb-6 custom-scrollbar">
            <div className="flex flex-col gap-2">
              {filteredPlans.map((plan, index) => (
                <div
                  key={plan.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, plan.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, plan.id)}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={cn(
                    "group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200",
                    selectedPlanId === plan.id
                      ? "bg-white shadow-sm border border-black/[0.03]"
                      : "hover:bg-white/50 border border-transparent",
                    draggedPlanId === plan.id && "opacity-50"
                  )}
                >
                  <div className="text-text-secondary/30 group-hover:text-text-secondary/60 cursor-grab active:cursor-grabbing px-1">
                    <GripVertical size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full shadow-sm flex-shrink-0", plan.color)} />
                      <span className={cn(
                        "b2 font-bold transition-colors truncate",
                        selectedPlanId === plan.id ? "text-text-primary" : "text-text-primary/80"
                      )}>
                        {plan.name}
                      </span>
                    </div>
                    {plan.badge && (
                      <span className="b5 text-text-secondary truncate mt-0.5 ml-5">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* main panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-white/50">
          {draftPlan ? (
            <>
              {/* plan settings header */}
              <div className="p-4 md:p-8 pb-4 md:pb-6 border-b-2 border-white/50 flex-shrink-0 flex flex-col gap-4 md:gap-6">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 w-full max-w-2xl flex gap-4 md:gap-6">
                    <div className="flex-1">
                      <label className="b4 font-bold text-text-secondary mb-2 block uppercase tracking-wider">Plan Name</label>
                      <Input
                        value={draftPlan.name}
                        onChange={(e) => setDraftPlan({ ...draftPlan, name: e.target.value })}
                        className="text-lg font-bold !bg-white/80 !py-1.5 !h-10"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="b4 font-bold text-text-secondary mb-2 block uppercase tracking-wider">Badge (Optional)</label>
                      <Input
                        value={draftPlan.badge}
                        onChange={(e) => setDraftPlan({ ...draftPlan, badge: e.target.value })}
                        placeholder="e.g. Most Popular"
                        className="text-sm !bg-white/80 !py-1.5 !h-10"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 self-end sm:self-auto mt-2 sm:mt-0">
                    <Button variant="ghost" size="icon" onClick={handleDuplicate} title="Duplicate Plan">
                      <Copy size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleDelete} 
                      className="text-error-primary hover:text-error-primary hover:bg-error-primary/10"
                      disabled={plans.length <= 1}
                      title="Delete Plan"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                  <div className="flex-1 max-w-[200px]">
                    <label className="b4 font-bold text-text-secondary mb-2 block uppercase tracking-wider">Monthly Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 b2 font-bold text-text-secondary">₱</span>
                      <Input
                        value={draftPlan.priceMonthly}
                        onChange={(e) => setDraftPlan({ ...draftPlan, priceMonthly: e.target.value })}
                        className="pl-7 !bg-white/80 !py-1.5 !h-10"
                      />
                    </div>
                  </div>
                  <div className="flex-1 max-w-[200px]">
                    <label className="b4 font-bold text-text-secondary mb-2 block uppercase tracking-wider">Annual Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 b2 font-bold text-text-secondary">₱</span>
                      <Input
                        value={draftPlan.priceAnnually}
                        onChange={(e) => setDraftPlan({ ...draftPlan, priceAnnually: e.target.value })}
                        className="pl-7 !bg-white/80 !py-1.5 !h-10"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="b4 font-bold text-text-secondary mb-3 block uppercase tracking-wider">Plan Color</label>
                    <div className="flex gap-2 sm:gap-3 flex-nowrap pb-1">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => setDraftPlan({ ...draftPlan, color })}
                          className={cn(
                            "w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 rounded-full shadow-md transition-transform duration-200 hover:scale-110 flex items-center justify-center",
                            color,
                            draftPlan.color === color && "ring-4 ring-brand-primary/30 scale-110"
                          )}
                        >
                          {draftPlan.color === color && <Check className="text-white w-3 h-3 sm:w-4 sm:h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* main tab content */}
              <div className="flex-1 flex flex-col min-h-0 relative">
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                  <div className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-8 pb-4">
                    
                    {showTemplateReminder && (
                      <div className="bg-warning-secondary/30 border border-warning-primary/30 rounded-xl md:rounded-[24px] p-4 flex items-start gap-3">
                        <ShieldAlert className="text-warning-primary flex-shrink-0 mt-0.5" size={18} />
                        <div>
                          <h4 className="b3 font-bold text-warning-primary">Review Predefined Features</h4>
                          <p className="b4 text-warning-primary/80">You've applied a predefined subscription template. Please review and confirm the feature access levels below.</p>
                        </div>
                        <button onClick={() => setShowTemplateReminder(false)} className="ml-auto text-warning-primary/60 hover:text-warning-primary transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    
                    {/* category sections */}
                    {Object.entries({
                      "Menu & Ordering": { key: "menu" as keyof Features, data: draftPlan.features.menu, icon: <Utensils size={18}/> },
                      "Store Management": { key: "store" as keyof Features, data: draftPlan.features.store, icon: <Store size={18} /> },
                      "Sales & Analytics": { key: "sales" as keyof Features, data: draftPlan.features.sales, icon: <LineChart size={18} /> },
                      "Operations & Inventory": { key: "operations" as keyof Features, data: draftPlan.features.operations, icon: <Package size={18} /> },
                      "Integrations": { key: "integrations" as keyof Features, data: draftPlan.features.integrations, icon: <Link2 size={18} /> },
                    }).map(([categoryName, { key: categoryKey, data, icon }]) => (
                      <div key={categoryName} className="bg-white rounded-xl md:rounded-[24px] shadow-sm border border-black/[0.03] overflow-hidden">
                        <div className="px-4 md:px-6 py-3 md:py-4 bg-brand-secondary/10 border-b border-black/[0.03] flex items-center gap-2">
                          {icon && <span className="text-brand-primary">{icon}</span>}
                          <h3 className="b3 font-bold text-text-primary uppercase tracking-wider">{categoryName}</h3>
                        </div>
                        <div className="p-2 flex flex-col">
                          {Object.entries(data).map(([featureName, isEnabled]) => (
                            <FeatureToggle
                              key={featureName}
                              label={featureName}
                              description={FEATURE_DESCRIPTIONS[featureName]}
                              checked={isEnabled}
                              variant="accent"
                              onChange={(checked) => handleFeatureChange(categoryKey, featureName, checked)}
                              className="!rounded-xl"
                            />
                          ))}
                        </div>
                      </div>
                    ))}

                  </div>
                </div>

                {/* action footer */}
                <div className={cn(
                  "absolute bottom-0 inset-x-0 p-4 md:p-6 bg-white/80 backdrop-blur-md border-t border-black/[0.05] flex items-center justify-between transition-transform duration-300",
                  hasChanges ? "translate-y-0" : "translate-y-full opacity-0 pointer-events-none"
                )}>
                  <div className="flex flex-col">
                    <span className="b2 font-bold text-text-primary">Unsaved changes</span>
                    <span className="b4 text-text-secondary hidden sm:inline">You have modified this plan's configuration.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" onClick={handleDiscard}>Discard</Button>
                    <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center b2 text-text-secondary bg-white/50 px-6 py-4 rounded-full shadow-sm border border-white">
                Select a plan to manage its features
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* scrollbar styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
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

      {/* create plan modal */}
      {isCreatePlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl md:rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 md:px-8 py-4 md:py-6 flex items-center justify-between border-b border-black/[0.05] flex-shrink-0">
              <h2 className="b2 font-bold text-text-primary">Create New Plan</h2>
              <button onClick={() => setIsCreatePlanModalOpen(false)} className="text-text-secondary hover:text-text-primary transition-colors p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto">
              <p className="b3 text-text-secondary font-semibold mb-6">Choose a predefined template to quickly set up features, or start from scratch.</p>
              
              <div className="flex flex-col gap-3 mb-6">
                {INITIAL_PLANS.map((template) => (
                  <button 
                    key={template.id}
                    onClick={() => handleConfirmCreatePlan(template)}
                    className="flex items-center gap-4 p-4 rounded-xl border border-black/[0.05] hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all text-left group"
                  >
                    <div className={cn("w-4 h-4 rounded-full flex-shrink-0", template.color)} />
                    <div>
                      <span className="b2 font-bold text-text-primary group-hover:text-brand-primary transition-colors">{template.name} Plan</span>
                      <p className="b4 text-text-secondary">Pre-configured with standard {template.name.toLowerCase()} tier access.</p>
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
                onClick={() => handleConfirmCreatePlan()}
              >
                Skip & Start from Scratch
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
