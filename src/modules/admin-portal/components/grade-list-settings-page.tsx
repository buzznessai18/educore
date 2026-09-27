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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type GradeRow = {
  id: string;
  semester: string;
  grade: string;
  fromPercentage: string;
  toPercentage: string;
  percentage: string;
};

const SEMESTER_OPTIONS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "LKG",
  "UKG",
  "NURSERY",
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

const PAGE_SIZE = 10;

export function GradeListSettingsPage() {
  const [rows, setRows] = useState<GradeRow[]>([]);
  const [semester, setSemester] = useState("none");
  const [grade, setGrade] = useState("");
  const [fromPercentage, setFromPercentage] = useState("");
  const [toPercentage, setToPercentage] = useState("");
  const [percentage, setPercentage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSemesterError, setShowSemesterError] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const gradeRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [row.semester, row.grade, row.fromPercentage, row.toPercentage, row.percentage]
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
    setSemester("none");
    setGrade("");
    setFromPercentage("");
    setToPercentage("");
    setPercentage("");
    setEditingId(null);
    setShowSemesterError(false);
  };

  const handleSave = () => {
    if (semester === "none") {
      setShowSemesterError(true);
      toast.error("Semester is required");
      return;
    }
    if (!grade.trim()) {
      toast.error("Grade is required");
      gradeRef.current?.focus();
      return;
    }

    const payload = {
      semester,
      grade: grade.trim(),
      fromPercentage: fromPercentage.trim(),
      toPercentage: toPercentage.trim(),
      percentage: percentage.trim(),
    };

    if (editingId) {
      setRows((current) =>
        current.map((row) => (row.id === editingId ? { ...row, ...payload } : row)),
      );
      toast.success("Grade updated");
    } else {
      setRows((current) => [{ id: `grade-${Date.now()}`, ...payload }, ...current]);
      toast.success("Grade saved");
    }

    resetForm();
    setPage(1);
  };

  const handleEdit = (row: GradeRow) => {
    setEditingId(row.id);
    setSemester(row.semester);
    setGrade(row.grade);
    setFromPercentage(row.fromPercentage);
    setToPercentage(row.toPercentage);
    setPercentage(row.percentage);
    setShowSemesterError(false);
    gradeRef.current?.focus();
  };

  const handleAddNew = () => {
    resetForm();
    gradeRef.current?.focus();
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered
        .map(
          (row) =>
            `${row.semester}\t${row.grade}\t${row.fromPercentage}\t${row.toPercentage}\t${row.percentage}`,
        )
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Grade list copied"),
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
            {editingId ? "Edit Grade" : "Add Grade"}
          </h2>

          <div className="mt-5 space-y-4">
            <label className="block space-y-1.5 text-sm text-foreground">
              <span>
                Semester<span className="text-danger">*</span>
              </span>
              <Select
                value={semester}
                onValueChange={(value) => {
                  setSemester(value);
                  setShowSemesterError(false);
                }}
              >
                <SelectTrigger
                  className="h-9 bg-card"
                  aria-label="Semester"
                  aria-invalid={showSemesterError}
                >
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">--Select--</SelectItem>
                  {SEMESTER_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {showSemesterError ? (
                <span className="text-sm text-danger">Semester is required</span>
              ) : null}
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>Grade</span>
              <Input
                ref={gradeRef}
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
                className="h-9 bg-card"
                aria-label="Grade"
              />
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>From %</span>
              <Input
                value={fromPercentage}
                onChange={(event) => setFromPercentage(event.target.value)}
                className="h-9 bg-card"
                aria-label="From Percentage"
              />
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>To %</span>
              <Input
                value={toPercentage}
                onChange={(event) => setToPercentage(event.target.value)}
                className="h-9 bg-card"
                aria-label="To Percentage"
              />
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>Percentage</span>
              <Input
                value={percentage}
                onChange={(event) => setPercentage(event.target.value)}
                className="h-9 bg-card"
                aria-label="Percentage"
              />
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
          <h2 className="text-lg font-semibold text-foreground">Grade List</h2>

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
                aria-label="Search grades"
              />
            </label>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-xs font-bold">semester</TableHead>
                    <TableHead className="text-xs font-bold">Grade</TableHead>
                    <TableHead className="text-xs font-bold">FromPercentage</TableHead>
                    <TableHead className="text-xs font-bold">ToPercentage</TableHead>
                    <TableHead className="text-xs font-bold">Percentage</TableHead>
                    <TableHead className="w-24 text-center text-xs font-bold">Edit</TableHead>
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
                        <TableCell className="font-medium">{row.semester}</TableCell>
                        <TableCell>{row.grade}</TableCell>
                        <TableCell>{row.fromPercentage || "—"}</TableCell>
                        <TableCell>{row.toPercentage || "—"}</TableCell>
                        <TableCell>{row.percentage || "—"}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            type="button"
                            size="icon"
                            className="size-8 rounded-full bg-info text-white hover:bg-info/90"
                            aria-label={`Edit grade ${row.grade}`}
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
        aria-label="Add New Grade"
      >
        <Plus className="size-5" />
        Add New
      </Button>
    </div>
  );
}
