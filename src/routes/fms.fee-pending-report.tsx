import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { FeePendingReportPage } from "@/modules/admin-portal/components/fee-pending-report-page";

export const Route = createFileRoute("/fms/fee-pending-report")({
  head: () =>
    educoreHead(
      "EduCore Pending Fee Details",
      "View pending fee details report in EduCore FMS.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/fee-pending-report">
      <FeePendingReportPage />
    </EduCoreAppShell>
  );
}
