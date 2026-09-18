import { createFileRoute } from "@tanstack/react-router";

import { EduCoreRoutePage } from "@/components/educore/app-shell";
import { educoreHead } from "@/lib/educore-seo";

export const Route = createFileRoute("/administration/inventory")({
  head: () => educoreHead("EduCore Administration Inventory", "EduCore education ERP workspace with static Phase 1 screens for school operations."),
  component: RouteComponent,
});

function RouteComponent() {
  return <EduCoreRoutePage path="/administration/inventory" />;
}
