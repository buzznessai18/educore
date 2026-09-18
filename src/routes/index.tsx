import { createFileRoute } from "@tanstack/react-router";

import { EduCoreLoginPage } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";

export const Route = createFileRoute("/")({
  head: () =>
    educoreHead(
      "EduCore School ERP Login",
      "Sign in to the EduCore Phase 1 school ERP frontend demo with static education management screens.",
    ),
  component: EduCoreLoginPage,
});
