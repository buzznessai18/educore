import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { CourseSettingsPage } from "@/modules/admin-portal/components/course-settings-page";

export const Route = createFileRoute("/settings/course")({
  head: () =>
    educoreHead(
      "EduCore Course",
      "Maintain course masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/course">
      <CourseSettingsPage />
    </EduCoreAppShell>
  );
}
