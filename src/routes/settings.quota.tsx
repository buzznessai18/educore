import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { QuotaSettingsPage } from "@/modules/admin-portal/components/quota-settings-page";

export const Route = createFileRoute("/settings/quota")({
  head: () =>
    educoreHead(
      "EduCore Quota",
      "Maintain admission quota masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/quota">
      <QuotaSettingsPage />
    </EduCoreAppShell>
  );
}
