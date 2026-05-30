type PermissionGroup = Record<string, boolean>;

export type RolePermissions = {
  auth?: PermissionGroup;
  orders?: PermissionGroup;
  inventory?: PermissionGroup;
  analytics?: PermissionGroup;
  misc?: PermissionGroup;
};

const EMPLOYEE_ROUTE_REQUIREMENTS: Record<string, string[]> = {
  dashboard: ["Employee Authentication"],
  queue: ["Order Retrieval", "Order Queue Management", "Order Status Updating"],
  kitchen: [
    "Order Retrieval",
    "Order Queue Management",
    "Order Status Updating",
  ],
  scanner: ["QR Code Scanning"],
  inventory_audit: [
    "Inventory Monitoring",
    "Stock Deduction Overview",
    "Physical Stock Input",
    "Variance Reports",
    "Shrinkage Alerts",
  ],
  stock_audit: [
    "Inventory Monitoring",
    "Stock Deduction Overview",
    "Physical Stock Input",
    "Variance Reports",
    "Shrinkage Alerts",
  ],
  transactions: ["Payment Confirmation", "Cancellation & Void Monitoring"],
  settings: ["Employee Authentication"],
};

const EMPLOYEE_ROUTE_PRIORITY = [
  "queue",
  "kitchen",
  "scanner",
  "inventory_audit",
  "transactions",
  "settings",
  "dashboard",
];

export function hasPermission(
  permissions: RolePermissions | null,
  permissionName: string,
) {
  if (!permissions) return false;

  return Object.values(permissions).some(
    (group) => group?.[permissionName] === true,
  );
}

export function canAccessEmployeeRoute(
  permissions: RolePermissions | null,
  routeName: string,
) {
  if (routeName === "dashboard") {
    return true;
  }

  if (!permissions) {
    return true;
  }

  const requiredPermissions = EMPLOYEE_ROUTE_REQUIREMENTS[routeName];

  if (!requiredPermissions) {
    return true;
  }

  return requiredPermissions.some((permissionName) =>
    hasPermission(permissions, permissionName),
  );
}

export function getFirstAccessibleEmployeeRoute(
  permissions: RolePermissions | null,
) {
  for (const routeName of EMPLOYEE_ROUTE_PRIORITY) {
    if (canAccessEmployeeRoute(permissions, routeName)) {
      return routeName;
    }
  }

  return "dashboard";
}

export function canUpdateEmployeeOrderStatus(
  permissions: RolePermissions | null,
) {
  return !!permissions && hasPermission(permissions, "Order Status Updating");
}
