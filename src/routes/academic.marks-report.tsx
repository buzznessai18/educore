import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { MarksReportPage } from "@/modules/admin-portal/components/marks-report-page";

export const Route = createFileRoute("/academic/marks-report")({
  head: () =>
    educoreHead(
      "EduCore Marks Report",
      "Print student marks reports in EduCore academic module.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/academic/marks-report">
      <MarksReportPage />
    </EduCoreAppShell>
  );
}
