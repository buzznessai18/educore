import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { DesignationMasterListPage } from "@/modules/admin-portal/components/designation-master-list-page";

export const Route = createFileRoute("/settings/designation-master")({
  head: () =>
    educoreHead(
      "EduCore Designation List",
      "Maintain designation masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/designation-master">
      <DesignationMasterListPage />
    </EduCoreAppShell>
  );
}
