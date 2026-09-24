import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { StudentAttendancePage } from "@/modules/admin-portal/components/student-attendance-page";

export const Route = createFileRoute("/academic/attendance")({
  head: () =>
    educoreHead(
      "EduCore Student Attendance",
      "Student attendance report with filters, export, and punch time details.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/academic/attendance">
      <StudentAttendancePage />
    </EduCoreAppShell>
  );
}
