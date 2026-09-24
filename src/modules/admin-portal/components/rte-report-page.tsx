import { useMemo, useState } from "react";
import { Copy, FileSpreadsheet, FileText, Printer } from "lucide-react";
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
  type ActionPill,
} from "@/modules/admin-portal/components/admission-action-pills";
import { CLASS_OPTIONS, EXPORT_ACTIONS, type ExportAction } from "@/modules/admin-portal/constants";
import { cn } from "@/lib/utils";

type RteRow = {
  id: string;
  rollNo: string;
  name: string;
  totalFee: string;
  paidAmount: string;
  balance: string;
  status: string;
  year: string;
  combination: string;
  classId: string;
};

const RTE_PILLS: ActionPill[] = [
  { label: "Fee Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Day Book Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Fee Pending Report", tone: "green", href: "/fms/fee-pending-report" },
  { label: "Fee Print List", tone: "green", href: "/fms/fee-print-list" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Reports", tone: "blue", href: "/fms/rte-report", dropdown: true },
  { label: "Transaction", tone: "blue", href: "/fms/fee-receipt", dropdown: true },
];

const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"];
const COMBINATION_OPTIONS = [
  { value: "all", label: "All" },
  { value: "general", label: "General" },
  { value: "science", label: "Science" },
  { value: "commerce", label: "Commerce" },
];

const SAMPLE_ROWS: RteRow[] = [
  {
    id: "rte-1",
    rollNo: "RTE-01",
    name: "ISHAAN VERMA",
    totalFee: "0",
    paidAmount: "0",
    balance: "0",
    status: "Exempt",
    year: "2026",
    combination: "general",
    classId: "class-8",
  },
  {
    id: "rte-2",
    rollNo: "RTE-02",
    name: "AANYA JAIN",
    totalFee: "0",
    paidAmount: "0",
    balance: "0",
    status: "Exempt",
    year: "2026",
    combination: "general",
    classId: "nursery",
  },
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

const PAGE_SIZE = 10;

export function RteReportPage() {
  const [year, setYear] = useState("2026");
  const [combination, setCombination] = useState("all");
  const [classId, setClassId] = useState("all");
  const [search, setSearch] = useState("");
  const [hasShown, setHasShown] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!hasShown) return [];
    const query = search.trim().toLowerCase();
    return SAMPLE_ROWS.filter((row) => {
      if (row.year !== year) return false;
      if (combination !== "all" && row.combination !== combination) return false;
      if (classId !== "all" && row.classId !== classId) return false;
      if (!query) return true;
      return [row.rollNo, row.name, row.status, row.totalFee, row.paidAmount, row.balance]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [classId, combination, hasShown, search, year]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const handleShow = () => {
    setHasShown(true);
    setPage(1);
    toast.success("RTE report loaded");
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      if (filtered.length === 0) {
        toast.message("No data available to copy");
        return;
      }
      const text = filtered
        .map(
          (row, index) =>
            `${index + 1}\t${row.rollNo}\t${row.name}\t${row.totalFee}\t${row.paidAmount}\t${row.balance}\t${row.status}`,
        )
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("RTE report copied"),
        () => toast.error("Unable to copy report"),
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Home <span className="mx-1 text-muted-foreground/70">&gt;</span> RTE Report
        </p>
        <ActionPills items={RTE_PILLS} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-enterprise-sm">
        <div className="bg-info px-4 py-2.5">
          <h2 className="text-sm font-semibold text-white">RTE Report</h2>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid gap-4 md:grid-cols-[180px_180px_220px_auto] md:items-end">
            <label className="block space-y-1.5 text-sm text-foreground">
              <span>Year</span>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="h-9 bg-card" aria-label="Year">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEAR_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>Combination</span>
              <Select value={combination} onValueChange={setCombination}>
                <SelectTrigger className="h-9 bg-card" aria-label="Combination">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMBINATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>Class</span>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger className="h-9 bg-card" aria-label="Class">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {CLASS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <Button
              type="button"
              className="h-9 rounded-md bg-info px-5 text-sm font-semibold text-white hover:bg-info/90"
              onClick={handleShow}
            >
              Show
            </Button>
          </div>

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
                aria-label="Search RTE report"
              />
            </label>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-xs font-bold">Sl.No</TableHead>
                    <TableHead className="text-xs font-bold">Roll No</TableHead>
                    <TableHead className="text-xs font-bold">Name</TableHead>
                    <TableHead className="text-xs font-bold">Total Fee</TableHead>
                    <TableHead className="text-xs font-bold">Paid Amount</TableHead>
                    <TableHead className="text-xs font-bold">Balance</TableHead>
                    <TableHead className="text-xs font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!hasShown || pageRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                        No data available in table
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageRows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        className={cn(index % 2 === 1 ? "bg-info-soft/50" : "bg-card")}
                      >
                        <TableCell>{(currentPage - 1) * PAGE_SIZE + index + 1}</TableCell>
                        <TableCell>{row.rollNo}</TableCell>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{row.totalFee}</TableCell>
                        <TableCell>{row.paidAmount}</TableCell>
                        <TableCell>{row.balance}</TableCell>
                        <TableCell>{row.status}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
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
      </div>
    </div>
  );
}
