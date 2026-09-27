import { useMemo, useRef, useState } from "react";
import { Copy, FileSpreadsheet, FileText, Pencil, Plus, Printer, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ActionPills,
  SETTINGS_MASTER_PILLS,
} from "@/modules/admin-portal/components/admission-action-pills";
import { EXPORT_ACTIONS, type ExportAction } from "@/modules/admin-portal/constants";
import { cn } from "@/lib/utils";

type LeaveYearRow = {
  id: string;
  leaveYear: string;
  fromDate: string;
  toDate: string;
  isCurrent: boolean;
};

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

const PAGE_SIZE = 10;

function formatDisplayDate(value: string) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB");
}

export function LeaveYearSettingsPage() {
  const [rows, setRows] = useState<LeaveYearRow[]>([]);
  const [leaveYear, setLeaveYear] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isCurrent, setIsCurrent] = useState<"yes" | "no">("no");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState({ leaveYear: false, fromDate: false, toDate: false });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const leaveYearRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [row.leaveYear, row.fromDate, row.toDate, row.isCurrent ? "yes" : "no"]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const resetForm = () => {
    setLeaveYear("");
    setFromDate("");
    setToDate("");
    setIsCurrent("no");
    setEditingId(null);
    setErrors({ leaveYear: false, fromDate: false, toDate: false });
  };

  const handleSave = () => {
    const nextErrors = {
      leaveYear: !leaveYear.trim(),
      fromDate: !fromDate,
      toDate: !toDate,
    };
    setErrors(nextErrors);
    if (nextErrors.leaveYear || nextErrors.fromDate || nextErrors.toDate) {
      toast.error("Please fill all required fields");
      leaveYearRef.current?.focus();
      return;
    }

    if (fromDate > toDate) {
      toast.error("From Date cannot be after To Date");
      return;
    }

    const trimmed = leaveYear.trim();
    const duplicate = rows.some(
      (row) => row.leaveYear.toLowerCase() === trimmed.toLowerCase() && row.id !== editingId,
    );
    if (duplicate) {
      toast.error("Leave Year already exists");
      return;
    }

    const currentFlag = isCurrent === "yes";

    if (editingId) {
      setRows((current) =>
        current.map((row) => {
          if (row.id === editingId) {
            return {
              ...row,
              leaveYear: trimmed,
              fromDate,
              toDate,
              isCurrent: currentFlag,
            };
          }
          return { ...row, isCurrent: currentFlag ? false : row.isCurrent };
        }),
      );
      toast.success("Leave year updated");
    } else {
      setRows((current) => [
        {
          id: `ly-${Date.now()}`,
          leaveYear: trimmed,
          fromDate,
          toDate,
          isCurrent: currentFlag,
        },
        ...current.map((row) => ({
          ...row,
          isCurrent: currentFlag ? false : row.isCurrent,
        })),
      ]);
      toast.success("Leave year saved");
    }

    resetForm();
    setPage(1);
  };

  const handleEdit = (row: LeaveYearRow) => {
    setEditingId(row.id);
    setLeaveYear(row.leaveYear);
    setFromDate(row.fromDate);
    setToDate(row.toDate);
    setIsCurrent(row.isCurrent ? "yes" : "no");
    setErrors({ leaveYear: false, fromDate: false, toDate: false });
    leaveYearRef.current?.focus();
  };

  const handleDelete = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    if (editingId === id) resetForm();
    toast.success("Leave year deleted");
  };

  const handleAddNew = () => {
    resetForm();
    leaveYearRef.current?.focus();
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered
        .map(
          (row) =>
            `${row.leaveYear}\t${row.fromDate}\t${row.toDate}\t${row.isCurrent ? "Yes" : "No"}`,
        )
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Leave year list copied"),
        () => toast.error("Unable to copy list"),
      );
      return;
    }
    if (action === "Print") {
      window.print();
      return;
    }
    toast.info(`${action} export is ready for backend wiring`);
  };

  return (
    <div className="relative mx-auto max-w-[1400px] space-y-4 pb-20">
      <ActionPills items={SETTINGS_MASTER_PILLS} className="justify-start" />

      <div className="grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
          <h2 className="text-lg font-semibold text-foreground">
            {editingId ? "Edit Leave Year" : "Add Leave Year"}
          </h2>

          <div className="mt-5 space-y-4">
            <label className="block space-y-1.5 text-sm text-foreground">
              <span>Leave Year</span>
              <Input
                ref={leaveYearRef}
                value={leaveYear}
                onChange={(event) => {
                  setLeaveYear(event.target.value);
                  if (event.target.value.trim()) {
                    setErrors((current) => ({ ...current, leaveYear: false }));
                  }
                }}
                className="h-9 bg-card"
                aria-label="Leave Year"
                aria-invalid={errors.leaveYear}
              />
              {errors.leaveYear ? (
                <span className="text-sm text-danger">Leave Year name is required</span>
              ) : null}
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>From Date</span>
              <Input
                type="date"
                value={fromDate}
                onChange={(event) => {
                  setFromDate(event.target.value);
                  if (event.target.value) {
                    setErrors((current) => ({ ...current, fromDate: false }));
                  }
                }}
                className="h-9 bg-card"
                aria-label="From Date"
                aria-invalid={errors.fromDate}
              />
              {errors.fromDate ? (
                <span className="text-sm text-danger">From Date is required</span>
              ) : null}
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>To Date</span>
              <Input
                type="date"
                value={toDate}
                onChange={(event) => {
                  setToDate(event.target.value);
                  if (event.target.value) {
                    setErrors((current) => ({ ...current, toDate: false }));
                  }
                }}
                className="h-9 bg-card"
                aria-label="To Date"
                aria-invalid={errors.toDate}
              />
              {errors.toDate ? (
                <span className="text-sm text-danger">To Date is required</span>
              ) : null}
            </label>

            <div className="space-y-2">
              <p className="text-sm text-foreground">Is Current Year</p>
              <RadioGroup
                value={isCurrent}
                onValueChange={(value) => setIsCurrent(value as "yes" | "no")}
                className="flex items-center gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="leave-year-current-yes" />
                  <Label htmlFor="leave-year-current-yes" className="font-normal">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="leave-year-current-no" />
                  <Label htmlFor="leave-year-current-no" className="font-normal">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                type="button"
                className="h-9 rounded-md bg-info px-8 text-sm font-semibold text-white hover:bg-info/90"
                onClick={handleSave}
              >
                Save
              </Button>
              {editingId ? (
                <Button
                  type="button"
                  variant="outline"
                  className="ml-2 h-9 rounded-md"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
          <h2 className="text-lg font-semibold text-foreground">Leave Year List</h2>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {EXPORT_ACTIONS.map((action) => {
                const Icon = exportIcons[action];
                return (
                  <Button
                    key={action}
                    type="button"
                    size="sm"
                    className="h-8 rounded-md bg-info px-3 text-xs font-semibold text-white hover:bg-info/90"
                    onClick={() => handleExport(action)}
                  >
                    <Icon className="size-3.5" />
                    {action}
                  </Button>
                );
              })}
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <span>Search:</span>
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="h-8 w-44 bg-card"
                aria-label="Search leave years"
              />
            </label>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-xs font-bold">Leave Year</TableHead>
                    <TableHead className="text-xs font-bold">From Date</TableHead>
                    <TableHead className="text-xs font-bold">To Date</TableHead>
                    <TableHead className="text-xs font-bold">Is Current</TableHead>
                    <TableHead className="w-24 text-center text-xs font-bold">Edit</TableHead>
                    <TableHead className="w-24 text-center text-xs font-bold">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                        No data available in table
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageRows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        className={cn(index % 2 === 1 ? "bg-info-soft/50" : "bg-card")}
                      >
                        <TableCell className="font-medium">{row.leaveYear}</TableCell>
                        <TableCell>{formatDisplayDate(row.fromDate)}</TableCell>
                        <TableCell>{formatDisplayDate(row.toDate)}</TableCell>
                        <TableCell>{row.isCurrent ? "Yes" : "No"}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            type="button"
                            size="icon"
                            className="size-8 rounded-full bg-info text-white hover:bg-info/90"
                            aria-label={`Edit ${row.leaveYear}`}
                            onClick={() => handleEdit(row)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            type="button"
                            size="icon"
                            className="size-8 rounded-full bg-danger text-white hover:bg-danger/90"
                            aria-label={`Delete ${row.leaveYear}`}
                            onClick={() => handleDelete(row.id)}
                          >
                            <X className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>
              Showing {from} to {to} of {filtered.length} entries
            </p>
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setPage((current) => Math.max(1, current - 1));
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive onClick={(event) => event.preventDefault()}>
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setPage((current) => Math.min(totalPages, current + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>
      </div>

      <Button
        type="button"
        className="fixed bottom-6 right-6 z-20 h-12 gap-2 rounded-full bg-success px-5 text-sm font-semibold text-white shadow-lg hover:bg-success/90"
        onClick={handleAddNew}
        aria-label="Add New Leave Year"
      >
        <Plus className="size-5" />
        Add New
      </Button>
    </div>
  );
}
