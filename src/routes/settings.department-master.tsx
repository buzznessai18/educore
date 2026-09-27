import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { DepartmentMasterListPage } from "@/modules/admin-portal/components/department-master-list-page";

export const Route = createFileRoute("/settings/department-master")({
  head: () =>
    educoreHead(
      "EduCore Department List",
      "Maintain department masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/department-master">
      <DepartmentMasterListPage />
    </EduCoreAppShell>
  );
}
