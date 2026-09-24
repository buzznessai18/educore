import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { StudentTcPage } from "@/modules/admin-portal/components/student-tc-page";

export const Route = createFileRoute("/academic/student-tc")({
  head: () =>
    educoreHead(
      "EduCore Transfer Certificate List",
      "Transfer certificate list with search, export, and print for EduCore academic module.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/academic/student-tc">
      <StudentTcPage />
    </EduCoreAppShell>
  );
}
