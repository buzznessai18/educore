import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { LevelSettingsPage } from "@/modules/admin-portal/components/level-settings-page";

export const Route = createFileRoute("/settings/level")({
  head: () =>
    educoreHead(
      "EduCore Level",
      "Maintain level and combination masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/level">
      <LevelSettingsPage />
    </EduCoreAppShell>
  );
}
