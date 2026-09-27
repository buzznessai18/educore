import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { SyllabusSettingsPage } from "@/modules/admin-portal/components/syllabus-settings-page";

export const Route = createFileRoute("/settings/syllabus")({
  head: () =>
    educoreHead(
      "EduCore Syllabus",
      "Maintain syllabus and branch masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/syllabus">
      <SyllabusSettingsPage />
    </EduCoreAppShell>
  );
}
