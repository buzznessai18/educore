import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/settings" || location.pathname === "/settings/") {
      throw redirect({ to: "/settings/academic" });
    }
  },
  component: SettingsLayout,
});

function SettingsLayout() {
  return <Outlet />;
}
