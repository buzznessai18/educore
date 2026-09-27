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

type HouseRow = {
  id: string;
  name: string;
};

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

const PAGE_SIZE = 10;

export function HouseMasterSettingsPage() {
  const [rows, setRows] = useState<HouseRow[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showRequired, setShowRequired] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const nameRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) => row.name.toLowerCase().includes(query));
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
      toast.error("House Master is required");
      nameRef.current?.focus();
      return;
    }

    const duplicate = rows.some(
      (row) => row.name.toLowerCase() === trimmed.toLowerCase() && row.id !== editingId,
    );
    if (duplicate) {
      toast.error("House Master already exists");
      return;
    }

    if (editingId) {
      setRows((current) =>
        current.map((row) => (row.id === editingId ? { ...row, name: trimmed } : row)),
      );
      toast.success("House Master updated");
    } else {
      setRows((current) => [{ id: `house-${Date.now()}`, name: trimmed }, ...current]);
      toast.success("House Master saved");
    }

    resetForm();
    setPage(1);
  };

  const handleEdit = (row: HouseRow) => {
    setEditingId(row.id);
    setName(row.name);
    setShowRequired(false);
    nameRef.current?.focus();
  };

  const handleNew = () => {
    resetForm();
    nameRef.current?.focus();
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered.map((row) => row.name).join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("House Master list copied"),
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
            {editingId ? "Edit House Master" : "House Master"}
          </h2>

          <div className="mt-5 space-y-4">
            <label className="block space-y-1.5 text-sm text-foreground">
              <span>
                House Master<span className="text-danger">*</span>
              </span>
              <Input
                ref={nameRef}
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (event.target.value.trim()) setShowRequired(false);
                }}
                className="h-9 bg-card"
                aria-label="House Master"
                aria-invalid={showRequired}
              />
              {showRequired ? (
                <span className="text-sm text-danger">House Master is required</span>
              ) : null}
            </label>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                className="h-9 rounded-md bg-info px-8 text-sm font-semibold text-white hover:bg-info/90"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
          <h2 className="text-lg font-semibold text-foreground">House Master List</h2>

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
                aria-label="Search house masters"
              />
            </label>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-xs font-bold">House Master</TableHead>
                    <TableHead className="w-28 text-center text-xs font-bold">Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="h-24 text-center text-sm text-muted-foreground">
                        No data available in table
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageRows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        className={cn(index % 2 === 1 ? "bg-info-soft/50" : "bg-card")}
                      >
                        <TableCell className="font-medium">{row.name}</TableCell>
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
        className="fixed bottom-6 right-6 z-20 h-12 gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary-hover"
        onClick={handleNew}
        aria-label="New House Master"
      >
        <Plus className="size-5" />
        New
      </Button>
    </div>
  );
}
