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

type SyllabusRow = {
  id: string;
  syllabusName: string;
  boardName: string;
  courseName: string;
};

const BOARD_OPTIONS = ["Karnataka"];
const COURSE_OPTIONS = ["State"];

const INITIAL_ROWS: SyllabusRow[] = [
  { id: "syl-1", syllabusName: "State", boardName: "Karnataka", courseName: "State" },
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

const PAGE_SIZE = 10;

export function SyllabusSettingsPage() {
  const [rows, setRows] = useState<SyllabusRow[]>(INITIAL_ROWS);
  const [boardName, setBoardName] = useState("none");
  const [courseName, setCourseName] = useState("none");
  const [syllabusName, setSyllabusName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    boardName: false,
    courseName: false,
    syllabusName: false,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const syllabusRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [row.syllabusName, row.boardName, row.courseName].join(" ").toLowerCase().includes(query),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const resetForm = () => {
    setBoardName("none");
    setCourseName("none");
    setSyllabusName("");
    setEditingId(null);
    setErrors({ boardName: false, courseName: false, syllabusName: false });
  };

  const handleSave = () => {
    const nextErrors = {
      boardName: boardName === "none",
      courseName: courseName === "none",
      syllabusName: !syllabusName.trim(),
    };
    setErrors(nextErrors);
    if (nextErrors.boardName || nextErrors.courseName || nextErrors.syllabusName) {
      toast.error("Please fill all required fields");
      syllabusRef.current?.focus();
      return;
    }

    const trimmed = syllabusName.trim();
    const duplicate = rows.some(
      (row) =>
        row.syllabusName.toLowerCase() === trimmed.toLowerCase() &&
        row.boardName === boardName &&
        row.courseName === courseName &&
        row.id !== editingId,
    );
    if (duplicate) {
      toast.error("Syllabus already exists for this board and course");
      return;
    }

    if (editingId) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingId
            ? {
                ...row,
                syllabusName: trimmed,
                boardName,
                courseName,
              }
            : row,
        ),
      );
      toast.success("Syllabus updated");
    } else {
      setRows((current) => [
        {
          id: `syl-${Date.now()}`,
          syllabusName: trimmed,
          boardName,
          courseName,
        },
        ...current,
      ]);
      toast.success("Syllabus saved");
    }

    resetForm();
    setPage(1);
  };

  const handleEdit = (row: SyllabusRow) => {
    setEditingId(row.id);
    setBoardName(row.boardName);
    setCourseName(row.courseName);
    setSyllabusName(row.syllabusName);
    setErrors({ boardName: false, courseName: false, syllabusName: false });
    syllabusRef.current?.focus();
  };

  const handleDelete = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    if (editingId === id) resetForm();
    toast.success("Syllabus deleted");
  };

  const handleAddNew = () => {
    resetForm();
    syllabusRef.current?.focus();
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered
        .map((row) => `${row.syllabusName}\t${row.boardName}\t${row.courseName}`)
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Syllabus list copied"),
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
            {editingId ? "Edit Syllabus" : "Add Syllabus"}
          </h2>

          <div className="mt-5 space-y-4">
            <label className="block space-y-1.5 text-sm text-foreground">
              <span>
                Board/University<span className="text-danger">*</span>
              </span>
              <Select
                value={boardName}
                onValueChange={(value) => {
                  setBoardName(value);
                  setErrors((current) => ({ ...current, boardName: false }));
                }}
              >
                <SelectTrigger
                  className="h-9 bg-card"
                  aria-label="Board/University"
                  aria-invalid={errors.boardName}
                >
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">--Select--</SelectItem>
                  {BOARD_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.boardName ? (
                <span className="text-sm text-danger">Board/University is required</span>
              ) : null}
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>
                Course<span className="text-danger">*</span>
              </span>
              <Select
                value={courseName}
                onValueChange={(value) => {
                  setCourseName(value);
                  setErrors((current) => ({ ...current, courseName: false }));
                }}
              >
                <SelectTrigger
                  className="h-9 bg-card"
                  aria-label="Course"
                  aria-invalid={errors.courseName}
                >
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">--Select--</SelectItem>
                  {COURSE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.courseName ? (
                <span className="text-sm text-danger">Course is required</span>
              ) : null}
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>
                Branch/Syllabus<span className="text-danger">*</span>
              </span>
              <Input
                ref={syllabusRef}
                value={syllabusName}
                onChange={(event) => {
                  setSyllabusName(event.target.value);
                  if (event.target.value.trim()) {
                    setErrors((current) => ({ ...current, syllabusName: false }));
                  }
                }}
                className="h-9 bg-card"
                aria-label="Branch/Syllabus"
                aria-invalid={errors.syllabusName}
              />
              {errors.syllabusName ? (
                <span className="text-sm text-danger">Branch/Syllabus is required</span>
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
          <h2 className="text-lg font-semibold text-foreground">Syllabus List</h2>

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
                aria-label="Search syllabus"
              />
            </label>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-xs font-bold">Syllabus Name</TableHead>
                    <TableHead className="text-xs font-bold">Board Name</TableHead>
                    <TableHead className="text-xs font-bold">Course Name</TableHead>
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
                        <TableCell className="font-medium">{row.syllabusName}</TableCell>
                        <TableCell>{row.boardName}</TableCell>
                        <TableCell>{row.courseName}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            type="button"
                            size="icon"
                            className="size-8 rounded-full bg-info text-white hover:bg-info/90"
                            aria-label={`Edit ${row.syllabusName}`}
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
                            aria-label={`Delete ${row.syllabusName}`}
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
        aria-label="Add New Syllabus"
      >
        <Plus className="size-5" />
        Add New
      </Button>
    </div>
  );
}
