import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { StudentMarksCardPage } from "@/modules/admin-portal/components/student-marks-card-page";

export const Route = createFileRoute("/academic/marks-card")({
  head: () =>
    educoreHead(
      "EduCore Student MarksCard",
      "Generate and print student markscards in EduCore academic module.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/academic/marks-card">
      <StudentMarksCardPage />
    </EduCoreAppShell>
  );
}
