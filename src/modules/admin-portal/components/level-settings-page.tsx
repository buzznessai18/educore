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

type LevelRow = {
  id: string;
  combinationName: string;
  syllabusName: string;
};

const SYLLABUS_OPTIONS = ["State"];

const INITIAL_ROWS: LevelRow[] = [
  { id: "lvl-1", combinationName: "High", syllabusName: "State" },
  { id: "lvl-2", combinationName: "Pre Primary", syllabusName: "State" },
  { id: "lvl-3", combinationName: "Primary", syllabusName: "State" },
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

const PAGE_SIZE = 10;

export function LevelSettingsPage() {
  const [rows, setRows] = useState<LevelRow[]>(INITIAL_ROWS);
  const [syllabusName, setSyllabusName] = useState("none");
  const [levelName, setLevelName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState({ syllabusName: false, levelName: false });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const levelRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [row.combinationName, row.syllabusName].join(" ").toLowerCase().includes(query),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const resetForm = () => {
    setSyllabusName("none");
    setLevelName("");
    setEditingId(null);
    setErrors({ syllabusName: false, levelName: false });
  };

  const handleSave = () => {
    const nextErrors = {
      syllabusName: syllabusName === "none",
      levelName: !levelName.trim(),
    };
    setErrors(nextErrors);
    if (nextErrors.syllabusName || nextErrors.levelName) {
      toast.error("Please fill all required fields");
      levelRef.current?.focus();
      return;
    }

    const trimmed = levelName.trim();
    const duplicate = rows.some(
      (row) =>
        row.combinationName.toLowerCase() === trimmed.toLowerCase() &&
        row.syllabusName === syllabusName &&
        row.id !== editingId,
    );
    if (duplicate) {
      toast.error("Level already exists for this syllabus");
      return;
    }

    if (editingId) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingId
            ? { ...row, combinationName: trimmed, syllabusName }
            : row,
        ),
      );
      toast.success("Level updated");
    } else {
      setRows((current) => [
        {
          id: `lvl-${Date.now()}`,
          combinationName: trimmed,
          syllabusName,
        },
        ...current,
      ]);
      toast.success("Level saved");
    }

    resetForm();
    setPage(1);
  };

  const handleEdit = (row: LevelRow) => {
    setEditingId(row.id);
    setSyllabusName(row.syllabusName);
    setLevelName(row.combinationName);
    setErrors({ syllabusName: false, levelName: false });
    levelRef.current?.focus();
  };

  const handleDelete = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    if (editingId === id) resetForm();
    toast.success("Level deleted");
  };

  const handleAddNew = () => {
    resetForm();
    levelRef.current?.focus();
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered
        .map((row) => `${row.combinationName}\t${row.syllabusName}`)
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Level list copied"),
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
            {editingId ? "Edit Level/Combination" : "Add Level/Combination"}
          </h2>

          <div className="mt-5 space-y-4">
            <label className="block space-y-1.5 text-sm text-foreground">
              <span>Syllabus</span>
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
              <span>Level</span>
              <Input
                ref={levelRef}
                value={levelName}
                onChange={(event) => {
                  setLevelName(event.target.value);
                  if (event.target.value.trim()) {
                    setErrors((current) => ({ ...current, levelName: false }));
                  }
                }}
                className="h-9 bg-card"
                aria-label="Level"
                aria-invalid={errors.levelName}
              />
              {errors.levelName ? (
                <span className="text-sm text-danger">Level is required</span>
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
          <h2 className="text-lg font-semibold text-foreground">Level/Combination List</h2>

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
                aria-label="Search levels"
              />
            </label>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-xs font-bold">Combination Name</TableHead>
                    <TableHead className="text-xs font-bold">Syllabus Name</TableHead>
                    <TableHead className="w-24 text-center text-xs font-bold">Edit</TableHead>
                    <TableHead className="w-24 text-center text-xs font-bold">Delete</TableHead>
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
                        <TableCell className="font-medium">{row.combinationName}</TableCell>
                        <TableCell>{row.syllabusName}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            type="button"
                            size="icon"
                            className="size-8 rounded-full bg-info text-white hover:bg-info/90"
                            aria-label={`Edit ${row.combinationName}`}
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
                            aria-label={`Delete ${row.combinationName}`}
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
        aria-label="Add New Level"
      >
        <Plus className="size-5" />
        Add New
      </Button>
    </div>
  );
}
