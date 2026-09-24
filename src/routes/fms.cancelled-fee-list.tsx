import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { CancelledFeeListPage } from "@/modules/admin-portal/components/cancelled-fee-list-page";

export const Route = createFileRoute("/fms/cancelled-fee-list")({
  head: () =>
    educoreHead(
      "EduCore Cancel Fee Print List",
      "View and reprint cancelled fee receipts in EduCore FMS.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/cancelled-fee-list">
      <CancelledFeeListPage />
    </EduCoreAppShell>
  );
}
