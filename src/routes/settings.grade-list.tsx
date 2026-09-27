import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { GradeListSettingsPage } from "@/modules/admin-portal/components/grade-list-settings-page";

export const Route = createFileRoute("/settings/grade-list")({
  head: () =>
    educoreHead(
      "EduCore Grade list",
      "Maintain grade scale masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/grade-list">
      <GradeListSettingsPage />
    </EduCoreAppShell>
  );
}
