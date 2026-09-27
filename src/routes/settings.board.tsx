import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { BoardSettingsPage } from "@/modules/admin-portal/components/board-settings-page";

export const Route = createFileRoute("/settings/board")({
  head: () =>
    educoreHead(
      "EduCore Board",
      "Maintain university and board masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/board">
      <BoardSettingsPage />
    </EduCoreAppShell>
  );
}
