import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { UpdateMaterialFeePage } from "@/modules/admin-portal/components/update-material-fee-page";

export const Route = createFileRoute("/fms/update-material-fee")({
  head: () =>
    educoreHead(
      "EduCore Update Material Fee",
      "Assign material fee plans to students in EduCore FMS.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/update-material-fee">
      <UpdateMaterialFeePage />
    </EduCoreAppShell>
  );
}
