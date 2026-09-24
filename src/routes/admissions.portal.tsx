import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { AdminPortalDashboard } from "@/modules/admin-portal/components/admin-portal-dashboard";

export const Route = createFileRoute("/admissions/portal")({
  head: () =>
    educoreHead(
      "EduCore Admin Portal",
      "Student management admin portal with summary metrics and financial analytics.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/admissions/portal">
      <AdminPortalDashboard />
    </EduCoreAppShell>
  );
}
