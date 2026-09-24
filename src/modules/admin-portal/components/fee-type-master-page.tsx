import { useMemo, useState } from "react";
import { Copy, FileSpreadsheet, FileText, Pencil, Printer, X } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
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
  type ActionPill,
} from "@/modules/admin-portal/components/admission-action-pills";
import { EXPORT_ACTIONS, type ExportAction } from "@/modules/admin-portal/constants";
import { cn } from "@/lib/utils";

type FeeTypeRow = {
  id: string;
  name: string;
  description: string;
  hideOnDashboard: boolean;
};

const FMS_ACTION_PILLS: ActionPill[] = [
  { label: "Fee Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Day Book Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Fee Pending Report", tone: "green", href: "/fms/fee-pending-report" },
  { label: "Fee Print List", tone: "green", href: "/fms/fee-print-list" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Reports", tone: "blue", href: "/fms/fee-pending-report", dropdown: true },
  { label: "Transaction", tone: "blue", href: "/fms/fee-receipt", dropdown: true },
];

const INITIAL_ROWS: FeeTypeRow[] = [
  { id: "ft-1", name: "ADDITIONAL", description: "ACADEMIC", hideOnDashboard: false },
  { id: "ft-2", name: "MISCELLANEOUS", description: "Other Fees", hideOnDashboard: false },
  { id: "ft-3", name: "STD", description: "ACADEMIC", hideOnDashboard: false },
  { id: "ft-4", name: "TRANSPORT", description: "TRANSPORT", hideOnDashboard: false },
  { id: "ft-5", name: "TRUST", description: "TRUST", hideOnDashboard: true },
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

const PAGE_SIZE = 5;

export function FeeTypeMasterPage() {
  const [rows, setRows] = useState<FeeTypeRow[]>(INITIAL_ROWS);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hideOnDashboard, setHideOnDashboard] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [row.name, row.description].join(" ").toLowerCase().includes(query),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const resetForm = () => {
    setName("");
    setDescription("");
    setHideOnDashboard(false);
    setEditingId(null);
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    if (!trimmedName || !trimmedDescription) {
      toast.error("FeeType Name and FeeType Description are required");
      return;
    }

    if (editingId) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingId
            ? {
                ...row,
                name: trimmedName.toUpperCase(),
                description: trimmedDescription,
                hideOnDashboard,
              }
            : row,
        ),
      );
      toast.success("Fee type updated");
    } else {
      setRows((current) => [
        {
          id: `ft-${Date.now()}`,
          name: trimmedName.toUpperCase(),
          description: trimmedDescription,
          hideOnDashboard,
        },
        ...current,
      ]);
      toast.success("Fee type saved");
    }

    resetForm();
    setPage(1);
  };

  const handleEdit = (row: FeeTypeRow) => {
    setEditingId(row.id);
    setName(row.name);
    setDescription(row.description);
    setHideOnDashboard(row.hideOnDashboard);
  };

  const handleDelete = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    if (editingId === id) resetForm();
    toast.success("Fee type deleted");
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered.map((row) => `${row.name}\t${row.description}`).join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("FeeType list copied"),
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
    <div className="mx-auto max-w-[1200px] space-y-4 pb-10">
      <div className="flex flex-wrap items-start justify-end gap-3">
        <ActionPills items={FMS_ACTION_PILLS} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="rounded-sm border border-[#d7e3ec] bg-white p-5 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-[#111827]">
              {editingId ? "Edit FeeType" : "Add FeeType"}
            </h2>
            <p className="text-sm text-[#6b7280]">
              Home <span className="mx-1 text-[#9ca3af]">&gt;</span>{" "}
              {editingId ? "Edit FeeType" : "Add FeeType"}
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block space-y-1.5 text-sm text-[#111827]">
              <span>
                FeeType Name<span className="text-[#e53935]">*</span>
              </span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-9 bg-white"
                aria-label="FeeType Name"
              />
            </label>

            <label className="block space-y-1.5 text-sm text-[#111827]">
              <span>
                FeeType Description<span className="text-[#e53935]">*</span>
              </span>
              <Input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="h-9 bg-white"
                aria-label="FeeType Description"
              />
            </label>

            <label className="flex items-center justify-between gap-3 text-sm text-[#111827]">
              <span>Don&apos;t Show on Dashboard</span>
              <Switch
                checked={hideOnDashboard}
                onCheckedChange={setHideOnDashboard}
                aria-label="Don't show on dashboard"
                className="data-[state=checked]:bg-[#03a9f4]"
              />
            </label>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                type="button"
                className="h-9 rounded-sm bg-[#03a9f4] px-5 text-sm font-semibold text-white hover:bg-[#0288d1]"
                onClick={handleSave}
              >
                Save
              </Button>
              {editingId ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-sm"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-sm border border-[#d7e3ec] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#111827]">FeeType List</h2>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {EXPORT_ACTIONS.map((action) => {
                const Icon = exportIcons[action];
                return (
                  <Button
                    key={action}
                    type="button"
                    size="sm"
                    className="h-8 rounded-sm bg-[#03a9f4] px-3 text-xs font-semibold text-white hover:bg-[#0288d1]"
                    onClick={() => handleExport(action)}
                  >
                    <Icon className="size-3.5" />
                    {action}
                  </Button>
                );
              })}
            </div>
            <label className="flex items-center gap-2 text-sm text-[#374151]">
              <span>Search:</span>
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="h-8 w-44 bg-white"
                aria-label="Search fee types"
              />
            </label>
          </div>

          <div className="mt-4 overflow-hidden rounded-sm border border-[#dbe3ea]">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                    <TableHead className="text-xs font-bold">FeeType Name</TableHead>
                    <TableHead className="text-xs font-bold">FeeType Description</TableHead>
                    <TableHead className="text-center text-xs font-bold">Edit</TableHead>
                    <TableHead className="text-center text-xs font-bold">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-sm text-[#6b7280]">
                        No data available in table
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageRows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        className={cn(index % 2 === 1 ? "bg-[#f3f9fc]" : "bg-white")}
                      >
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            type="button"
                            size="icon"
                            className="size-8 rounded-full bg-[#03a9f4] text-white hover:bg-[#0288d1]"
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
                            className="size-8 rounded-full bg-[#e53935] text-white hover:bg-[#c62828]"
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

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#6b7280]">
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
