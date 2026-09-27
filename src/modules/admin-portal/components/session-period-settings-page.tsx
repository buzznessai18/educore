import { useMemo, useRef, useState } from "react";
import { Copy, FileSpreadsheet, FileText, Pencil, Plus, Printer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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

type SessionRow = {
  id: string;
  sessionName: string;
  fromTime: string;
  toTime: string;
};

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

const PAGE_SIZE = 10;

function formatTime(value: string) {
  if (!value) return "";
  const [hours, minutes] = value.split(":");
  const hour = Number(hours);
  if (Number.isNaN(hour)) return value;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${suffix}`;
}

export function SessionPeriodSettingsPage() {
  const [rows, setRows] = useState<SessionRow[]>([]);
  const [sessionName, setSessionName] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState({ fromTime: false, toTime: false });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const nameRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [row.sessionName, row.fromTime, row.toTime].join(" ").toLowerCase().includes(query),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const resetForm = () => {
    setSessionName("");
    setFromTime("");
    setToTime("");
    setEditingId(null);
    setErrors({ fromTime: false, toTime: false });
  };

  const handleSave = () => {
    const nextErrors = {
      fromTime: !fromTime,
      toTime: !toTime,
    };
    setErrors(nextErrors);
    if (nextErrors.fromTime || nextErrors.toTime) {
      toast.error("From Time and To Time are required");
      return;
    }
    if (!sessionName.trim()) {
      toast.error("Session Name is required");
      nameRef.current?.focus();
      return;
    }
    if (fromTime >= toTime) {
      toast.error("From Time must be before To Time");
      return;
    }

    const trimmed = sessionName.trim();
    const duplicate = rows.some(
      (row) => row.sessionName.toLowerCase() === trimmed.toLowerCase() && row.id !== editingId,
    );
    if (duplicate) {
      toast.error("Session already exists");
      return;
    }

    if (editingId) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingId
            ? { ...row, sessionName: trimmed, fromTime, toTime }
            : row,
        ),
      );
      toast.success("Session updated");
    } else {
      setRows((current) => [
        { id: `sess-${Date.now()}`, sessionName: trimmed, fromTime, toTime },
        ...current,
      ]);
      toast.success("Session saved");
    }

    resetForm();
    setPage(1);
  };

  const handleEdit = (row: SessionRow) => {
    setEditingId(row.id);
    setSessionName(row.sessionName);
    setFromTime(row.fromTime);
    setToTime(row.toTime);
    setErrors({ fromTime: false, toTime: false });
    nameRef.current?.focus();
  };

  const handleAddNew = () => {
    resetForm();
    nameRef.current?.focus();
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered
        .map((row) => `${row.sessionName}\t${row.fromTime}\t${row.toTime}`)
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Session list copied"),
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
            {editingId ? "Edit Session" : "Add Session"}
          </h2>

          <div className="mt-5 space-y-4">
            <label className="block space-y-1.5 text-sm text-foreground">
              <span>Session Name</span>
              <Input
                ref={nameRef}
                value={sessionName}
                onChange={(event) => setSessionName(event.target.value)}
                className="h-9 bg-card"
                aria-label="Session Name"
              />
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>
                From Time<span className="text-danger">*</span>
              </span>
              <Input
                type="time"
                value={fromTime}
                onChange={(event) => {
                  setFromTime(event.target.value);
                  if (event.target.value) {
                    setErrors((current) => ({ ...current, fromTime: false }));
                  }
                }}
                className="h-9 bg-card"
                aria-label="From Time"
                aria-invalid={errors.fromTime}
              />
              {errors.fromTime ? (
                <span className="text-sm text-danger">From Time is required</span>
              ) : null}
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>
                To Time<span className="text-danger">*</span>
              </span>
              <Input
                type="time"
                value={toTime}
                onChange={(event) => {
                  setToTime(event.target.value);
                  if (event.target.value) {
                    setErrors((current) => ({ ...current, toTime: false }));
                  }
                }}
                className="h-9 bg-card"
                aria-label="To Time"
                aria-invalid={errors.toTime}
              />
              {errors.toTime ? (
                <span className="text-sm text-danger">To Time is required</span>
              ) : null}
            </label>

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
          <h2 className="text-lg font-semibold text-foreground">Session List</h2>

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
                aria-label="Search sessions"
              />
            </label>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-xs font-bold">Session</TableHead>
                    <TableHead className="text-xs font-bold">From Time</TableHead>
                    <TableHead className="text-xs font-bold">To Time</TableHead>
                    <TableHead className="w-28 text-center text-xs font-bold">Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-sm text-muted-foreground">
                        No data available in table
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageRows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        className={cn(index % 2 === 1 ? "bg-info-soft/50" : "bg-card")}
                      >
                        <TableCell className="font-medium">{row.sessionName}</TableCell>
                        <TableCell>{formatTime(row.fromTime)}</TableCell>
                        <TableCell>{formatTime(row.toTime)}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            type="button"
                            size="icon"
                            className="size-8 rounded-full bg-info text-white hover:bg-info/90"
                            aria-label={`Edit ${row.sessionName}`}
                            onClick={() => handleEdit(row)}
                          >
                            <Pencil className="size-3.5" />
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
        aria-label="Add New Session"
      >
        <Plus className="size-5" />
        Add New
      </Button>
    </div>
  );
}
