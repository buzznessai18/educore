import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { AcademicSettingsPage } from "@/modules/admin-portal/components/academic-settings-page";

export const Route = createFileRoute("/settings/academic")({
  head: () =>
    educoreHead(
      "EduCore Academic Year",
      "Maintain academic year masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/academic">
      <AcademicSettingsPage />
    </EduCoreAppShell>
  );
}
