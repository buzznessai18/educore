import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { AdmissionReportPage } from "@/modules/admin-portal/components/admission-report-page";

export const Route = createFileRoute("/admissions/report")({
  head: () =>
    educoreHead(
      "EduCore Student Admission Report",
      "Student admission report filters and lists for EduCore admin portal.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/admissions/report">
      <AdmissionReportPage />
    </EduCoreAppShell>
  );
}
