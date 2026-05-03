export type SubscriptionPlan = "basic" | "business" | "enterprise";
export type InventoryMode = "unit" | "recipe";
export type ServiceWorkflow = "pickup" | "dine_in";
export type DashboardFocus = "speed" | "revenue";
export type SupplyLogic = "centralized" | "local";

export interface TenantSettings {
  inventory_mode: InventoryMode;
  service_workflow: ServiceWorkflow;
  dashboard_focus: DashboardFocus;
  supply_logic?: SupplyLogic;
}

export interface OperationalSetupConfig {
  inventoryMode: InventoryMode;
  serviceWorkflow: ServiceWorkflow;
  dashboardFocus: DashboardFocus;
  supplyLogic: SupplyLogic;
}
