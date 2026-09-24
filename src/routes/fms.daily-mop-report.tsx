import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { DailyMopReportPage } from "@/modules/admin-portal/components/daily-mop-report-page";

export const Route = createFileRoute("/fms/daily-mop-report")({
  head: () =>
    educoreHead(
      "EduCore Daily Mode of Payment Report",
      "Generate daily mode of payment report in EduCore FMS.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/daily-mop-report">
      <DailyMopReportPage />
    </EduCoreAppShell>
  );
}
