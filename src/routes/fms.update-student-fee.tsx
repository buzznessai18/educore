import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { UpdateStudentFeePage } from "@/modules/admin-portal/components/update-student-fee-page";

export const Route = createFileRoute("/fms/update-student-fee")({
  head: () =>
    educoreHead(
      "EduCore Update Student Fee",
      "Assign fee master plans to students in EduCore FMS.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/update-student-fee">
      <UpdateStudentFeePage />
    </EduCoreAppShell>
  );
}
