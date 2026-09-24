import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { FeeConcessionReportPage } from "@/modules/admin-portal/components/fee-concession-report-page";

export const Route = createFileRoute("/fms/fee-concession-report")({
  head: () =>
    educoreHead(
      "EduCore Fee Concession Details",
      "View fee concession details report in EduCore FMS.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/fee-concession-report">
      <FeeConcessionReportPage />
    </EduCoreAppShell>
  );
}
