import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Banknote, CreditCard, Receipt, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDashboard } from "@/modules/admin-portal/hooks";
import { formatCurrency } from "@/modules/admin-portal/components/portal-ui";
import { cn } from "@/lib/utils";

export function AdminPortalDashboard() {
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="mx-auto max-w-7xl rounded-lg border-border">
        <CardContent className="p-8 text-sm text-muted-foreground">
          Unable to load admin portal overview. Try refreshing the page.
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      label: "Total Students",
      value: data.metrics.totalStudents.toLocaleString("en-IN"),
      helper: `AY ${data.academicYear}`,
      icon: Users,
    },
    {
      label: "Total Fee Receivable",
      value: formatCurrency(data.metrics.totalFeeReceivable),
      helper: "Outstanding + current",
      icon: Receipt,
    },
    {
      label: "Total Bills Payable",
      value: formatCurrency(data.metrics.totalBillsPayable),
      helper: "Vendor & ops payables",
      icon: CreditCard,
    },
    {
      label: "Total Bills Paid",
      value: formatCurrency(data.metrics.totalBillsPaid),
      helper: "Settled this year",
      icon: Banknote,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="border-primary-soft bg-primary-soft text-primary">
          Admin Portal
        </Badge>
        <Badge variant="outline">Academic Year {data.academicYear}</Badge>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="rounded-lg border-border shadow-enterprise-sm">
              <CardContent className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 p-5">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="mt-2 truncate text-2xl font-semibold tracking-normal text-foreground">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{metric.helper}</p>
                </div>
                <div className={cn("grid size-10 place-items-center rounded-md bg-primary-soft text-primary")}>
                  <Icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card className="rounded-lg border-border shadow-enterprise-sm">
        <CardHeader className="p-5">
          <CardTitle className="text-base">Income vs Expenses</CardTitle>
          <p className="text-sm text-muted-foreground">
            Yearly financial breakdown for campus operations and fee collections.
          </p>
        </CardHeader>
        <CardContent className="h-96 p-5 pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.incomeVsExpenses} margin={{ left: -8, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                tickFormatter={(value: number) => `${Math.round(value / 100000)}L`}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid var(--color-border)",
                  background: "var(--color-card)",
                }}
              />
              <Legend />
              <Bar dataKey="income" name="Income" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="var(--color-warning)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
