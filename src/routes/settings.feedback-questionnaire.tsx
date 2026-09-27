import { createFileRoute } from "@tanstack/react-router";

import { EduCoreAppShell } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";
import { FeedbackQuestionnaireSettingsPage } from "@/modules/admin-portal/components/feedback-questionnaire-settings-page";

export const Route = createFileRoute("/settings/feedback-questionnaire")({
  head: () =>
    educoreHead(
      "EduCore FeedBack Questionairre",
      "Maintain feedback questionnaire masters in EduCore Settings.",
    ),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <EduCoreAppShell path="/settings/feedback-questionnaire">
      <FeedbackQuestionnaireSettingsPage />
    </EduCoreAppShell>
  );
}
