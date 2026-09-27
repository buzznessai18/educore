import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { MetaFormPlatformListPage } from "@/modules/admin-portal/components/metaform-platform-list-page";

export const Route = createFileRoute("/settings/metaform-platform-list")({
  head: () =>
    educoreHead(
      "EduCore MetaFormPlatform list",
      "MetaForm platform list placeholder in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/metaform-platform-list">
      <MetaFormPlatformListPage />
    </EduCoreAppShell>
  );
}
