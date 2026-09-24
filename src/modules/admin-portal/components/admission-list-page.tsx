import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Copy,
  FileSpreadsheet,
  FileText,
  Pencil,
  Printer,
  Search,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

export function AdmissionListPage({ listStatus }: { listStatus: AdmissionListStatus }) {
  const [classId, setClassId] = useState<string>("all");
  const [academicYear, setAcademicYear] = useState("2026-27");
  const [search, setSearch] = useState("");
  const [paymentStudent, setPaymentStudent] = useState<AdmissionListRow | null>(null);

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
  const title = listStatus === "applied" ? "Applied Students" : "Admitted Students";

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = data
        .map(
          (row) =>
            `${row.slNo}\t${row.studentName}\t${row.semesterClassSection}\t${row.admissionNo}\t${row.quota}\t${row.fatherName}\t${row.uid}\t${row.applicationDate}`,
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
    <div className="mx-auto max-w-7xl space-y-5">
      <Card className="rounded-lg border-border shadow-enterprise-sm">
        <CardHeader className="grid gap-4 p-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary-soft bg-primary-soft text-primary">
                Admissions
              </Badge>
              <Badge variant="outline">{title}</Badge>
            </div>
            <CardTitle className="text-2xl tracking-normal">{title}</CardTitle>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Filter by class and academic year, export records, collect fees, or open the registration
              form to edit an admission.
            </p>
          </div>
          <Button asChild>
            <Link to="/admissions/registration">New Registration</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 p-5 pt-0">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_200px]">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, admission no, UID, father..."
                aria-label="Search admissions"
              />
            </div>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger aria-label="Filter by semester or class">
                <SelectValue placeholder="Semester / Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {CLASS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={academicYear} onValueChange={setAcademicYear}>
              <SelectTrigger aria-label="Filter by academic year">
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
          </div>

          <div className="flex flex-wrap gap-2">
            {EXPORT_ACTIONS.map((action) => {
              const Icon = exportIcons[action];
              return (
                <Button key={action} variant="outline" size="sm" onClick={() => handleExport(action)}>
                  <Icon className="size-4" />
                  {action}
                </Button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Sl No.</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Semester / Class Section</TableHead>
                  <TableHead>Admission No</TableHead>
                  <TableHead>Quota</TableHead>
                  <TableHead>Father Name</TableHead>
                  <TableHead>UID</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 9 }).map((__, cell) => (
                        <TableCell key={cell}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      No {listStatus} students match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.slNo}</TableCell>
                      <TableCell className="font-medium text-foreground">{row.studentName}</TableCell>
                      <TableCell>{row.semesterClassSection}</TableCell>
                      <TableCell>{row.admissionNo}</TableCell>
                      <TableCell className="capitalize">{row.quota}</TableCell>
                      <TableCell>{row.fatherName}</TableCell>
                      <TableCell>{row.uid}</TableCell>
                      <TableCell>{row.applicationDate}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPaymentStudent(row)}
                            aria-label={`Pay fees for ${row.studentName}`}
                          >
                            <Wallet className="size-4" />
                            Pay
                          </Button>
                          <Button size="sm" variant="secondary" asChild>
                            <Link
                              to="/admissions/registration/$studentId"
                              params={{ studentId: row.id }}
                              aria-label={`Edit ${row.studentName}`}
                            >
                              <Pencil className="size-4" />
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <p className="text-sm text-muted-foreground">
            Showing {data.length} record{data.length === 1 ? "" : "s"}
            {isFetching && !isLoading ? " · Refreshing…" : ""}.
          </p>
        </CardContent>
      </Card>

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
