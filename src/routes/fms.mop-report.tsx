import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { MopReportPage } from "@/modules/admin-portal/components/mop-report-page";

export const Route = createFileRoute("/fms/mop-report")({
  head: () =>
    educoreHead(
      "EduCore Mode of Payment Report",
      "Generate mode of payment report for receipts and payments in EduCore FMS.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/mop-report">
      <MopReportPage />
    </EduCoreAppShell>
  );
}
