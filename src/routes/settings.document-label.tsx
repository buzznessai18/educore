import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { DocumentLabelSettingsPage } from "@/modules/admin-portal/components/document-label-settings-page";

export const Route = createFileRoute("/settings/document-label")({
  head: () =>
    educoreHead(
      "EduCore Document Label",
      "Maintain document label masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/document-label">
      <DocumentLabelSettingsPage />
    </EduCoreAppShell>
  );
}
