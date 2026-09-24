import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { StudentFeedbackReportPage } from "@/modules/admin-portal/components/student-feedback-report-page";

export const Route = createFileRoute("/academic/feedback-report")({
  head: () =>
    educoreHead(
      "EduCore Student FeedBack Report",
      "Student feedback report filters and results for EduCore academic module.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/academic/feedback-report">
      <StudentFeedbackReportPage />
    </EduCoreAppShell>
  );
}
