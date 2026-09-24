import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { FeeDueListPendingReportPage } from "@/modules/admin-portal/components/fee-due-list-pending-report-page";

export const Route = createFileRoute("/fms/fee-due-list-pending-report")({
  head: () =>
    educoreHead(
      "EduCore Pending Fee-Descriptions",
      "Generate fee due list pending report by fee description in EduCore FMS.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/fee-due-list-pending-report">
      <FeeDueListPendingReportPage />
    </EduCoreAppShell>
  );
}
