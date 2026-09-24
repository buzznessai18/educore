import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { FeePrintListPage } from "@/modules/admin-portal/components/fee-print-list-page";

export const Route = createFileRoute("/fms/fee-print-list")({
  head: () =>
    educoreHead("EduCore Fee Print List", "Reprint fee receipts from EduCore FMS module."),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/fee-print-list">
      <FeePrintListPage />
    </EduCoreAppShell>
  );
}
