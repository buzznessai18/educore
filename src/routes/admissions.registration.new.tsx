import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { AdmissionRegistrationForm } from "@/modules/admin-portal/components/admission-registration-form";

export const Route = createFileRoute("/admissions/registration/new")({
  head: () =>
    educoreHead(
      "EduCore Add Student",
      "Create a new student registration and admission record.",
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
