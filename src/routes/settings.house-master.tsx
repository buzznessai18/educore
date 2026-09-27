import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { HouseMasterSettingsPage } from "@/modules/admin-portal/components/house-master-settings-page";

export const Route = createFileRoute("/settings/house-master")({
  head: () =>
    educoreHead(
      "EduCore House Master",
      "Maintain house masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/house-master">
      <HouseMasterSettingsPage />
    </EduCoreAppShell>
  );
}
