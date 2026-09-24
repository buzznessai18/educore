import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { FeeReceiptPage } from "@/modules/admin-portal/components/fee-receipt-page";

export const Route = createFileRoute("/fms/fee-receipt")({
  head: () =>
    educoreHead("EduCore Fee Receipt", "Create and pay student fee receipts in EduCore FMS."),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/fee-receipt">
      <FeeReceiptPage />
    </EduCoreAppShell>
  );
}
