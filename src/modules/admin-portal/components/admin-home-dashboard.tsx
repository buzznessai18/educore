import { type ReactNode, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bug,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Code2,
  FileEdit,
  FileText,
  IndianRupee,
  List,
  Pencil,
  Tag,
  User,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminDashboard } from "@/modules/admin-portal/hooks";
import { cn } from "@/lib/utils";

const incomeChartFallback = [
  { month: "Jan", income: 0 },
  { month: "Feb", income: 0 },
  { month: "Mar", income: 0 },
  { month: "Apr", income: 80000 },
  { month: "May", income: 320000 },
  { month: "Jun", income: 1350000 },
  { month: "Jul", income: 150000 },
  { month: "Aug", income: 20000 },
  { month: "Sep", income: 0 },
  { month: "Oct", income: 0 },
  { month: "Nov", income: 0 },
  { month: "Dec", income: 0 },
];

const expenseChartFallback = [
  { month: "Jan", expenses: 0 },
  { month: "Feb", expenses: 0 },
  { month: "Mar", expenses: 0 },
  { month: "Apr", expenses: 45000 },
  { month: "May", expenses: 120000 },
  { month: "Jun", expenses: 280000 },
  { month: "Jul", expenses: 95000 },
  { month: "Aug", expenses: 40000 },
  { month: "Sep", expenses: 0 },
  { month: "Oct", expenses: 0 },
  { month: "Nov", expenses: 0 },
  { month: "Dec", expenses: 0 },
];

const alertTasks = [
  "Pending Vendor Payments",
  "Followup tasks alerts",
  "Payslips to be Generated!!!",
  "Pending bill payments",
];

const quickLinks = [
  { label: "Generate Fees", href: "/finance/fees" },
  { label: "Mark Attendance", href: "/academic/attendance" },
  { label: "Admission List", href: "/admissions/applied" },
  { label: "Student Registration", href: "/admissions/registration" },
  { label: "Staff Registration", href: "/hr/staff" },
  { label: "Allocate Class", href: "/academic/classes" },
  { label: "Staff Activity", href: "/hr/staff" },
  { label: "SMS Broadcast", href: "/administration/communication" },
];

const reportLinks = [
  { label: "Academic Performance", href: "/reports/academic" },
  { label: "Lesson Update Report", href: "/learning/lessons" },
  { label: "Assignment Report", href: "/learning/assignments" },
  { label: "Notifications", href: "/administration/communication" },
];

function formatAmount(value: number) {
  return value.toLocaleString("en-IN");
}

export function AdminHomeDashboard() {
  const { data } = useAdminDashboard();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2026, 8, 24));
  const [month, setMonth] = useState(new Date(2026, 8, 1));
  const [expenseYear, setExpenseYear] = useState("2026");
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  const metrics = data?.metrics;
  const studentCount = metrics?.totalStudents ?? 307;
  const feeReceivable = metrics?.totalFeeReceivable ?? 4021000;
  const feeReceived = metrics?.totalFeeReceived ?? 1415000;
  const balanceFee = metrics?.totalBalanceFee ?? 2599000;
  const billsPayable = metrics?.totalBillsPayable ?? 0;
  const billsPaid = metrics?.totalBillsPaid ?? 0;
  const pendingBills = metrics?.pendingBills ?? 0;
  const bankBalance = metrics?.bankBalance ?? 0;

  const incomeData = useMemo(() => {
    if (data?.incomeVsExpenses?.length) {
      return data.incomeVsExpenses.map((row) => ({ month: row.month, income: row.income }));
    }
    return incomeChartFallback;
  }, [data]);

  const expenseData = useMemo(() => {
    if (data?.incomeVsExpenses?.length) {
      return data.incomeVsExpenses.map((row) => ({ month: row.month, expenses: row.expenses }));
    }
    return expenseChartFallback;
  }, [data]);

  const year = Number(expenseYear) || 2026;

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 pb-8">
      {/* KPI cards with overlapping icons */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <OverlapStatCard
          color="bg-warning"
          icon={User}
          label="No of Students"
          value={String(studentCount)}
          footer="Total Strength"
        />
        <OverlapStatCard
          color="bg-info"
          icon={IndianRupee}
          label="Total Fee Receivable"
          value={formatAmount(feeReceivable)}
          footer={
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              For the financial year
            </span>
          }
        />
        <OverlapStatCard
          color="bg-success"
          icon={IndianRupee}
          label="Total Received Fee"
          value={formatAmount(feeReceived)}
          footer={
            <span className="inline-flex items-center gap-1.5">
              <Tag className="size-3.5" />
              Fees Received
            </span>
          }
        />
        <OverlapStatCard
          color="bg-danger"
          icon={IndianRupee}
          label="Balance Fee"
          value={formatAmount(balanceFee)}
          footer={
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" />
              Just Updated
            </span>
          }
        />
      </section>

      {/* Bill / bank status tiles */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SplitStatusTile
          color="bg-warning"
          icon={FileText}
          value={String(billsPayable)}
          label={`Total Bills Payable(${billsPayable})`}
        />
        <SplitStatusTile
          color="bg-info"
          icon={Check}
          value={String(billsPaid)}
          label={`Total Bills Paid(${billsPaid})`}
        />
        <SplitStatusTile
          color="bg-chart-5"
          icon={List}
          value={String(pendingBills)}
          label={`Pending Bills (${pendingBills})`}
        />
        <SplitStatusTile
          color="bg-primary"
          icon={Building2}
          value={String(bankBalance)}
          label="Bank Balance"
        />
      </section>

      {/* Income / Expense charts */}
      <section className="grid gap-5 xl:grid-cols-2">
        <Card className="rounded-xl border-border shadow-enterprise-sm">
          <CardHeader className="border-b border-border px-5 py-3">
            <CardTitle className="text-base font-semibold text-foreground">Income of the Year</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="mb-2 text-center text-sm font-medium text-foreground">Income of {year}</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    label={{ value: "Months", position: "insideBottom", offset: -2, fontSize: 12 }}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    label={{ value: "Income", angle: -90, position: "insideLeft", fontSize: 12 }}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value: number) => value.toLocaleString("en-IN")}
                  />
                  <Tooltip formatter={(value: number) => `₹${formatAmount(value)}`} />
                  <Bar dataKey="income" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border shadow-enterprise-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border px-5 py-3">
            <CardTitle className="text-base font-semibold text-foreground">
              Expense of the Year ({year})
            </CardTitle>
            <Input
              value={expenseYear}
              onChange={(event) => setExpenseYear(event.target.value)}
              className="h-8 w-20"
              aria-label="Expense year"
            />
          </CardHeader>
          <CardContent className="p-4">
            <p className="mb-2 text-center text-sm font-medium text-foreground">
              Expense Over a Year ({year})
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    label={{ value: "Month", position: "insideBottom", offset: -2, fontSize: 12 }}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    label={{ value: "Expense (₹)", angle: -90, position: "insideLeft", fontSize: 12 }}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value: number) => value.toLocaleString("en-IN")}
                  />
                  <Tooltip formatter={(value: number) => `₹${formatAmount(value)}`} />
                  <Bar dataKey="expenses" fill="var(--chart-3)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SRM / Attendance / Notice Board */}
      <section className="grid gap-4 lg:grid-cols-3">
        <ModuleSummaryCard
          color="bg-success"
          icon={FileEdit}
          title="SRM"
          lines={[
            `Applications Received ${347}`,
            `Admissions Closed ${studentCount}`,
            `Applications Pending ${0}`,
          ]}
        />
        <ModuleSummaryCard
          color="bg-info"
          icon={FileText}
          title="ATTENDANCE"
          lines={[
            `Student Attendance [ ${studentCount} ]`,
            `Staff Daily Attendance [ 16 ]`,
            "Staff Monthly Attendance",
          ]}
        />
        <ModuleSummaryCard
          color="bg-info"
          icon={List}
          title="NOTICE BOARD"
          lines={["Pending Task", "Upcoming Events", "Time Table"]}
        />
      </section>

      {/* Tasks + Quick links + Approvals */}
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_220px_240px]">
        <Card className="overflow-hidden rounded-xl border-border shadow-enterprise-sm">
          <Tabs defaultValue="alerts">
            <div className="bg-primary px-3 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-white">Tasks:</span>
                <TabsList className="h-auto bg-transparent p-0">
                  <TabsTrigger
                    value="alerts"
                    className="gap-1.5 rounded-sm px-3 py-1.5 text-xs text-white data-[state=active]:bg-card/20 data-[state=active]:shadow-none"
                  >
                    <Bug className="size-3.5" />
                    ALERTS
                  </TabsTrigger>
                  <TabsTrigger
                    value="approvals"
                    className="gap-1.5 rounded-sm px-3 py-1.5 text-xs text-white data-[state=active]:bg-card/20 data-[state=active]:shadow-none"
                  >
                    <Code2 className="size-3.5" />
                    APPROVALS
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="gap-1.5 rounded-sm px-3 py-1.5 text-xs text-white data-[state=active]:bg-card/20 data-[state=active]:shadow-none"
                  >
                    <Cloud className="size-3.5" />
                    NOTIFICATIONS
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            <TabsContent value="alerts" className="m-0">
              <TaskList
                items={alertTasks}
                checked={checkedTasks}
                onToggle={(label, value) =>
                  setCheckedTasks((current) => ({ ...current, [label]: value }))
                }
              />
            </TabsContent>
            <TabsContent value="approvals" className="m-0">
              <EmptyPanel message="No pending approvals right now." />
            </TabsContent>
            <TabsContent value="notifications" className="m-0">
              <EmptyPanel message="No new notifications." />
            </TabsContent>
          </Tabs>
        </Card>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Quick Links</p>
          {quickLinks.map((link) => (
            <PillLink key={link.label} href={link.href} label={link.label} />
          ))}
        </div>

        <div className="space-y-3">
          {reportLinks.map((link) => (
            <PillLink key={link.label} href={link.href} label={link.label} />
          ))}
          <ApprovalCard
            tone="green"
            title="PENDING APPROVALS"
            date="24/Sep"
            detail="Leaves to be Approved (0)"
          />
          <ApprovalCard
            tone="green"
            title="PENDING APPROVALS"
            date="24/Sep"
            detail="Indents to be Approved"
          />
          <ApprovalCard tone="red" title="ALERTS" date="24/Sep" detail="Salaries to be Generated" />
        </div>
      </section>

      {/* Fee collection */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <FeeCollectionCard label="Daily Fee Collection" value={0} barClass="bg-chart-5" progress={12} />
        <FeeCollectionCard label="Weekly Fee Collection" value={0} barClass="bg-info" progress={18} />
        <FeeCollectionCard label="Monthly Fee Collection" value={0} barClass="bg-danger" progress={10} />
        <FeeCollectionCard
          label="Yearly Fee Collection"
          value={1999550}
          barClass="bg-foreground"
          progress={64}
        />
      </section>

      {/* Enquiry tiles */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <EnquiryTile color="bg-warning" icon={Pencil} label="Total Enquiries" href="/admissions/enquiries" />
        <EnquiryTile color="bg-chart-5" icon={Pencil} label="Responded Enquiries" href="/admissions/enquiries" />
        <EnquiryTile color="bg-info" icon={Users} label="Admissions Closed" href="/admissions/admitted" />
        <EnquiryTile color="bg-primary" icon={Pencil} label="Pending Enquiries" href="/admissions/enquiries" />
      </section>

      {/* Calendar + Events */}
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
        <DashboardMonthCalendar
          month={month}
          selectedDate={selectedDate}
          onMonthChange={setMonth}
          onSelectDate={setSelectedDate}
        />

        <Card className="rounded-xl border-border shadow-enterprise-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border px-5 py-3">
            <CardTitle className="text-base font-semibold">Event List</CardTitle>
            <Button
              size="sm"
              className="bg-success text-white hover:bg-success/90"
              onClick={() => toast.success("Add event workflow ready for Phase 2 wiring")}
            >
              Add New
            </Button>
          </CardHeader>
          <CardContent className="min-h-72 p-5">
            <p className="text-sm text-muted-foreground">
              No events for{" "}
              {selectedDate
                ? selectedDate.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "the selected date"}
              .
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function DashboardMonthCalendar({
  month,
  selectedDate,
  onMonthChange,
  onSelectDate,
}: {
  month: Date;
  selectedDate: Date | undefined;
  onMonthChange: (value: Date) => void;
  onSelectDate: (value: Date | undefined) => void;
}) {
  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const cells = useMemo(() => buildMonthGrid(month), [month]);

  const shiftMonth = (delta: number) => {
    onMonthChange(new Date(month.getFullYear(), month.getMonth() + delta, 1));
  };

  const shiftYear = (delta: number) => {
    onMonthChange(new Date(month.getFullYear() + delta, month.getMonth(), 1));
  };

  return (
    <Card className="rounded-xl border-border bg-card shadow-enterprise-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <CalendarNavButton label="Previous month" onClick={() => shiftMonth(-1)}>
              <ChevronLeft className="size-4" />
            </CalendarNavButton>
            <CalendarNavButton label="Next month" onClick={() => shiftMonth(1)}>
              <ChevronRight className="size-4" />
            </CalendarNavButton>
          </div>
          <p className="text-sm font-bold tracking-wide text-foreground/80 sm:text-[15px]">
            {month.toLocaleString("en-US", { month: "long", year: "numeric" }).toUpperCase()}
          </p>
          <div className="flex items-center gap-1">
            <CalendarNavButton label="Previous year" onClick={() => shiftYear(-1)}>
              <ChevronLeft className="size-4" />
            </CalendarNavButton>
            <CalendarNavButton label="Next year" onClick={() => shiftYear(1)}>
              <ChevronRight className="size-4" />
            </CalendarNavButton>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-7 border-b border-border bg-muted">
            {weekdays.map((day, index) => (
              <div
                key={day}
                className={cn(
                  "py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70",
                  index < 6 && "border-r border-border",
                )}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {cells.map((cell, index) => {
              const isSelected =
                selectedDate != null &&
                cell.date.getFullYear() === selectedDate.getFullYear() &&
                cell.date.getMonth() === selectedDate.getMonth() &&
                cell.date.getDate() === selectedDate.getDate();

              return (
                <button
                  key={cell.key}
                  type="button"
                  onClick={() => {
                    onSelectDate(cell.date);
                    if (
                      cell.date.getMonth() !== month.getMonth() ||
                      cell.date.getFullYear() !== month.getFullYear()
                    ) {
                      onMonthChange(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
                    }
                  }}
                  className={cn(
                    "relative h-17 border-b border-border bg-card p-2 text-left transition-colors hover:bg-muted/50 sm:h-19",
                    index % 7 !== 6 && "border-r border-border",
                    isSelected && "bg-info-soft hover:bg-info-soft",
                  )}
                  aria-label={cell.date.toDateString()}
                  aria-pressed={isSelected}
                >
                  <span
                    className={cn(
                      "text-sm font-normal leading-none text-foreground/80",
                      !cell.inCurrentMonth && "text-muted-foreground/70",
                      isSelected && "font-semibold text-success",
                    )}
                  >
                    {cell.date.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CalendarNavButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-sm border border-input bg-card text-foreground/80 transition hover:border-muted-foreground hover:bg-muted"
    >
      {children}
    </button>
  );
}

function buildMonthGrid(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstOfMonth = new Date(year, monthIndex, 1);
  const startOffset = firstOfMonth.getDay(); // Sunday = 0
  const gridStart = new Date(year, monthIndex, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date,
      inCurrentMonth: date.getMonth() === monthIndex,
    };
  });
}

function OverlapStatCard({
  color,
  icon: Icon,
  label,
  value,
  footer,
}: {
  color: string;
  icon: typeof User;
  label: string;
  value: string;
  footer: ReactNode;
}) {
  return (
    <Card className="relative mt-4 rounded-xl border-border pt-2 shadow-enterprise-sm">
      <div
        className={cn(
          "absolute -top-3 left-4 grid size-12 place-items-center rounded-md text-white shadow-md",
          color,
        )}
      >
        <Icon className="size-6" />
      </div>
      <CardContent className="space-y-1 px-5 pb-4 pt-8 text-right">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        <div className="border-t border-border pt-2 text-left text-xs text-muted-foreground">{footer}</div>
      </CardContent>
    </Card>
  );
}

function SplitStatusTile({
  color,
  icon: Icon,
  value,
  label,
}: {
  color: string;
  icon: typeof FileText;
  value: string;
  label: string;
}) {
  return (
    <div className={cn("flex min-h-[88px] overflow-hidden rounded-xl text-white shadow-enterprise-sm", color)}>
      <div className="grid w-20 shrink-0 place-items-center bg-black/10">
        <Icon className="size-8" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
        <p className="text-2xl font-semibold leading-none">{value}</p>
        <p className="mt-1 truncate text-sm font-medium opacity-95">{label}</p>
      </div>
    </div>
  );
}

function ModuleSummaryCard({
  color,
  icon: Icon,
  title,
  lines,
}: {
  color: string;
  icon: typeof FileText;
  title: string;
  lines: string[];
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl text-white shadow-enterprise-sm", color)}>
      <div className="flex items-center gap-3 border-b border-white/20 px-4 py-3">
        <Icon className="size-6" />
        <p className="text-lg font-bold tracking-wide">{title}</p>
      </div>
      <div className="space-y-2 px-4 py-3 text-sm font-medium">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function TaskList({
  items,
  checked,
  onToggle,
}: {
  items: string[];
  checked: Record<string, boolean>;
  onToggle: (label: string, value: boolean) => void;
}) {
  return (
    <ul className="divide-y divide-border bg-card">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3 px-4 py-3">
          <Checkbox
            checked={checked[item] === true}
            onCheckedChange={(value) => onToggle(item, value === true)}
            aria-label={item}
          />
          <span className="min-w-0 flex-1 text-sm text-foreground">{item}</span>
          <Button
            variant="outline"
            size="icon"
            className="size-8 border-info/40 text-info"
            onClick={() => toast.info(`Edit: ${item}`)}
            aria-label={`Edit ${item}`}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 border-danger/40 text-danger"
            onClick={() => toast.message(`Dismissed: ${item}`)}
            aria-label={`Delete ${item}`}
          >
            <X className="size-3.5" />
          </Button>
        </li>
      ))}
    </ul>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return <div className="px-4 py-8 text-sm text-muted-foreground">{message}</div>;
}

function PillLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="flex h-10 items-center justify-center rounded-full bg-info px-4 text-sm font-semibold text-white shadow-enterprise-sm transition hover:bg-info/90"
    >
      {label}
    </a>
  );
}

function ApprovalCard({
  tone,
  title,
  date,
  detail,
}: {
  tone: "green" | "red";
  title: string;
  date: string;
  detail: string;
}) {
  return (
    <div
      className={cn(
        "rounded-md p-3 text-white shadow-enterprise-sm",
        tone === "green" ? "bg-success" : "bg-danger",
      )}
    >
      <div className="flex items-start gap-2">
        <FileText className="mt-0.5 size-5 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-wide">{title}</p>
          <p className="mt-1 text-sm font-semibold">{date}</p>
          <p className="mt-0.5 text-xs opacity-95">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function FeeCollectionCard({
  label,
  value,
  barClass,
  progress,
}: {
  label: string;
  value: number;
  barClass: string;
  progress: number;
}) {
  return (
    <Card className="overflow-hidden rounded-xl border-border shadow-enterprise-sm">
      <CardContent className="space-y-2 p-5">
        <div className="flex items-start gap-3">
          <IndianRupee className="mt-1 size-8 text-success" />
          <div>
            <p className="text-2xl font-semibold text-foreground">{formatAmount(value)}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
      <div className="h-1.5 w-full bg-muted">
        <div className={cn("h-full", barClass)} style={{ width: `${progress}%` }} />
      </div>
    </Card>
  );
}

function EnquiryTile({
  color,
  icon: Icon,
  label,
  href,
}: {
  color: string;
  icon: typeof Pencil;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className={cn("flex min-h-[84px] overflow-hidden rounded-xl text-white shadow-enterprise-sm transition hover:opacity-95", color)}
    >
      <div className="grid w-20 shrink-0 place-items-center bg-black/15">
        <Icon className="size-7" />
      </div>
      <div className="flex flex-1 items-center px-4 text-base font-semibold">{label}</div>
    </a>
  );
}
