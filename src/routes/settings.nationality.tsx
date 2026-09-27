import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { NationalitySettingsPage } from "@/modules/admin-portal/components/nationality-settings-page";

export const Route = createFileRoute("/settings/nationality")({
  head: () =>
    educoreHead(
      "EduCore Country",
      "Maintain country and nationality masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/nationality">
      <NationalitySettingsPage />
    </EduCoreAppShell>
  );
}
