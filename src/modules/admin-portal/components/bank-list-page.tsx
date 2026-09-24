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
  type ActionPill,
} from "@/modules/admin-portal/components/admission-action-pills";
import {
  ACADEMIC_YEAR_OPTIONS,
  EXPORT_ACTIONS,
  type ExportAction,
} from "@/modules/admin-portal/constants";
import { cn } from "@/lib/utils";

type BankRow = {
  id: string;
  bankId: number;
  bankName: string;
  ifscCode: string;
  year: string;
};

const BANK_ACTION_PILLS: ActionPill[] = [
  { label: "Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Payment", tone: "green" },
  { label: "Application Receipt", tone: "green" },
  { label: "Ledger Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Journal", tone: "light-green" },
  { label: "Contra", tone: "light-green" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Reports", tone: "blue", href: "/fms/fee-pending-report", dropdown: true },
  { label: "Transaction", tone: "blue", href: "/fms/fee-receipt", dropdown: true },
];

const INITIAL_ROWS: BankRow[] = [
  { id: "bank-1", bankId: 1, bankName: "BANK ACCOUNT", ifscCode: "0000", year: "2026" },
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

const PAGE_SIZE = 10;

export function BankListPage() {
  const [rows, setRows] = useState<BankRow[]>(INITIAL_ROWS);
  const [year, setYear] = useState("none");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [bankName, setBankName] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (year !== "none" && row.year !== year) return false;
      if (!query) return true;
      return [String(row.bankId), row.bankName, row.ifscCode].join(" ").toLowerCase().includes(query);
    });
  }, [rows, search, year]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const openAdd = () => {
    setEditingId(null);
    setBankName("");
    setIfscCode("");
    setDialogOpen(true);
  };

  const openEdit = (row: BankRow) => {
    setEditingId(row.id);
    setBankName(row.bankName);
    setIfscCode(row.ifscCode);
    setDialogOpen(true);
  };

  const handleSave = () => {
    const trimmedName = bankName.trim();
    const trimmedIfsc = ifscCode.trim();
    if (!trimmedName || !trimmedIfsc) {
      toast.error("Bank Name and IFSC Code are required");
      return;
    }

    if (editingId) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingId
            ? { ...row, bankName: trimmedName.toUpperCase(), ifscCode: trimmedIfsc.toUpperCase() }
            : row,
        ),
      );
      toast.success("Bank updated");
    } else {
      const nextId = rows.reduce((max, row) => Math.max(max, row.bankId), 0) + 1;
      setRows((current) => [
        ...current,
        {
          id: `bank-${Date.now()}`,
          bankId: nextId,
          bankName: trimmedName.toUpperCase(),
          ifscCode: trimmedIfsc.toUpperCase(),
          year: year === "none" ? "2026" : year,
        },
      ]);
      toast.success("Bank saved");
    }

    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    toast.success("Bank deleted");
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered
        .map((row) => `${row.bankId}\t${row.bankName}\t${row.ifscCode}`)
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Bank list copied"),
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
    <div className="relative mx-auto max-w-[1200px] space-y-4 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-info">Bank List</h2>
          <p className="text-sm text-muted-foreground">
            Home <span className="mx-1 text-muted-foreground/70">&gt;</span> Bank List
          </p>
        </div>
        <ActionPills items={BANK_ACTION_PILLS} />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
        <label className="block max-w-[220px] space-y-1.5 text-sm text-foreground">
          <span>
            Year<span className="text-danger">*</span>
          </span>
          <Select
            value={year}
            onValueChange={(value) => {
              setYear(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 bg-card" aria-label="Year">
              <SelectValue placeholder="--Select--" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">--Select--</SelectItem>
              {ACADEMIC_YEAR_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
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
              aria-label="Search banks"
            />
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs font-bold">Bank Id</TableHead>
                  <TableHead className="text-xs font-bold">Bank Name</TableHead>
                  <TableHead className="text-xs font-bold">IFSC Code</TableHead>
                  <TableHead className="text-center text-xs font-bold">Edit</TableHead>
                  <TableHead className="text-center text-xs font-bold">Delete</TableHead>
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
                      <TableCell>{row.bankId}</TableCell>
                      <TableCell className="font-medium">{row.bankName}</TableCell>
                      <TableCell>{row.ifscCode}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          size="icon"
                          className="size-8 rounded-full bg-info text-white hover:bg-info/90"
                          aria-label={`Edit ${row.bankName}`}
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
                          aria-label={`Delete ${row.bankName}`}
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
      </div>

      <Button
        type="button"
        size="icon"
        className="fixed bottom-8 right-8 z-20 size-12 rounded-full bg-success text-white shadow-lg hover:bg-success/90"
        aria-label="Add bank"
        onClick={openAdd}
      >
        <Plus className="size-6" />
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Bank" : "Add Bank"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <label className="block space-y-1.5 text-sm">
              <span>
                Bank Name<span className="text-danger">*</span>
              </span>
              <Input
                value={bankName}
                onChange={(event) => setBankName(event.target.value)}
                aria-label="Bank Name"
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>
                IFSC Code<span className="text-danger">*</span>
              </span>
              <Input
                value={ifscCode}
                onChange={(event) => setIfscCode(event.target.value)}
                aria-label="IFSC Code"
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
