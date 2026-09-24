import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { FeeMasterListPage } from "@/modules/admin-portal/components/fee-master-list-page";

export const Route = createFileRoute("/fms/fee-master")({
  head: () => educoreHead("EduCore Fee List", "Maintain fee masters for EduCore FMS module."),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/fee-master">
      <FeeMasterListPage />
    </EduCoreAppShell>
  );
}
