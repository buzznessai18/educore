import { createFileRoute } from "@tanstack/react-router";

import { EduCoreRoutePage } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";

export const Route = createFileRoute("/fms/fee-description-pending-report")({
  head: () => educoreHead("EduCore Fee Description Pending Report", "EduCore FMS module screen for Fee Description Pending Report."),
  component: RouteComponent,
});

function RouteComponent() {
  return <EduCoreRoutePage path="/fms/fee-description-pending-report" />;
}
