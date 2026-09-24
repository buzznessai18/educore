import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { PickupPointListPage } from "@/modules/admin-portal/components/pickup-point-list-page";

export const Route = createFileRoute("/fms/pickup-point")({
  head: () =>
    educoreHead(
      "EduCore Pickup Point List",
      "Maintain transport pickup points for EduCore FMS module.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/pickup-point">
      <PickupPointListPage />
    </EduCoreAppShell>
  );
}
