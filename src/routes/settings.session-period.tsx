import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { SessionPeriodSettingsPage } from "@/modules/admin-portal/components/session-period-settings-page";

export const Route = createFileRoute("/settings/session-period")({
  head: () =>
    educoreHead(
      "EduCore Session/Period",
      "Maintain session and period masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/session-period">
      <SessionPeriodSettingsPage />
    </EduCoreAppShell>
  );
}
