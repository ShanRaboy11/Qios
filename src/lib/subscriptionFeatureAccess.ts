type FeatureGroup = Record<string, boolean> | undefined | null;

export type TenantSubscriptionFeatures =
  | {
      admin_controls?: FeatureGroup;
      [key: string]: FeatureGroup;
    }
  | null
  | undefined;

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function hasEnabledFeature(group: FeatureGroup, featureNames: string[]) {
  if (!group) return false;

  return Object.entries(group).some(
    ([featureName, isEnabled]) =>
      isEnabled === true &&
      featureNames.some(
        (expectedName) =>
          normalizeText(featureName) === normalizeText(expectedName),
      ),
  );
}

export function canAccessMultiBranchManagement(
  tenantFeatures: TenantSubscriptionFeatures,
  subscriptionPlan?: string | null,
) {
  const adminControls = tenantFeatures?.admin_controls;

  if (
    hasEnabledFeature(adminControls, [
      "Multi-Branch Management",
      "Multi-branch management",
      "Branch Management",
      "Branches",
      "Multi Branch Management",
      "multi_branch_management",
    ])
  ) {
    return true;
  }

  const normalizedPlan = normalizeText(subscriptionPlan ?? "");
  return normalizedPlan === "enterprise";
}
