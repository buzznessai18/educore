import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { ChangeStudentFeePage } from "@/modules/admin-portal/components/change-student-fee-page";

export const Route = createFileRoute("/fms/change-student-fee")({
  head: () =>
    educoreHead(
      "EduCore Change/Upgrade Fees",
      "Change or upgrade student fee plans in EduCore FMS.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/change-student-fee">
      <ChangeStudentFeePage />
    </EduCoreAppShell>
  );
}
