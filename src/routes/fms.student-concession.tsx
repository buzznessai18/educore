import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { StudentConcessionPage } from "@/modules/admin-portal/components/student-concession-page";

export const Route = createFileRoute("/fms/student-concession")({
  head: () =>
    educoreHead(
      "EduCore Student Concession",
      "Record student fee concessions in EduCore FMS module.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/fms/student-concession">
      <StudentConcessionPage />
    </EduCoreAppShell>
  );
}
