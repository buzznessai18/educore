import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  EyeOff,
  Filter,
  GraduationCap,
  Loader2,
  LogOut,
  Menu,
  Moon,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
  X,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  attendanceData,
  dashboardKpis,
  EduRoutePath,
  enrollmentData,
  feeCollectionData,
  flatNavigation,
  getNavigationItem,
  navigationSections,
  pageConfigs,
  pendingApprovals,
  recentActivities,
  SummaryMetric,
  upcomingEvents,
  type DataRow,
  type PageConfig,
} from "@/lib/educore-data";
import { cn } from "@/lib/utils";

const fallbackRoute: EduRoutePath = "/dashboard";

const toneStyles: Record<SummaryMetric["tone"], string> = {
  primary: "bg-primary-soft text-primary border-primary-soft",
  success: "bg-success-soft text-success border-success-soft",
  warning: "bg-warning-soft text-warning border-warning-soft",
  danger: "bg-danger-soft text-danger border-danger-soft",
  info: "bg-info-soft text-info border-info-soft",
  neutral: "bg-muted text-muted-foreground border-border",
};

const statusToneMap: Record<string, SummaryMetric["tone"]> = {
  Active: "success",
  Present: "success",
  Published: "success",
  Ready: "success",
  Approved: "success",
  Settled: "success",
  Paid: "success",
  Scheduled: "primary",
  Done: "success",
  Open: "info",
  Warm: "info",
  Review: "warning",
  "In Review": "warning",
  Pending: "warning",
  Draft: "neutral",
  Watchlist: "warning",
  Delayed: "warning",
  Overdue: "danger",
  Absent: "danger",
  Late: "warning",
  "Low Stock": "warning",
  Reconcile: "warning",
  Planning: "info",
  "On Leave": "warning",
  "On Track": "success",
  Documents: "info",
  Interview: "primary",
};

export function EduCoreLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    window.setTimeout(() => {
      toast.success("Signed in to EduCore workspace");
      window.location.assign("/dashboard");
    }, 650);
  };

  return (
    <main className="min-h-screen bg-login-surface text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_560px]">
        <section className="hidden overflow-hidden border-r border-border bg-sidebar lg:block">
          <div className="flex h-full flex-col justify-between p-10">
            <BrandMark expanded />
            <div className="max-w-xl space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-soft bg-primary-soft px-3 py-1 text-sm font-medium text-primary">
                <Sparkles className="size-4" />
                Enterprise school operations
              </div>
              <div className="space-y-5">
                <h1 className="max-w-2xl text-5xl font-semibold leading-tight tracking-normal text-foreground">
                  A premium ERP foundation for modern education teams.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                  Unify academics, admissions, finance, learning, operations, HR, and reports in one calm command center.
                </p>
              </div>
              <div className="grid max-w-xl grid-cols-3 gap-4">
                {[
                  ["2,450", "Students"],
                  ["68", "Teachers"],
                  ["94.9%", "Attendance"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg border border-border bg-card p-4 shadow-enterprise-sm">
                    <div className="text-2xl font-semibold text-foreground">{value}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-5 shadow-enterprise-sm">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-md bg-success-soft text-success">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Phase 1 frontend only</p>
                  <p className="text-sm text-muted-foreground">Mock data, static sign-in, and complete navigation structure.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <BrandMark expanded />
            </div>
            <Card className="rounded-lg border-border bg-card shadow-enterprise-lg">
              <CardHeader className="space-y-2 p-7 pb-3">
                <div className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <GraduationCap className="size-6" />
                </div>
                <h1 className="text-2xl font-semibold tracking-normal text-foreground">Sign in to EduCore</h1>
                <p className="text-sm leading-6 text-muted-foreground">
                  Access the school management workspace with demo credentials.
                </p>
              </CardHeader>
              <CardContent className="p-7 pt-3">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="email">Email</label>
                    <Input id="email" type="email" defaultValue="admin@educore.school" placeholder="admin@educore.school" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-sm font-medium text-foreground" htmlFor="password">Password</label>
                      <button type="button" className="text-sm font-medium text-primary hover:text-primary-hover">
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        defaultValue="educore-demo"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setShowPassword((current) => !current)}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <label className="flex items-center gap-2 text-sm text-muted-foreground" htmlFor="remember">
                      <Checkbox id="remember" checked={rememberMe} onCheckedChange={(value) => setRememberMe(value === true)} />
                      Remember me
                    </label>
                    <Badge variant="secondary" className="bg-info-soft text-info">Static demo</Badge>
                  </div>
                  <Button className="h-11 w-full" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                    {isLoading ? "Signing in" : "Login"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

export function EduCoreRoutePage({ path }: { path: EduRoutePath }) {
  const navItem = getNavigationItem(path) ?? getNavigationItem(fallbackRoute);
  const pageConfig = navItem?.pageKey === "dashboard" ? undefined : pageConfigs[navItem?.pageKey ?? "students"];

  return (
    <EduCoreShell currentPath={path}>
      {navItem?.pageKey === "dashboard" ? <DashboardPage /> : <ModulePage config={pageConfig} />}
    </EduCoreShell>
  );
}

function EduCoreShell({ currentPath, children }: { currentPath: EduRoutePath; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const activeItem = getNavigationItem(currentPath);
  const breadcrumbs = activeItem ? [activeItem.section, activeItem.title] : ["Workspace", "Dashboard"];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    return () => document.documentElement.classList.remove("dark");
  }, [isDark]);

  return (
    <div className="min-h-screen bg-app text-foreground">
      <div className="flex min-h-screen w-full">
        <aside className={cn("hidden border-r border-sidebar-border bg-sidebar transition-all duration-200 lg:block", collapsed ? "w-20" : "w-72")}>
          <SidebarContent currentPath={currentPath} collapsed={collapsed} onNavigate={() => undefined} />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border bg-header/95 backdrop-blur">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:px-6">
              <div className="flex items-center gap-2">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation">
                      <Menu className="size-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0">
                    <SidebarContent currentPath={currentPath} collapsed={false} onNavigate={() => setMobileOpen(false)} />
                  </SheetContent>
                </Sheet>
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden lg:inline-flex"
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  onClick={() => setCollapsed((current) => !current)}
                >
                  {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
                </Button>
              </div>
              <div className="min-w-0">
                <Breadcrumbs items={breadcrumbs} />
                <h1 className="truncate text-xl font-semibold tracking-normal text-foreground sm:text-2xl">{breadcrumbs[1]}</h1>
              </div>
              <div className="flex min-w-0 items-center justify-end gap-2">
                <GlobalSearch />
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={isDark ? "Use light theme" : "Use dark theme"}
                  onClick={() => setIsDark((current) => !current)}
                >
                  {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </Button>
                <NotificationsMenu />
                <ProfileMenu />
              </div>
            </div>
          </header>
          <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({ currentPath, collapsed, onNavigate }: { currentPath: EduRoutePath; collapsed: boolean; onNavigate: () => void }) {
  return (
    <div className="flex h-screen min-h-0 flex-col">
      <div className="border-b border-sidebar-border p-4">
        <BrandMark expanded={!collapsed} />
      </div>
      <ScrollArea className="min-h-0 flex-1 px-3 py-4">
        <nav className="space-y-5">
          {navigationSections.map((section) => (
            <div key={section.label} className="space-y-1">
              {!collapsed && <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">{section.label}</p>}
              {section.items.map((item) => {
                const isActive = item.path === currentPath;
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={onNavigate}
                    className={cn(
                      "group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-enterprise-sm"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      collapsed && "grid-cols-1 justify-items-center px-2",
                    )}
                    aria-current={isActive ? "page" : undefined}
                    title={collapsed ? item.title : undefined}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.title}</span>}
                    {!collapsed && section.items.length > 1 && <ChevronRight className="size-3 text-current opacity-40" />}
                  </a>
                );
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}

function BrandMark({ expanded }: { expanded: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-enterprise-sm">
        <GraduationCap className="size-6" />
      </div>
      {expanded && (
        <div className="min-w-0">
          <div className="truncate text-base font-semibold tracking-normal text-foreground">EduCore</div>
          <div className="truncate text-xs font-medium text-muted-foreground">Management Portal v2.4</div>
        </div>
      )}
    </div>
  );
}

function Breadcrumbs({ items }: { items: string[] }) {
  return (
    <div className="mb-1 flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
      <span className="truncate">EduCore</span>
      {items.map((item) => (
        <span className="flex min-w-0 items-center gap-1" key={item}>
          <ChevronRight className="size-3 shrink-0" />
          <span className="truncate">{item}</span>
        </span>
      ))}
    </div>
  );
}

function GlobalSearch() {
  return (
    <div className="relative hidden w-full max-w-sm md:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className="h-10 rounded-lg bg-card pl-9 shadow-none" placeholder="Search students, staff, records..." />
    </div>
  );
}

function NotificationsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open notifications" className="relative">
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-danger" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {pendingApprovals.map((approval) => (
          <DropdownMenuItem key={approval.title} className="items-start">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{approval.title}</p>
              <p className="text-xs text-muted-foreground">{approval.detail}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 gap-2 px-2" aria-label="Open profile menu">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary-soft text-primary">MS</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium text-foreground sm:inline">Maya Singh</span>
          <ChevronDown className="hidden size-4 text-muted-foreground sm:inline" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Principal Admin</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><User className="size-4" /> Profile</DropdownMenuItem>
        <DropdownMenuItem><Settings className="size-4" /> Preferences</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.location.assign("/")}><LogOut className="size-4" /> Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {dashboardKpis.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)]">
        <Card className="rounded-lg border-border shadow-enterprise-sm">
          <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5">
            <div className="min-w-0">
              <CardTitle className="truncate text-base">Student Enrollment</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Monthly campus growth across active academic year.</p>
            </div>
            <Badge variant="outline" className="border-success-soft bg-success-soft text-success">+7.4%</Badge>
          </CardHeader>
          <CardContent className="h-80 p-5 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentData} margin={{ left: -18, right: 8, top: 12, bottom: 0 }}>
                <defs>
                  <linearGradient id="enrollmentFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.26} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <Tooltip content={<ChartTooltip suffix=" students" />} />
                <Area type="monotone" dataKey="students" stroke="var(--color-primary)" strokeWidth={3} fill="url(#enrollmentFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="rounded-lg border-border shadow-enterprise-sm">
          <CardHeader className="p-5">
            <CardTitle className="text-base">Pending Approvals</CardTitle>
            <p className="text-sm text-muted-foreground">Operational items waiting on admin action.</p>
          </CardHeader>
          <CardContent className="space-y-3 p-5 pt-0">
            {pendingApprovals.map((approval) => (
              <div key={approval.title} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
                <div className={cn("grid size-9 place-items-center rounded-md border", toneStyles[approval.tone as SummaryMetric["tone"]])}>
                  <Bell className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{approval.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{approval.detail}</p>
                </div>
                <Button variant="outline" size="sm">{approval.action}</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="rounded-lg border-border shadow-enterprise-sm">
          <CardHeader className="p-5">
            <CardTitle className="text-base">Attendance by Class</CardTitle>
            <p className="text-sm text-muted-foreground">Today’s marked attendance percentage.</p>
          </CardHeader>
          <CardContent className="h-72 p-5 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ left: -18, right: 8, top: 12, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="className" axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} domain={[75, 100]} />
                <Tooltip content={<ChartTooltip suffix="%" />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="var(--color-info)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="rounded-lg border-border shadow-enterprise-sm">
          <CardHeader className="p-5">
            <CardTitle className="text-base">Fee Collection</CardTitle>
            <p className="text-sm text-muted-foreground">Term-wise receivables snapshot.</p>
          </CardHeader>
          <CardContent className="grid gap-4 p-5 pt-0 md:grid-cols-[220px_minmax(0,1fr)]">
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={feeCollectionData} dataKey="value" nameKey="label" innerRadius={54} outerRadius={86} paddingAngle={4}>
                    {feeCollectionData.map((entry, index) => (
                      <Cell key={entry.label} fill={["var(--color-success)", "var(--color-warning)", "var(--color-danger)"][index] ?? "var(--color-primary)"} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip suffix="L" prefix="₹" />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 self-center">
              {feeCollectionData.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{item.label}</span>
                    <span className="text-muted-foreground">₹{item.value}L</span>
                  </div>
                  <Progress value={item.value} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <RecentActivityTable />
        <Card className="rounded-lg border-border shadow-enterprise-sm">
          <CardHeader className="p-5">
            <CardTitle className="text-base">Upcoming Events</CardTitle>
            <p className="text-sm text-muted-foreground">Events and academic dates in the next two weeks.</p>
          </CardHeader>
          <CardContent className="space-y-3 p-5 pt-0">
            {upcomingEvents.map((event) => (
              <div key={event.title} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn("border", toneStyles[event.tone as SummaryMetric["tone"]])}>{event.tone}</Badge>
                  <p className="font-medium text-foreground">{event.title}</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{event.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ModulePage({ config }: { config: PageConfig | undefined }) {
  const page = config ?? pageConfigs["students"];
  if (!page) {
    return null;
  }

  const defaultTab = page.tabs[0] ?? "Overview";
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(page.filters[0] ?? "All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return page.rows;
    return page.rows.filter((row) => Object.values(row).some((value) => value.toLowerCase().includes(normalizedQuery)));
  }, [page.rows, query]);

  const handlePrimaryAction = () => {
    setIsDialogOpen(false);
    toast.success(`${page.primaryAction} is ready for Phase 2 wiring`);
  };

  const handleFilter = (value: string) => {
    setActiveFilter(value);
    setShowLoading(true);
    window.setTimeout(() => setShowLoading(false), 350);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {page.stats.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </section>
      <Card className="rounded-lg border-border shadow-enterprise-sm">
        <CardHeader className="grid gap-4 p-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary-soft bg-primary-soft text-primary">{page.group}</Badge>
              <Badge variant="outline">Mock data</Badge>
            </div>
            <CardTitle className="text-2xl tracking-normal">{page.title}</CardTitle>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{page.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {page.secondaryActions.map((action) => (
              <Button key={action} variant="outline" size="sm" onClick={() => toast.info(`${action} selected`)}>
                {action.includes("Export") ? <Download className="size-4" /> : <MoreHorizontal className="size-4" />}
                {action}
              </Button>
            ))}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="size-4" />{page.primaryAction}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{page.primaryAction}</DialogTitle>
                  <DialogDescription>
                    This static Phase 1 action shows the intended workflow entry point without saving data.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <Input placeholder={`${page.title} name or reference`} />
                  <Select defaultValue="draft">
                    <SelectTrigger><SelectValue placeholder="Choose status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="review">Needs review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handlePrimaryAction}>Save mock entry</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-5 pt-0">
          <Tabs defaultValue={defaultTab}>
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
              <TabsList className="w-full justify-start overflow-x-auto rounded-md bg-muted p-1 xl:w-auto">
                {page.tabs.map((tab) => <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>)}
              </TabsList>
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_180px_auto]">
                <div className="relative min-w-0">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder={page.searchPlaceholder} />
                </div>
                <Select value={activeFilter} onValueChange={handleFilter}>
                  <SelectTrigger><SelectValue placeholder="Filter" /></SelectTrigger>
                  <SelectContent>
                    {page.filters.map((filter) => <SelectItem key={filter} value={filter}>{filter}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline"><Filter className="size-4" />More filters</Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">Refine list</p>
                    {page.filters.slice(1).map((filter) => (
                      <label key={filter} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Checkbox />
                        {filter}
                      </label>
                    ))}
                    <Button className="w-full" size="sm" onClick={() => toast.info("Filters applied")}>Apply filters</Button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {page.tabs.map((tab, index) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                {showLoading ? <LoadingRows /> : <DataTable columns={page.columns} rows={index === 3 ? [] : filteredRows} emptyState={page.emptyState} />}
              </TabsContent>
            ))}
          </Tabs>
          <div className="grid gap-3 border-t border-border pt-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <p className="text-sm text-muted-foreground">Showing {filteredRows.length} of {page.rows.length} records in {activeFilter}.</p>
            <Pagination className="justify-end">
              <PaginationContent>
                <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                <PaginationItem><PaginationEllipsis /></PaginationItem>
                <PaginationItem><PaginationNext href="#" /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ metric }: { metric: SummaryMetric }) {
  return (
    <Card className="rounded-lg border-border shadow-enterprise-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-muted-foreground">{metric.label}</p>
            <p className="mt-2 truncate text-2xl font-semibold tracking-normal text-foreground">{metric.value}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{metric.helper}</p>
          </div>
          <div className={cn("grid size-10 place-items-center rounded-lg border", toneStyles[metric.tone])}>
            <ChartColumnIcon tone={metric.tone} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartColumnIcon({ tone }: { tone: SummaryMetric["tone"] }) {
  const Icon = tone === "success" ? CheckCircle2 : tone === "danger" ? Bell : tone === "warning" ? CalendarClockIcon : GraduationCap;
  return <Icon className="size-5" />;
}

function CalendarClockIcon(props: React.ComponentProps<typeof Bell>) {
  return <Bell {...props} />;
}

function DataTable({ columns, rows, emptyState }: { columns: PageConfig["columns"]; rows: DataRow[]; emptyState: PageConfig["emptyState"] }) {
  if (rows.length === 0) {
    return (
      <div className="grid min-h-80 place-items-center rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
        <div className="max-w-sm">
          <div className="mx-auto grid size-12 place-items-center rounded-lg bg-primary-soft text-primary">
            <Search className="size-5" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">{emptyState.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{emptyState.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse bg-card text-sm">
          <thead className="bg-table-header text-xs uppercase text-muted-foreground">
            <tr>
              {columns.map((column) => <th key={column.key} className="px-4 py-3 text-left font-semibold">{column.label}</th>)}
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${rowIndex}-${Object.values(row).join("-")}`} className="border-t border-border hover:bg-muted/40">
                {columns.map((column) => {
                  const value = row[column.key] ?? "—";
                  const isStatus = column.key.toLowerCase().includes("status");
                  return (
                    <td key={column.key} className="px-4 py-3 text-foreground">
                      {isStatus ? <StatusBadge status={value} /> : <span className="whitespace-nowrap">{value}</span>}
                    </td>
                  );
                })}
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Open row actions"><MoreHorizontal className="size-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Edit record</DropdownMenuItem>
                      <DropdownMenuItem>Export row</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone = statusToneMap[status] ?? "neutral";
  return <Badge variant="outline" className={cn("border", toneStyles[tone])}>{status}</Badge>;
}

function LoadingRows() {
  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      {["one", "two", "three", "four"].map((item) => <Skeleton key={item} className="h-12 w-full" />)}
    </div>
  );
}

function RecentActivityTable() {
  return (
    <Card className="rounded-lg border-border shadow-enterprise-sm">
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5">
        <div className="min-w-0">
          <CardTitle className="truncate text-base">Recent Activities</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Latest records touched by admin teams.</p>
        </div>
        <Button variant="outline" size="sm">View all</Button>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse bg-card text-sm">
              <thead className="bg-table-header text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Activity</th>
                  <th className="px-4 py-3 text-left font-semibold">By</th>
                  <th className="px-4 py-3 text-left font-semibold">Time</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity) => (
                  <tr key={activity.title} className="border-t border-border">
                    <td className="px-4 py-3"><Badge variant="secondary">{activity.type}</Badge></td>
                    <td className="px-4 py-3 font-medium text-foreground">{activity.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{activity.owner}</td>
                    <td className="px-4 py-3 text-muted-foreground">{activity.time}</td>
                    <td className="px-4 py-3"><StatusBadge status={activity.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number | string; name?: string }>;
  label?: string;
  suffix?: string;
  prefix?: string;
};

function ChartTooltip({ active, payload, label, suffix = "", prefix = "" }: TooltipProps) {
  const firstPayload = payload?.[0];
  if (!active || !firstPayload) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-enterprise-sm">
      <p className="font-medium">{label ?? firstPayload.name}</p>
      <p className="text-muted-foreground">{prefix}{firstPayload.value}{suffix}</p>
    </div>
  );
}

export { flatNavigation };
