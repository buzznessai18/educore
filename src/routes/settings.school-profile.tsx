import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { SchoolProfileListPage } from "@/modules/admin-portal/components/school-profile-list-page";

export const Route = createFileRoute("/settings/school-profile")({
  head: () =>
    educoreHead(
      "EduCore College Profile List",
      "Maintain school and college profile masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/school-profile">
      <SchoolProfileListPage />
    </EduCoreAppShell>
  );
}
