import { createFileRoute } from "@tanstack/react-router";

import { EduCoreRoutePage } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";

export const Route = createFileRoute("/academic/sms-report")({
  head: () => educoreHead("EduCore SMS Report", "EduCore academic module screen for SMS Report."),
  component: RouteComponent,
});

function RouteComponent() {
  return <EduCoreRoutePage path="/academic/sms-report" />;
}
