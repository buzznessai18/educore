import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { WithheldListPage } from "@/modules/admin-portal/components/withheld-list-page";

export const Route = createFileRoute("/academic/withheld-list")({
  head: () =>
    educoreHead(
      "EduCore WithHoldStatus List",
      "Withhold status list with search, export, and pagination for EduCore academic module.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/academic/withheld-list">
      <WithheldListPage />
    </EduCoreAppShell>
  );
}
