import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { StudentAdmissionPage } from "@/modules/admin-portal/components/student-admission-page";

export const Route = createFileRoute("/admissions/applied")({
  head: () =>
    educoreHead(
      "EduCore Student Admission",
      "Student admission filters and workflows for EduCore admin portal.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/admissions/applied">
      <StudentAdmissionPage />
    </EduCoreAppShell>
  );
}
