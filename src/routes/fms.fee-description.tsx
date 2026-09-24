import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { FeeDescriptionListPage } from "@/modules/admin-portal/components/fee-description-list-page";

export const Route = createFileRoute("/fms/fee-description")({
  head: () =>
    educoreHead(
      "EduCore Fee Description List",
      "Maintain fee description masters for EduCore FMS module.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/fee-description">
      <FeeDescriptionListPage />
    </EduCoreAppShell>
  );
}
