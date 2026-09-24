import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { TransportFeeDueListPendingReportPage } from "@/modules/admin-portal/components/transport-fee-due-list-pending-report-page";

export const Route = createFileRoute("/fms/transport-fee-due-list-pending-report")({
  head: () =>
    educoreHead(
      "EduCore Transport Fee Due List Pending Report",
      "Generate transport pending fee-descriptions report in EduCore FMS.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/transport-fee-due-list-pending-report">
      <TransportFeeDueListPendingReportPage />
    </EduCoreAppShell>
  );
}
