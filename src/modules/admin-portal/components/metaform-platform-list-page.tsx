import {
  ActionPills,
  SETTINGS_MASTER_PILLS,
} from "@/modules/admin-portal/components/admission-action-pills";

export function MetaFormPlatformListPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-4 pb-10">
      <ActionPills items={SETTINGS_MASTER_PILLS} className="justify-start" />

      <section className="rounded-xl border border-border bg-card p-8 shadow-enterprise-sm">
        <h2 className="text-lg font-semibold text-foreground">MetaFormPlatform list</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          No data available. This page is reserved for MetaForm platform masters.
        </p>
      </section>
    </div>
  );
}
