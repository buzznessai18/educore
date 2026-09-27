import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { LeadSourceSettingsPage } from "@/modules/admin-portal/components/lead-source-settings-page";

export const Route = createFileRoute("/settings/lead-source")({
  head: () =>
    educoreHead(
      "EduCore Lead Source",
      "Maintain lead source masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/lead-source">
      <LeadSourceSettingsPage />
    </EduCoreAppShell>
  );
}
