import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  Copy,
  FileSpreadsheet,
  FileText,
  Pencil,
  Plus,
  Printer,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ACADEMIC_YEAR_OPTIONS,
  CLASS_OPTIONS,
  EXPORT_ACTIONS,
  type ExportAction,
} from "@/modules/admin-portal/constants";
import { useAdmissionList } from "@/modules/admin-portal/hooks";
import type { AdmissionListRow, AdmissionListStatus } from "@/modules/admin-portal/types";
import { PayFeeDialog } from "@/modules/admin-portal/components/pay-fee-dialog";
import { cn } from "@/lib/utils";

type RegistrationTab = "application" | "online" | "admitted";

const TAB_CONFIG: { id: RegistrationTab; label: string; status: AdmissionListStatus | "online" }[] = [
  { id: "application", label: "Application List", status: "applied" },
  { id: "online", label: "Online Applications", status: "online" },
  { id: "admitted", label: "Admitted List", status: "admitted" },
];

const ACTION_PILLS: { label: string; tone: "green" | "blue"; href?: string; action?: string }[] = [
  { label: "Class", tone: "green", action: "Class" },
  { label: "Country", tone: "green", action: "Country" },
  { label: "Admission List", tone: "blue", href: "/admissions/registration" },
  { label: "Add Student", tone: "green", href: "/admissions/registration/new" },
  { label: "Admission", tone: "green", href: "/admissions/applied" },
  { label: "Fee Receipt", tone: "green", action: "Fee Receipt" },
  { label: "Masters", tone: "blue", action: "Masters" },
  { label: "Reports", tone: "blue", action: "Reports" },
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

export function StudentRegistrationListPage({
  initialTab = "admitted",
}: {
  initialTab?: RegistrationTab;
}) {
  const [activeTab, setActiveTab] = useState<RegistrationTab>(initialTab);
  const [classId, setClassId] = useState<string>("all");
  const [academicYear, setAcademicYear] = useState("2026");
  const [search, setSearch] = useState("");
  const [paymentStudent, setPaymentStudent] = useState<AdmissionListRow | null>(null);

  const listStatus: AdmissionListStatus = activeTab === "admitted" ? "admitted" : "applied";
  const isOnlineTab = activeTab === "online";

  const filters = useMemo(
    () => ({
      listStatus,
      classId: classId === "all" ? undefined : classId,
      academicYear,
      search,
    }),
    [listStatus, classId, academicYear, search],
  );

  const { data = [], isLoading, isFetching } = useAdmissionList(filters);
  const rows = isOnlineTab ? [] : data;

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = rows
        .map(
          (row) =>
            `${row.slNo}\t${row.studentName}\t${row.semesterClass}\t${row.section}\t${row.admissionNo}\t${row.quota}\t${row.fatherNo}\t${row.fatherName}\t${row.uid}\t${row.admissionDate}\t${row.applicationNo}`,
        )
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Table copied to clipboard"),
        () => toast.error("Unable to copy table"),
      );
      return;
    }
    toast.info(`${action} export is ready for backend wiring`);
  };

  return (
    <div className="relative mx-auto max-w-[1400px] space-y-4 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-[#6b7280]">
          Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Applied &amp; Admitted Lists
        </p>
        <div className="flex flex-wrap justify-end gap-2">
          {ACTION_PILLS.map((pill) => {
            const className = cn(
              "h-8 rounded-full px-3 text-xs font-semibold text-white shadow-sm",
              pill.tone === "green" ? "bg-[#5cb85c] hover:bg-[#4cae4c]" : "bg-[#03a9f4] hover:bg-[#0288d1]",
            );
            if (pill.href) {
              return (
                <Button key={pill.label} asChild className={className}>
                  <Link to={pill.href}>
                    {pill.label}
                    {(pill.label === "Masters" || pill.label === "Reports") && (
                      <ChevronDown className="size-3.5" />
                    )}
                  </Link>
                </Button>
              );
            }
            return (
              <Button
                key={pill.label}
                type="button"
                className={className}
                onClick={() => toast.info(`${pill.action} ready for Phase 2 wiring`)}
              >
                {pill.label}
                {(pill.label === "Masters" || pill.label === "Reports") && (
                  <ChevronDown className="size-3.5" />
                )}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <label className="space-y-1 text-sm text-[#374151]">
          <span>Semester/Class</span>
          <Select value={classId} onValueChange={setClassId}>
            <SelectTrigger className="h-9 w-48 bg-white" aria-label="Filter by semester or class">
              <SelectValue placeholder="---Select---" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">---Select---</SelectItem>
              {CLASS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className="space-y-1 text-sm text-[#374151]">
          <span>Academic Year</span>
          <Select value={academicYear} onValueChange={setAcademicYear}>
            <SelectTrigger className="h-9 w-40 bg-white" aria-label="Filter by academic year">
              <SelectValue placeholder="Academic Year" />
            </SelectTrigger>
            <SelectContent>
              {ACADEMIC_YEAR_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {TAB_CONFIG.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-sm border px-4 py-2 text-sm font-semibold transition",
                isActive
                  ? "border-[#0288d1] bg-[#03a9f4] text-white"
                  : "border-[#03a9f4] bg-white text-[#0288d1] hover:bg-[#e1f5fe]",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {EXPORT_ACTIONS.map((action) => {
            const Icon = exportIcons[action];
            return (
              <Button
                key={action}
                type="button"
                size="sm"
                className="h-8 rounded-sm bg-[#03a9f4] px-3 text-xs font-semibold text-white hover:bg-[#0288d1]"
                onClick={() => handleExport(action)}
              >
                <Icon className="size-3.5" />
                {action}
              </Button>
            );
          })}
        </div>
        <label className="flex items-center gap-2 text-sm text-[#374151]">
          <span>Search:</span>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-8 w-52 bg-white"
            aria-label="Search admissions"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-sm border border-[#dbe3ea] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#dbe3ea] bg-[#f8fafc] hover:bg-[#f8fafc]">
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">SlNo.</TableHead>
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">Student Name</TableHead>
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">Semester/Class</TableHead>
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">Section</TableHead>
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">Admission No</TableHead>
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">Quota</TableHead>
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">Father No.</TableHead>
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">Father Name</TableHead>
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">UID</TableHead>
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">Admission Date</TableHead>
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">Application NO</TableHead>
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">Pay</TableHead>
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">X</TableHead>
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && !isOnlineTab ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 14 }).map((__, cell) => (
                      <TableCell key={cell}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} className="h-28 text-center text-sm text-muted-foreground">
                    {isOnlineTab
                      ? "No online applications found."
                      : `No ${activeTab === "admitted" ? "admitted" : "application"} records match the current filters.`}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "border-[#e5eaf0] text-sm",
                      index % 2 === 1 ? "bg-[#f3f9fc]" : "bg-white",
                    )}
                  >
                    <TableCell>{row.slNo}</TableCell>
                    <TableCell>
                      <Link
                        to="/admissions/registration/$studentId"
                        params={{ studentId: row.id }}
                        className="font-medium text-[#0288d1] hover:underline"
                      >
                        {row.studentName}
                      </Link>
                    </TableCell>
                    <TableCell className="uppercase">{row.semesterClass}</TableCell>
                    <TableCell className="uppercase">{row.section}</TableCell>
                    <TableCell>{row.admissionNo}</TableCell>
                    <TableCell className="uppercase">{row.quota}</TableCell>
                    <TableCell>{row.fatherNo}</TableCell>
                    <TableCell className="uppercase">{row.fatherName}</TableCell>
                    <TableCell>{row.uid}</TableCell>
                    <TableCell>{row.admissionDate}</TableCell>
                    <TableCell>{row.applicationNo}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        className="h-7 rounded-sm bg-[#03a9f4] px-3 text-xs font-semibold text-white hover:bg-[#0288d1]"
                        onClick={() => setPaymentStudent(row)}
                      >
                        Pay
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="outline"
                        className="size-7 border-[#cbd5e1] text-[#6b7280]"
                        onClick={() => toast.message(`Remove queued for ${row.studentName}`)}
                        aria-label={`Remove ${row.studentName}`}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        asChild
                        className="h-7 rounded-sm bg-[#03a9f4] px-3 text-xs font-semibold text-white hover:bg-[#0288d1]"
                      >
                        <Link to="/admissions/registration/$studentId" params={{ studentId: row.id }}>
                          <Pencil className="size-3" />
                          Edit
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {rows.length} record{rows.length === 1 ? "" : "s"}
        {isFetching && !isLoading ? " · Refreshing…" : ""}.
      </p>

      <Button
        asChild
        size="icon"
        className="fixed bottom-6 right-6 z-20 size-14 rounded-full bg-[#5cb85c] text-white shadow-lg hover:bg-[#4cae4c]"
        aria-label="Add student"
      >
        <Link to="/admissions/registration/new">
          <Plus className="size-7" />
        </Link>
      </Button>

      <PayFeeDialog
        student={paymentStudent}
        open={Boolean(paymentStudent)}
        onOpenChange={(open) => {
          if (!open) setPaymentStudent(null);
        }}
      />
    </div>
  );
}

/** @deprecated Prefer StudentRegistrationListPage — kept for applied/admitted deep links */
export function AdmissionListPage({ listStatus }: { listStatus: AdmissionListStatus }) {
  return (
    <StudentRegistrationListPage initialTab={listStatus === "admitted" ? "admitted" : "application"} />
  );
}
