import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { LeaveYearSettingsPage } from "@/modules/admin-portal/components/leave-year-settings-page";

export const Route = createFileRoute("/settings/leave-year")({
  head: () =>
    educoreHead(
      "EduCore Leave Year",
      "Maintain leave year masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/leave-year">
      <LeaveYearSettingsPage />
    </EduCoreAppShell>
  );
}
