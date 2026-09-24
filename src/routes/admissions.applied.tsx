import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { AdmissionListPage } from "@/modules/admin-portal/components/admission-list-page";

export const Route = createFileRoute("/admissions/applied")({
  head: () =>
    educoreHead(
      "EduCore Applied Students",
      "Applied student admissions list with filters, export actions, pay and edit workflows.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/admissions/applied">
      <AdmissionListPage listStatus="applied" />
    </EduCoreAppShell>
  );
}
