import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { SummatativeReportPage } from "@/modules/admin-portal/components/summatative-report-page";

export const Route = createFileRoute("/academic/summatative-report")({
  head: () =>
    educoreHead(
      "EduCore Summatative Report",
      "Generate and print summatative assessment reports in EduCore academic module.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/academic/summatative-report">
      <SummatativeReportPage />
    </EduCoreAppShell>
  );
}
