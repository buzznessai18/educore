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

type DesignationRow = {
  id: string;
  designationCode: string;
  designationName: string;
};

const INITIAL_ROWS: DesignationRow[] = [
  { id: "desig-1", designationCode: "1", designationName: "ADMIN" },
  { id: "desig-2", designationCode: "2", designationName: "Head Master" },
  { id: "desig-3", designationCode: "3", designationName: "Teacher" },
  { id: "desig-4", designationCode: "04", designationName: "Chairman" },
  { id: "desig-5", designationCode: "05", designationName: "Secretary" },
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

const PAGE_SIZE = 10;

export function DesignationMasterListPage() {
  const [rows, setRows] = useState<DesignationRow[]>(INITIAL_ROWS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [designationCode, setDesignationCode] = useState("");
  const [designationName, setDesignationName] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [row.designationCode, row.designationName].join(" ").toLowerCase().includes(query),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const openAdd = () => {
    setEditingId(null);
    setDesignationCode("");
    setDesignationName("");
    setDialogOpen(true);
  };

  const openEdit = (row: DesignationRow) => {
    setEditingId(row.id);
    setDesignationCode(row.designationCode);
    setDesignationName(row.designationName);
    setDialogOpen(true);
  };

  const handleSave = () => {
    const code = designationCode.trim();
    const name = designationName.trim();
    if (!code || !name) {
      toast.error("Designation Code and Designation Name are required");
      return;
    }

    const duplicate = rows.some(
      (row) =>
        (row.designationCode.toLowerCase() === code.toLowerCase() ||
          row.designationName.toLowerCase() === name.toLowerCase()) &&
        row.id !== editingId,
    );
    if (duplicate) {
      toast.error("Designation already exists");
      return;
    }

    if (editingId) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingId
            ? { ...row, designationCode: code, designationName: name }
            : row,
        ),
      );
      toast.success("Designation updated");
    } else {
      setRows((current) => [
        { id: `desig-${Date.now()}`, designationCode: code, designationName: name },
        ...current,
      ]);
      toast.success("Designation saved");
      setPage(1);
    }

    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    toast.success("Designation deleted");
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered
        .map((row) => `${row.designationCode}\t${row.designationName}`)
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Designation list copied"),
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Home <span className="mx-1 text-muted-foreground/70">&gt;</span> Designation List
        </p>
        <AcademicActionPills />
      </div>

      <section className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
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
              aria-label="Search designations"
            />
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs font-bold">Designation Code</TableHead>
                  <TableHead className="text-xs font-bold">Designation Name</TableHead>
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
                      <TableCell className="font-medium">{row.designationCode}</TableCell>
                      <TableCell>{row.designationName}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          size="icon"
                          className="size-8 rounded-full bg-info text-white hover:bg-info/90"
                          aria-label={`Edit ${row.designationName}`}
                          onClick={() => openEdit(row)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          size="icon"
                          className="size-8 rounded-full bg-danger text-white hover:bg-danger/90"
                          aria-label={`Delete ${row.designationName}`}
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
        aria-label="Add designation"
      >
        <Plus className="size-7" />
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Designation" : "Add Designation"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-1">
            <label className="space-y-1.5 text-sm">
              <span>Designation Code</span>
              <Input
                value={designationCode}
                onChange={(event) => setDesignationCode(event.target.value)}
                aria-label="Designation Code"
              />
            </label>
            <label className="space-y-1.5 text-sm">
              <span>Designation Name</span>
              <Input
                value={designationName}
                onChange={(event) => setDesignationName(event.target.value)}
                aria-label="Designation Name"
              />
            </label>
          </div>
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
