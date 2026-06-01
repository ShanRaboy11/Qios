import { EmployeeSettingsClient } from "../../../../../components/organisms/EmployeeSettingsClient";
import { getEmployeeSettingsPageData } from "./actions";

export default async function EmployeeSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = await params;
  const initialData = await getEmployeeSettingsPageData(tenantId);

  return (
    <EmployeeSettingsClient tenantId={tenantId} initialData={initialData} />
  );
}
