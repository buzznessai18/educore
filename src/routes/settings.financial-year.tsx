import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { FinancialYearSettingsPage } from "@/modules/admin-portal/components/financial-year-settings-page";

export const Route = createFileRoute("/settings/financial-year")({
  head: () =>
    educoreHead(
      "EduCore Financial Year",
      "Maintain financial year masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/financial-year">
      <FinancialYearSettingsPage />
    </EduCoreAppShell>
  );
}
