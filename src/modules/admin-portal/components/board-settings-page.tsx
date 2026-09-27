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

type BoardRow = {
  id: string;
  boardId: number;
  name: string;
};

const INITIAL_ROWS: BoardRow[] = [{ id: "board-1", boardId: 1, name: "Karnataka" }];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

const PAGE_SIZE = 10;

export function BoardSettingsPage() {
  const [rows, setRows] = useState<BoardRow[]>(INITIAL_ROWS);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showRequired, setShowRequired] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const nameRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [String(row.boardId), row.name].join(" ").toLowerCase().includes(query),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const resetForm = () => {
    setName("");
    setEditingId(null);
    setShowRequired(false);
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setShowRequired(true);
      toast.error("Board is required");
      nameRef.current?.focus();
      return;
    }

    const duplicate = rows.some(
      (row) => row.name.toLowerCase() === trimmed.toLowerCase() && row.id !== editingId,
    );
    if (duplicate) {
      toast.error("Board already exists");
      return;
    }

    if (editingId) {
      setRows((current) =>
        current.map((row) => (row.id === editingId ? { ...row, name: trimmed } : row)),
      );
      toast.success("Board updated");
    } else {
      const nextId = rows.reduce((max, row) => Math.max(max, row.boardId), 0) + 1;
      setRows((current) => [
        { id: `board-${Date.now()}`, boardId: nextId, name: trimmed },
        ...current,
      ]);
      toast.success("Board saved");
    }

    resetForm();
    setPage(1);
  };

  const handleEdit = (row: BoardRow) => {
    setEditingId(row.id);
    setName(row.name);
    setShowRequired(false);
    nameRef.current?.focus();
  };

  const handleDelete = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    if (editingId === id) resetForm();
    toast.success("Board deleted");
  };

  const handleAddNew = () => {
    resetForm();
    nameRef.current?.focus();
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered.map((row) => `${row.boardId}\t${row.name}`).join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Board list copied"),
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
    <div className="relative mx-auto max-w-[1400px] space-y-4 pb-10">
      <ActionPills items={SETTINGS_MASTER_PILLS} className="justify-start" />

      <div className="grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
          <h2 className="text-lg font-semibold text-foreground">
            {editingId ? "Edit Board" : "Add Board"}
          </h2>

          <div className="mt-5 space-y-4">
            <label className="block space-y-1.5 text-sm text-foreground">
              <span>University / Board</span>
              <Input
                ref={nameRef}
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (event.target.value.trim()) setShowRequired(false);
                }}
                className="h-9 bg-card"
                aria-label="University / Board"
                aria-invalid={showRequired}
              />
              {showRequired ? <span className="text-sm text-danger">Board is required</span> : null}
            </label>

            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <Button
                type="button"
                className="h-9 rounded-md bg-info px-8 text-sm font-semibold text-white hover:bg-info/90"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                className="h-9 gap-1.5 rounded-md bg-success px-5 text-sm font-semibold text-white hover:bg-success/90"
                onClick={handleAddNew}
              >
                <Plus className="size-4" />
                Add New
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
          <h2 className="text-lg font-semibold text-foreground">University / Board List</h2>

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
                aria-label="Search boards"
              />
            </label>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-xs font-bold">University ID/Board ID</TableHead>
                    <TableHead className="text-xs font-bold">University Name/Board Name</TableHead>
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
                        <TableCell className="font-medium">{row.boardId}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            type="button"
                            size="icon"
                            className="size-8 rounded-full bg-info text-white hover:bg-info/90"
                            aria-label={`Edit ${row.name}`}
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
                            aria-label={`Delete ${row.name}`}
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
    </div>
  );
}
