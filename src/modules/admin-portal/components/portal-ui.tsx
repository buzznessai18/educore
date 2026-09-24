import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const portalTone = {
  green: "portal-pill portal-btn-success",
  "light-green": "portal-pill bg-success/85 hover:bg-success/75",
  blue: "portal-pill portal-btn-info",
  red: "portal-pill portal-btn-danger",
} as const;

export function PortalPage({
  children,
  className,
  maxWidth = "1400",
}: {
  children: ReactNode;
  className?: string;
  maxWidth?: "1200" | "1400";
}) {
  return (
    <div
      className={cn(
        "relative mx-auto space-y-4 pb-10",
        maxWidth === "1200" ? "max-w-[1200px]" : "max-w-[1400px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PortalToolbar({
  breadcrumb,
  actions,
  className,
}: {
  breadcrumb?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3", className)}>
      {breadcrumb ? <div className="portal-breadcrumb">{breadcrumb}</div> : <span />}
      {actions}
    </div>
  );
}

export function PortalBreadcrumb({ items }: { items: string[] }) {
  return (
    <p className="portal-breadcrumb">
      {items.map((item, index) => (
        <span key={`${item}-${index}`}>
          {index > 0 ? <span className="mx-1 text-muted-foreground/60">&gt;</span> : null}
          {item}
        </span>
      ))}
    </p>
  );
}

export function PortalPanel({
  title,
  description,
  children,
  className,
  actions,
}: {
  title?: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <section className={cn("portal-panel", className)}>
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            {title ? <h2 className="portal-panel-title">{title}</h2> : null}
            {description}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function PortalSection({
  title,
  description,
  children,
  className,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <Card className={cn("rounded-xl border-border shadow-enterprise-sm", className)}>
      <CardHeader className="grid gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-base tracking-normal">{title}</CardTitle>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {actions}
      </CardHeader>
      <CardContent className="space-y-4 p-5 pt-0">{children}</CardContent>
    </Card>
  );
}

export function FieldGrid({
  children,
  cols = 3,
}: {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
}) {
  const colClass =
    cols === 1
      ? "md:grid-cols-1"
      : cols === 2
        ? "md:grid-cols-2"
        : cols === 4
          ? "md:grid-cols-2 xl:grid-cols-4"
          : "md:grid-cols-2 xl:grid-cols-3";

  return <div className={cn("grid gap-4", colClass)}>{children}</div>;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
