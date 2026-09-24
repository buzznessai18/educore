import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { ClassAllocationReportPage } from "@/modules/admin-portal/components/class-allocation-report-page";

export const Route = createFileRoute("/academic/class-allocation-report")({
  head: () =>
    educoreHead(
      "EduCore Subject Faculty Info",
      "Class allocation / subject faculty info report for EduCore academic module.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/academic/class-allocation-report">
      <ClassAllocationReportPage />
    </EduCoreAppShell>
  );
}
