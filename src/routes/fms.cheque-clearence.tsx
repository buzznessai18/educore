import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { ChequeClearencePage } from "@/modules/admin-portal/components/cheque-clearence-page";

export const Route = createFileRoute("/fms/cheque-clearence")({
  head: () =>
    educoreHead(
      "EduCore Accept Bank Transactions",
      "Accept cheque and bank transactions for clearance in EduCore FMS.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/cheque-clearence">
      <ChequeClearencePage />
    </EduCoreAppShell>
  );
}
