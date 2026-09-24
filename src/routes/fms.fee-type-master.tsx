import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { FeeTypeMasterPage } from "@/modules/admin-portal/components/fee-type-master-page";

export const Route = createFileRoute("/fms/fee-type-master")({
  head: () =>
    educoreHead(
      "EduCore Fee Type Master",
      "Maintain fee type masters for EduCore FMS module.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/fee-type-master">
      <FeeTypeMasterPage />
    </EduCoreAppShell>
  );
}
