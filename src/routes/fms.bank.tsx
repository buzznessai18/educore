import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { BankListPage } from "@/modules/admin-portal/components/bank-list-page";

export const Route = createFileRoute("/fms/bank")({
  head: () => educoreHead("EduCore Bank List", "Maintain bank masters for EduCore FMS module."),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/bank">
      <BankListPage />
    </EduCoreAppShell>
  );
}
