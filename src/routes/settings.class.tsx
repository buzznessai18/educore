import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { ClassSettingsPage } from "@/modules/admin-portal/components/class-settings-page";

export const Route = createFileRoute("/settings/class")({
  head: () =>
    educoreHead(
      "EduCore Class",
      "Maintain class and semester masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/class">
      <ClassSettingsPage />
    </EduCoreAppShell>
  );
}
