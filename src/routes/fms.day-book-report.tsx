import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { DayBookReportPage } from "@/modules/admin-portal/components/day-book-report-page";

export const Route = createFileRoute("/fms/day-book-report")({
  head: () => educoreHead("EduCore Day Book Report", "Generate day book report in EduCore FMS."),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/day-book-report">
      <DayBookReportPage />
    </EduCoreAppShell>
  );
}
