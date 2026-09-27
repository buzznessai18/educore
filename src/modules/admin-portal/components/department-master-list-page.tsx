import { useMemo, useState } from "react";
import { Copy, FileSpreadsheet, FileText, Pencil, Plus, Printer, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { AcademicActionPills } from "@/modules/admin-portal/components/admission-action-pills";
import { EXPORT_ACTIONS, type ExportAction } from "@/modules/admin-portal/constants";
import { cn } from "@/lib/utils";

type DepartmentRow = {
  id: string;
  departmentId: number;
  departmentName: string;
};

const INITIAL_ROWS: DepartmentRow[] = [
  { id: "dept-1", departmentId: 1, departmentName: "Non-Teaching" },
  { id: "dept-2", departmentId: 2, departmentName: "Teaching" },
  { id: "dept-3", departmentId: 3, departmentName: "Management" },
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

const PAGE_SIZE = 10;

export function DepartmentMasterListPage() {
  const [rows, setRows] = useState<DepartmentRow[]>(INITIAL_ROWS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [departmentName, setDepartmentName] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [String(row.departmentId), row.departmentName].join(" ").toLowerCase().includes(query),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const openAdd = () => {
    setEditingId(null);
    setDepartmentName("");
    setDialogOpen(true);
  };

  const openEdit = (row: DepartmentRow) => {
    setEditingId(row.id);
    setDepartmentName(row.departmentName);
    setDialogOpen(true);
  };

  const handleSave = () => {
    const trimmed = departmentName.trim();
    if (!trimmed) {
      toast.error("Department Name is required");
      return;
    }

    const duplicate = rows.some(
      (row) =>
        row.departmentName.toLowerCase() === trimmed.toLowerCase() && row.id !== editingId,
    );
    if (duplicate) {
      toast.error("Department already exists");
      return;
    }

    if (editingId) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingId ? { ...row, departmentName: trimmed } : row,
        ),
      );
      toast.success("Department updated");
    } else {
      const nextId = rows.reduce((max, row) => Math.max(max, row.departmentId), 0) + 1;
      setRows((current) => [
        { id: `dept-${Date.now()}`, departmentId: nextId, departmentName: trimmed },
        ...current,
      ]);
      toast.success("Department saved");
      setPage(1);
    }

    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    toast.success("Department deleted");
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered.map((row) => `${row.departmentId}\t${row.departmentName}`).join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Department list copied"),
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
      <div className="flex flex-wrap items-start justify-end gap-3">
        <AcademicActionPills />
      </div>

      <section className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Department List</h2>

        <div className="flex flex-wrap items-center justify-between gap-3">
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
              aria-label="Search departments"
            />
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs font-bold">Department ID</TableHead>
                  <TableHead className="text-xs font-bold">Department Name</TableHead>
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
                      <TableCell className="font-medium">{row.departmentId}</TableCell>
                      <TableCell>{row.departmentName}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          size="sm"
                          className="h-8 rounded-full bg-info px-4 text-xs font-semibold text-white hover:bg-info/90"
                          onClick={() => openEdit(row)}
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          size="icon"
                          className="size-8 rounded-full bg-danger text-white hover:bg-danger/90"
                          aria-label={`Delete ${row.departmentName}`}
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

      <Button
        type="button"
        size="icon"
        className="fixed bottom-6 right-6 z-20 size-14 rounded-full bg-success text-white shadow-lg hover:bg-success/90"
        onClick={openAdd}
        aria-label="Add department"
      >
        <Plus className="size-7" />
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Department" : "Add Department"}</DialogTitle>
          </DialogHeader>
          <label className="space-y-1.5 text-sm">
            <span>Department Name</span>
            <Input
              value={departmentName}
              onChange={(event) => setDepartmentName(event.target.value)}
              aria-label="Department Name"
            />
          </label>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-info text-white hover:bg-info/90"
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
