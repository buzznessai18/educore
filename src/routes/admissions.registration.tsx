import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { AdmissionRegistrationForm } from "@/modules/admin-portal/components/admission-registration-form";

export const Route = createFileRoute("/admissions/registration")({
  head: () =>
    educoreHead(
      "EduCore Student Registration",
      "Comprehensive student registration and admission form for EduCore admin portal.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/admissions/registration">
      <AdmissionRegistrationForm />
    </EduCoreAppShell>
  );
}
