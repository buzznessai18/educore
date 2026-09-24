import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { RteReportPage } from "@/modules/admin-portal/components/rte-report-page";

export const Route = createFileRoute("/fms/rte-report")({
  head: () => educoreHead("EduCore RTE Report", "View RTE fee exemption report in EduCore FMS."),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/rte-report">
      <RteReportPage />
    </EduCoreAppShell>
  );
}
