import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { AdmissionListPage } from "@/modules/admin-portal/components/admission-list-page";

export const Route = createFileRoute("/admissions/admitted")({
  head: () =>
    educoreHead(
      "EduCore Admitted Students",
      "Admitted student list with fee collection and registration edit actions.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/admissions/admitted">
      <AdmissionListPage listStatus="admitted" />
    </EduCoreAppShell>
  );
}
