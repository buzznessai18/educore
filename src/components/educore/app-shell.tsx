import {
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
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
  EduRoutePath,
  flatNavigation,
  getNavigationItem,
  isSectionActive,
  pageConfigs,
  pendingApprovals,
  SummaryMetric,
  type DataRow,
  type NavSection,
  type PageConfig,
} from "@/lib/educore-data";
import {
  APP_ROLES,
  canAccessRoute,
  clearDemoSession,
  getDefaultRouteForRole,
  getDemoSession,
  getDemoUserByEmail,
  getDemoUserByRole,
  getNavigationForRole,
  getRoleLabel,
  saveDemoSession,
  type AppRole,
  type DemoSession,
} from "@/lib/roles";
import { AdminHomeDashboard } from "@/modules/admin-portal/components/admin-home-dashboard";
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
  const [selectedRole, setSelectedRole] = useState<AppRole>("admin");
  const [email, setEmail] = useState(getDemoUserByRole("admin").email);

  const handleRoleChange = (role: AppRole) => {
    setSelectedRole(role);
    setEmail(getDemoUserByRole(role).email);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const matchedUser = getDemoUserByEmail(email) ?? getDemoUserByRole(selectedRole);
    window.setTimeout(() => {
      saveDemoSession(matchedUser);
      toast.success(`Signed in as ${getRoleLabel(matchedUser.role)}`);
      window.location.assign(getDefaultRouteForRole(matchedUser.role));
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
                  Choose a demo role to preview workspace access for that persona.
                </p>
              </CardHeader>
              <CardContent className="p-7 pt-3">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="role">
                      Role
                    </label>
                    <Select value={selectedRole} onValueChange={(value) => handleRoleChange(value as AppRole)}>
                      <SelectTrigger id="role" className="h-11 w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {APP_ROLES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {getRoleLabel(role)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="email">Email</label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@educore.school"
                    />
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
  const session = useDemoSession();
  const role = session?.role ?? "admin";

  useEffect(() => {
    if (!session) return;
    if (!canAccessRoute(session.role, path)) {
      window.location.replace(getDefaultRouteForRole(session.role));
    }
  }, [path, session]);

  const navItem = getNavigationItem(path) ?? getNavigationItem(fallbackRoute);
  const pageConfig = navItem?.pageKey === "dashboard" ? undefined : pageConfigs[navItem?.pageKey ?? "students"];

  return (
    <EduCoreShell currentPath={path} session={session} role={role}>
      {navItem?.pageKey === "dashboard" ? <DashboardPage /> : <ModulePage config={pageConfig} />}
    </EduCoreShell>
  );
}

/** Shell wrapper for custom module pages (Admin Portal, etc.). */
export function EduCoreAppShell({
  path,
  children,
}: {
  path: EduRoutePath;
  children: ReactNode;
}) {
  const session = useDemoSession();
  const role = session?.role ?? "admin";

  useEffect(() => {
    if (!session) return;
    if (!canAccessRoute(session.role, path)) {
      window.location.replace(getDefaultRouteForRole(session.role));
    }
  }, [path, session]);

  return (
    <EduCoreShell currentPath={path} session={session} role={role}>
      {children}
    </EduCoreShell>
  );
}

function useDemoSession(): DemoSession | null {
  const [session, setSession] = useState<DemoSession | null>(null);

  useEffect(() => {
    const current = getDemoSession();
    if (!current) {
      const fallback = getDemoUserByRole("admin");
      saveDemoSession(fallback);
      setSession(fallback);
      return;
    }
    setSession(current);
  }, []);

  return session;
}

function EduCoreShell({
  currentPath,
  children,
  session,
  role,
}: {
  currentPath: EduRoutePath;
  children: ReactNode;
  session: DemoSession | null;
  role: AppRole;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [locationPath, setLocationPath] = useState<string>(currentPath);
  const activeItem = getNavigationItem(currentPath);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setLocationPath(window.location.pathname);
  }, [currentPath, children]);

  const isRegistrationList = locationPath === "/admissions/registration";
  const isRegistrationForm = locationPath.startsWith("/admissions/registration/");
  const isStudentAdmission = locationPath === "/admissions/applied";
  const isAdmissionReport = locationPath === "/admissions/report";
  const isFeedbackReport = locationPath === "/academic/feedback-report";
  const isStudentTc = locationPath === "/academic/student-tc";
  const isWithheldList = locationPath === "/academic/withheld-list";
  const isStudentAttendance = locationPath === "/academic/attendance";
  const isClassAllocation = locationPath === "/academic/class-allocation-report";
  const isMarksCard = locationPath === "/academic/marks-card";
  const isMarksReport = locationPath === "/academic/marks-report";
  const isSummatativeReport = locationPath === "/academic/summatative-report";
  const isFeeTypeMaster = locationPath === "/fms/fee-type-master";
  const isBankList = locationPath === "/fms/bank";
  const isFeeDescription = locationPath === "/fms/fee-description";
  const isPickupPoint = locationPath === "/fms/pickup-point";
  const isFeeMaster = locationPath === "/fms/fee-master";
  const isFeeReceipt = locationPath === "/fms/fee-receipt";
  const isFeePrintList = locationPath === "/fms/fee-print-list";
  const isCancelledFeeList = locationPath === "/fms/cancelled-fee-list";
  const isUpdateStudentFee = locationPath === "/fms/update-student-fee";
  const isUpdateMaterialFee = locationPath === "/fms/update-material-fee";
  const isStudentConcession = locationPath === "/fms/student-concession";
  const isChangeStudentFee = locationPath === "/fms/change-student-fee";
  const isRteReport = locationPath === "/fms/rte-report";
  const isFeeConcessionReport = locationPath === "/fms/fee-concession-report";
  const isFeePendingReport = locationPath === "/fms/fee-pending-report";
  const isFeeDueListPendingReport = locationPath === "/fms/fee-due-list-pending-report";
  const isDayBookReport = locationPath === "/fms/day-book-report";
  const isTransportFeeDueListPendingReport =
    locationPath === "/fms/transport-fee-due-list-pending-report";
  const isChequeClearence = locationPath === "/fms/cheque-clearence";
  const isMopReport = locationPath === "/fms/mop-report";
  const isDailyMopReport = locationPath === "/fms/daily-mop-report";
  const breadcrumbs =
    currentPath === "/dashboard"
      ? ["Home", "Dashboard"]
      : isRegistrationList
        ? ["Home", "Applied & Admitted Lists"]
        : isRegistrationForm
          ? ["Admissions", "Student Registration"]
          : isStudentAdmission
            ? ["Home", "Student Admission"]
            : isAdmissionReport
              ? ["Home", "Student Admission Report"]
              : isFeedbackReport
                ? ["Home", "Student FeedBack Report"]
                : isStudentTc
                  ? ["Home", "Applicable for TC List"]
                  : isWithheldList
                    ? ["Home", "Applicable for WithHold List"]
                    : isStudentAttendance
                      ? ["Home", "Student Attendance"]
                      : isClassAllocation
                        ? ["Home", "Subject Faculty Info"]
                        : isMarksCard
                          ? ["Home", "Student MarksCard"]
                          : isMarksReport
                            ? ["Home", "Marks Report"]
                            : isSummatativeReport
                              ? ["Home", "Summatative Report"]
                              : isFeeTypeMaster
                                ? ["Home", "Add FeeType"]
                                : isBankList
                                  ? ["Home", "Bank List"]
                                  : isFeeDescription
                                    ? ["Home", "Fee Description List"]
                                    : isPickupPoint
                                      ? ["Home", "Pick Up Point List"]
                                      : isFeeMaster
                                        ? ["Home", "Fee List"]
                                        : isFeeReceipt
                                          ? ["Home", "Fee Receipt"]
                                          : isFeePrintList
                                            ? ["Home", "Fee Print List"]
                                            : isCancelledFeeList
                                              ? ["Home", "Cancel Fee Print List"]
                                              : isUpdateStudentFee
                                                ? ["Home", "Update Student Fee"]
                                                : isUpdateMaterialFee
                                                  ? ["Home", "Update Material Fee"]
                                                  : isStudentConcession
                                                    ? ["Home", "Student Concession"]
                                                    : isChangeStudentFee
                                                      ? ["Home", "Change/Upgrade Fees"]
                                                      : isRteReport
                                                        ? ["Home", "RTE Report"]
                                                        : isFeeConcessionReport
                                                          ? ["Home", "Fee Concession Details"]
                                                          : isFeePendingReport
                                                            ? ["Home", "Pending Fee- Details"]
                                                            : isFeeDueListPendingReport
                                                              ? ["Home", "Pending Fee-Descriptions"]
                                                              : isDayBookReport
                                                                ? ["Home", "Day Book Report"]
                                                                : isTransportFeeDueListPendingReport
                                                                  ? ["Home", "Pending Fee-Descriptions"]
                                                                  : isChequeClearence
                                                                    ? ["Home", "Accept Bank Transactions"]
                                                                    : isMopReport
                                                                      ? ["Home", "Mode of Payment Report"]
                                                                      : isDailyMopReport
                                                                        ? ["Home", "Mode of Payment Report"]
                                                                        : activeItem
                                                                          ? [activeItem.section, activeItem.title]
                                                                          : ["Workspace", "Dashboard"];
  const pageTitle =
    currentPath === "/dashboard"
      ? "Admin Dashboard"
      : isRegistrationList
        ? "Applied & Admitted Lists"
        : locationPath.endsWith("/new")
          ? "Add Student"
          : isRegistrationForm
            ? "Edit Student Admission"
            : isStudentAdmission
              ? "Student Admission"
              : isAdmissionReport
                ? "Student Admission Report"
                : isFeedbackReport
                  ? "Student FeedBack Report"
                  : isStudentTc
                    ? "Transfer Certificate List"
                    : isWithheldList
                      ? "WithHoldStatus List"
                      : isStudentAttendance
                        ? "Student Attendance"
                        : isClassAllocation
                          ? "Subject Faculty Info"
                          : isMarksCard
                            ? "Student MarksCard"
                            : isMarksReport
                              ? "Marks Report"
                              : isSummatativeReport
                                ? "Summatative Report"
                                : isFeeTypeMaster
                                  ? "Fee Type Master"
                                  : isBankList
                                    ? "Bank List"
                                    : isFeeDescription
                                      ? "Fee Description List"
                                      : isPickupPoint
                                        ? "Pickup Point List"
                                        : isFeeMaster
                                          ? "Fee List"
                                          : isFeeReceipt
                                            ? "Fee Receipt"
                                            : isFeePrintList
                                              ? "Fee Print List"
                                              : isCancelledFeeList
                                                ? "Cancel Fee Print List"
                                                : isUpdateStudentFee
                                                  ? "Update Student Fee"
                                                  : isUpdateMaterialFee
                                                    ? "Update Material Fee"
                                                    : isStudentConcession
                                                      ? "Student Concession"
                                                      : isChangeStudentFee
                                                        ? "Change/Upgrade Fees"
                                                        : isRteReport
                                                          ? "RTE Report"
                                                          : isFeeConcessionReport
                                                            ? "Fee Concession Details"
                                                            : isFeePendingReport
                                                              ? "Pending Fee- Details"
                                                              : isFeeDueListPendingReport
                                                                ? "Pending Fee-Descriptions"
                                                                : isDayBookReport
                                                                  ? "Day Book Report"
                                                                  : isTransportFeeDueListPendingReport
                                                                    ? "Transport Fee due List Pending Report"
                                                                    : isChequeClearence
                                                                      ? "Accept Bank Transactions"
                                                                      : isMopReport
                                                                        ? "Mode of Payment Report"
                                                                        : isDailyMopReport
                                                                          ? "Daily MOP Report"
                                                                          : breadcrumbs[1];
  const sections = useMemo(() => getNavigationForRole(role), [role]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    return () => document.documentElement.classList.remove("dark");
  }, [isDark]);

  return (
    <div className="min-h-screen bg-app text-foreground">
      <div className="flex min-h-screen w-full">
        <aside className={cn("hidden border-r border-sidebar-border bg-sidebar transition-all duration-200 lg:block", collapsed ? "w-20" : "w-72")}>
          <SidebarContent currentPath={currentPath} collapsed={collapsed} sections={sections} onNavigate={() => undefined} />
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
                    <SidebarContent
                      currentPath={currentPath}
                      collapsed={false}
                      sections={sections}
                      onNavigate={() => setMobileOpen(false)}
                    />
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
                <h1 className={cn(
                  "truncate text-xl font-semibold tracking-normal sm:text-2xl",
                  currentPath === "/dashboard" ||
                  isStudentAdmission ||
                  isAdmissionReport ||
                  isFeedbackReport ||
                  isStudentTc ||
                  isWithheldList ||
                  isStudentAttendance ||
                  isClassAllocation ||
                  isMarksCard ||
                  isMarksReport ||
                  isSummatativeReport ||
                  isFeeTypeMaster ||
                  isBankList ||
                  isFeeDescription ||
                  isPickupPoint ||
                  isFeeMaster ||
                  isFeeReceipt ||
                  isFeePrintList ||
                  isCancelledFeeList ||
                  isUpdateStudentFee ||
                  isUpdateMaterialFee ||
                  isStudentConcession ||
                  isChangeStudentFee ||
                  isRteReport ||
                  isFeeConcessionReport ||
                  isFeePendingReport ||
                  isFeeDueListPendingReport ||
                  isDayBookReport ||
                  isTransportFeeDueListPendingReport ||
                  isChequeClearence ||
                  isMopReport ||
                  isDailyMopReport
                    ? "text-sky-500"
                    : "text-foreground",
                )}>{pageTitle}</h1>
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
                <ProfileMenu session={session} />
              </div>
            </div>
          </header>
          <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  currentPath,
  collapsed,
  sections,
  onNavigate,
}: {
  currentPath: EduRoutePath;
  collapsed: boolean;
  sections: ReturnType<typeof getNavigationForRole>;
  onNavigate: () => void;
}) {
  const [expandedIds, setExpandedIds] = useState<string[]>(() =>
    sections.filter((section) => isSectionActive(section, currentPath)).map((section) => section.id),
  );

  useEffect(() => {
    const activeIds = sections.filter((section) => isSectionActive(section, currentPath)).map((section) => section.id);
    if (activeIds.length === 0) return;
    setExpandedIds((current) => Array.from(new Set([...current, ...activeIds])));
  }, [currentPath, sections]);

  const mainSections = sections.filter((section) => section.group !== "extra");
  const extraSections = sections.filter((section) => section.group === "extra");

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <div className="flex h-screen min-h-0 flex-col bg-sidebar">
      <div className="border-b border-sidebar-border p-4">
        <BrandMark expanded={!collapsed} />
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <nav className="py-2">
          {mainSections.map((section) => (
            <SidebarNavRow
              key={section.id}
              section={section}
              currentPath={currentPath}
              collapsed={collapsed}
              expanded={expandedIds.includes(section.id)}
              onToggle={() => toggleExpanded(section.id)}
              onNavigate={onNavigate}
            />
          ))}
          {extraSections.length > 0 && (
            <>
              <div className="mx-4 my-3 border-t border-sidebar-border" />
              {!collapsed && (
                <p className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Extra Components
                </p>
              )}
              {extraSections.map((section) => (
                <SidebarNavRow
                  key={section.id}
                  section={section}
                  currentPath={currentPath}
                  collapsed={collapsed}
                  expanded={expandedIds.includes(section.id)}
                  onToggle={() => toggleExpanded(section.id)}
                  onNavigate={onNavigate}
                />
              ))}
            </>
          )}
        </nav>
      </ScrollArea>
    </div>
  );
}

function SidebarNavRow({
  section,
  currentPath,
  collapsed,
  expanded,
  onToggle,
  onNavigate,
}: {
  section: NavSection;
  currentPath: EduRoutePath;
  collapsed: boolean;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const isActive = isSectionActive(section, currentPath);
  const href = section.path ?? section.items[0]?.path;
  const hasChildren = section.expandable && section.items.length > 1;

  const rowClassName = cn(
    "relative flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors",
    isActive
      ? "bg-primary/5 text-primary before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-primary"
      : "text-slate-600 hover:bg-muted/60 hover:text-foreground",
    collapsed && "justify-center px-2",
  );

  const labelClassName = cn("truncate", isActive && "underline underline-offset-4");

  const content = (
    <>
      <section.icon className={cn("size-[18px] shrink-0", isActive ? "text-primary" : "text-slate-500")} />
      {!collapsed && <span className={cn("min-w-0 flex-1 text-left", labelClassName)}>{section.label}</span>}
      {!collapsed && section.expandable && (
        expanded && hasChildren ? (
          <ChevronDown className={cn("size-3.5 shrink-0", isActive ? "text-primary" : "text-slate-400")} />
        ) : (
          <ChevronRight className={cn("size-3.5 shrink-0", isActive ? "text-primary" : "text-slate-400")} />
        )
      )}
    </>
  );

  return (
    <div>
      {section.expandable && hasChildren ? (
        <button
          type="button"
          className={rowClassName}
          onClick={onToggle}
          title={collapsed ? section.label : undefined}
          aria-expanded={expanded}
        >
          {content}
        </button>
      ) : href ? (
        <a
          href={href}
          onClick={onNavigate}
          className={rowClassName}
          aria-current={isActive ? "page" : undefined}
          title={collapsed ? section.label : undefined}
        >
          {content}
        </a>
      ) : (
        <button type="button" className={rowClassName} onClick={onToggle} title={collapsed ? section.label : undefined}>
          {content}
        </button>
      )}

      {!collapsed && hasChildren && expanded && (
        <div className="pb-1 pl-11">
          {section.items.map((item) => {
            const childActive = item.path === currentPath;
            return (
              <a
                key={`${section.id}-${item.path}`}
                href={item.path}
                onClick={onNavigate}
                className={cn(
                  "block py-2.5 text-sm font-medium transition-colors",
                  childActive ? "text-primary underline underline-offset-4" : "text-slate-600 hover:text-foreground",
                )}
                aria-current={childActive ? "page" : undefined}
              >
                {item.title}
              </a>
            );
          })}
        </div>
      )}
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

function ProfileMenu({ session }: { session: DemoSession | null }) {
  const display = session ?? getDemoUserByRole("admin");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 gap-2 px-2" aria-label="Open profile menu">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary-soft text-primary">{display.initials}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium text-foreground sm:inline">{display.name}</span>
          <ChevronDown className="hidden size-4 text-muted-foreground sm:inline" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="space-y-0.5">
            <p>{getRoleLabel(display.role)}</p>
            <p className="text-xs font-normal text-muted-foreground">{display.title}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><User className="size-4" /> Profile</DropdownMenuItem>
        <DropdownMenuItem><Settings className="size-4" /> Preferences</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            clearDemoSession();
            window.location.assign("/");
          }}
        >
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DashboardPage() {
  return <AdminHomeDashboard />;
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

export { flatNavigation };
