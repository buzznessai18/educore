import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { AdmissionRegistrationForm } from "@/modules/admin-portal/components/admission-registration-form";

export const Route = createFileRoute("/admissions/registration/$studentId")({
  head: () =>
    educoreHead(
      "EduCore Edit Admission",
      "Edit student admission and registration details in the EduCore admin portal.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  const { studentId } = Route.useParams();

  return (
    <EduCoreAppShell path="/admissions/registration">
      <AdmissionRegistrationForm studentId={studentId} />
    </EduCoreAppShell>
  );
}
