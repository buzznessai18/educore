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
import { EXPORT_ACTIONS, type ExportAction } from "@/modules/admin-portal/constants";
import { cn } from "@/lib/utils";

type CancelledFeeRow = {
  id: string;
  rollNo: string;
  studentName: string;
  fatherName: string;
  feeReceiptNo: string;
  amount: string;
  remarks: string;
  year: string;
};

const CANCELLED_FEE_PILLS: ActionPill[] = [
  { label: "Fee Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Day Book Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Fee Pending Report", tone: "green", href: "/fms/fee-pending-report" },
  { label: "Fee Print List", tone: "green", href: "/fms/fee-print-list" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Reports", tone: "blue", href: "/fms/fee-pending-report", dropdown: true },
  { label: "Transaction", tone: "blue", href: "/fms/fee-receipt", dropdown: true },
];

const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"];

const INITIAL_ROWS: CancelledFeeRow[] = [
  {
    id: "cf-1",
    rollNo: "N/A",
    studentName: "Sanaya Shekh",
    fatherName: "Imran Shekh",
    feeReceiptNo: "FRNO2026-37",
    amount: "3000",
    remarks: "Due to Class Change",
    year: "2026",
  },
  {
    id: "cf-2",
    rollNo: "N/A",
    studentName: "Ayaan Pathan",
    fatherName: "Rizwan Pathan",
    feeReceiptNo: "FRNO2026-41",
    amount: "4500",
    remarks: "date entry is round",
    year: "2026",
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

export function CancelledFeeListPage() {
  const [receiptNo, setReceiptNo] = useState("all");
  const [academicYear, setAcademicYear] = useState("2026");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return INITIAL_ROWS.filter((row) => {
      if (academicYear !== "none" && row.year !== academicYear) return false;
      if (receiptNo !== "all" && row.feeReceiptNo !== receiptNo) return false;
      if (!query) return true;
      return [row.studentName, row.fatherName, row.feeReceiptNo, row.amount, row.remarks]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [academicYear, receiptNo, search]);

  const receiptOptions = useMemo(
    () => Array.from(new Set(INITIAL_ROWS.map((row) => row.feeReceiptNo))),
    [],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered
        .map(
          (row) =>
            `${row.rollNo}\t${row.studentName}\t${row.fatherName}\t${row.feeReceiptNo}\t${row.amount}\t${row.remarks}`,
        )
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Cancelled fee list copied"),
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#03a9f4]">Cancel Fee Print List</h2>
          <p className="text-sm text-[#6b7280]">
            Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Cancel Fee Print List
          </p>
        </div>
        <ActionPills items={CANCELLED_FEE_PILLS} />
      </div>

      <div className="rounded-sm border border-[#d7e3ec] bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-xl">
          <label className="block space-y-1.5 text-sm text-[#111827]">
            <span>Cancel Receipt No</span>
            <Select
              value={receiptNo}
              onValueChange={(value) => {
                setReceiptNo(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 bg-white" aria-label="Cancel Receipt No">
                <SelectValue placeholder="--Select--" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">--Select--</SelectItem>
                {receiptOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="block space-y-1.5 text-sm text-[#111827]">
            <span>Academic year</span>
            <Select
              value={academicYear}
              onValueChange={(value) => {
                setAcademicYear(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 bg-white" aria-label="Academic year">
                <SelectValue placeholder="--Select--" />
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
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
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
              aria-label="Search cancelled fees"
            />
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-sm border border-[#dbe3ea]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                  <TableHead className="text-xs font-bold">Roll No</TableHead>
                  <TableHead className="text-xs font-bold">Student Name</TableHead>
                  <TableHead className="text-xs font-bold">Father&apos;s Name</TableHead>
                  <TableHead className="text-xs font-bold">Fee Receipt No</TableHead>
                  <TableHead className="text-xs font-bold">Amount</TableHead>
                  <TableHead className="text-xs font-bold">Remarks</TableHead>
                  <TableHead className="text-center text-xs font-bold">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-sm text-[#6b7280]">
                      No data available in table
                    </TableCell>
                  </TableRow>
                ) : (
                  pageRows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={cn(index % 2 === 1 ? "bg-[#f3f9fc]" : "bg-white")}
                    >
                      <TableCell>{row.rollNo}</TableCell>
                      <TableCell className="font-medium">{row.studentName}</TableCell>
                      <TableCell>{row.fatherName}</TableCell>
                      <TableCell>{row.feeReceiptNo}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>{row.remarks}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          size="sm"
                          className="h-8 rounded-sm bg-[#03a9f4] px-3 text-xs font-semibold text-white hover:bg-[#0288d1]"
                          onClick={() => {
                            toast.success(`Printing cancelled receipt ${row.feeReceiptNo}`);
                            window.print();
                          }}
                        >
                          Print Fee
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
      </div>
    </div>
  );
}
