import { useMemo, useRef, useState } from "react";
import { Copy, FileSpreadsheet, FileText, Pencil, Plus, Printer, X } from "lucide-react";
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

type ClassRow = {
  id: string;
  className: string;
  syllabusName: string;
  combination: string;
};

const SYLLABUS_OPTIONS = ["State"];
const LEVEL_OPTIONS = ["High", "Pre Primary", "Primary"];

const INITIAL_ROWS: ClassRow[] = [
  { id: "cls-1", className: "I", syllabusName: "State", combination: "Primary" },
  { id: "cls-2", className: "II", syllabusName: "State", combination: "Primary" },
  { id: "cls-3", className: "III", syllabusName: "State", combination: "Primary" },
  { id: "cls-4", className: "IV", syllabusName: "State", combination: "Primary" },
  { id: "cls-5", className: "V", syllabusName: "State", combination: "Primary" },
  { id: "cls-6", className: "VI", syllabusName: "State", combination: "Primary" },
  { id: "cls-7", className: "VII", syllabusName: "State", combination: "Primary" },
  { id: "cls-8", className: "VIII", syllabusName: "State", combination: "High" },
  { id: "cls-9", className: "IX", syllabusName: "State", combination: "High" },
  { id: "cls-10", className: "X", syllabusName: "State", combination: "High" },
  { id: "cls-11", className: "LKG", syllabusName: "State", combination: "Pre Primary" },
  { id: "cls-12", className: "NURSERY", syllabusName: "State", combination: "Pre Primary" },
  { id: "cls-13", className: "UKG", syllabusName: "State", combination: "Pre Primary" },
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

const PAGE_SIZE = 10;

export function ClassSettingsPage() {
  const [rows, setRows] = useState<ClassRow[]>(INITIAL_ROWS);
  const [syllabusName, setSyllabusName] = useState("none");
  const [levelName, setLevelName] = useState("none");
  const [className, setClassName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    syllabusName: false,
    levelName: false,
    className: false,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const classRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [row.className, row.syllabusName, row.combination].join(" ").toLowerCase().includes(query),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const resetForm = () => {
    setSyllabusName("none");
    setLevelName("none");
    setClassName("");
    setEditingId(null);
    setErrors({ syllabusName: false, levelName: false, className: false });
  };

  const handleSave = () => {
    const nextErrors = {
      syllabusName: syllabusName === "none",
      levelName: levelName === "none",
      className: !className.trim(),
    };
    setErrors(nextErrors);
    if (nextErrors.syllabusName || nextErrors.levelName || nextErrors.className) {
      toast.error("Please fill all required fields");
      classRef.current?.focus();
      return;
    }

    const trimmed = className.trim();
    const duplicate = rows.some(
      (row) =>
        row.className.toLowerCase() === trimmed.toLowerCase() &&
        row.syllabusName === syllabusName &&
        row.combination === levelName &&
        row.id !== editingId,
    );
    if (duplicate) {
      toast.error("Class already exists for this syllabus and level");
      return;
    }

    if (editingId) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingId
            ? {
                ...row,
                className: trimmed,
                syllabusName,
                combination: levelName,
              }
            : row,
        ),
      );
      toast.success("Class updated");
    } else {
      setRows((current) => [
        {
          id: `cls-${Date.now()}`,
          className: trimmed,
          syllabusName,
          combination: levelName,
        },
        ...current,
      ]);
      toast.success("Class saved");
    }

    resetForm();
    setPage(1);
  };

  const handleEdit = (row: ClassRow) => {
    setEditingId(row.id);
    setSyllabusName(row.syllabusName);
    setLevelName(row.combination);
    setClassName(row.className);
    setErrors({ syllabusName: false, levelName: false, className: false });
    classRef.current?.focus();
  };

  const handleDelete = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    if (editingId === id) resetForm();
    toast.success("Class deleted");
  };

  const handleAddNew = () => {
    resetForm();
    classRef.current?.focus();
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered
        .map((row) => `${row.className}\t${row.syllabusName}\t${row.combination}`)
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Class list copied"),
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
            {editingId ? "Edit Class" : "Add Class"}
          </h2>

          <div className="mt-5 space-y-4">
            <label className="block space-y-1.5 text-sm text-foreground">
              <span>
                Syllabus<span className="text-danger">*</span>
              </span>
              <Select
                value={syllabusName}
                onValueChange={(value) => {
                  setSyllabusName(value);
                  setErrors((current) => ({ ...current, syllabusName: false }));
                }}
              >
                <SelectTrigger
                  className="h-9 bg-card"
                  aria-label="Syllabus"
                  aria-invalid={errors.syllabusName}
                >
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">--Select--</SelectItem>
                  {SYLLABUS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.syllabusName ? (
                <span className="text-sm text-danger">Syllabus is required</span>
              ) : null}
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>
                Level<span className="text-danger">*</span>
              </span>
              <Select
                value={levelName}
                onValueChange={(value) => {
                  setLevelName(value);
                  setErrors((current) => ({ ...current, levelName: false }));
                }}
              >
                <SelectTrigger
                  className="h-9 bg-card"
                  aria-label="Level"
                  aria-invalid={errors.levelName}
                >
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">--Select--</SelectItem>
                  {LEVEL_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.levelName ? (
                <span className="text-sm text-danger">Level is required</span>
              ) : null}
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>
                Class / Semester<span className="text-danger">*</span>
              </span>
              <Input
                ref={classRef}
                value={className}
                onChange={(event) => {
                  setClassName(event.target.value);
                  if (event.target.value.trim()) {
                    setErrors((current) => ({ ...current, className: false }));
                  }
                }}
                className="h-9 bg-card"
                aria-label="Class / Semester"
                aria-invalid={errors.className}
              />
              {errors.className ? (
                <span className="text-sm text-danger">Class / Semester is required</span>
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
          <h2 className="text-lg font-semibold text-foreground">Class List</h2>

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
                aria-label="Search classes"
              />
            </label>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-xs font-bold">Class Name / Semester</TableHead>
                    <TableHead className="text-xs font-bold">Syllabus Name</TableHead>
                    <TableHead className="text-xs font-bold">Combination</TableHead>
                    <TableHead className="w-24 text-center text-xs font-bold">Edit</TableHead>
                    <TableHead className="w-24 text-center text-xs font-bold">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-sm text-muted-foreground">
                        No data available in table
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageRows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        className={cn(index % 2 === 1 ? "bg-info-soft/50" : "bg-card")}
                      >
                        <TableCell className="font-medium">{row.className}</TableCell>
                        <TableCell>{row.syllabusName}</TableCell>
                        <TableCell>{row.combination}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            type="button"
                            size="icon"
                            className="size-8 rounded-full bg-info text-white hover:bg-info/90"
                            aria-label={`Edit ${row.className}`}
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
                            aria-label={`Delete ${row.className}`}
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
                {pageNumbers.map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === currentPage}
                      onClick={(event) => {
                        event.preventDefault();
                        setPage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
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
        aria-label="Add New Class"
      >
        <Plus className="size-5" />
        Add New
      </Button>
    </div>
  );
}
