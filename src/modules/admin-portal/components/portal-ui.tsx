import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <Card className={cn("rounded-lg border-border shadow-enterprise-sm", className)}>
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
