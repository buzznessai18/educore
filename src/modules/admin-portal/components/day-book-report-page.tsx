import { useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";

type DayBookRow = {
  id: string;
  date: string;
  voucherNo: string;
  particular: string;
  debit: string;
  credit: string;
  mode: string;
};

const DAY_BOOK_PILLS: ActionPill[] = [
  { label: "Fee Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Day Book Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Fee Pending Report", tone: "green", href: "/fms/fee-pending-report" },
  { label: "Fee Print List", tone: "green", href: "/fms/fee-print-list" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Reports", tone: "blue", href: "/fms/day-book-report", dropdown: true },
  { label: "Transaction", tone: "blue", href: "/fms/fee-receipt", dropdown: true },
];

const BOOK_TYPE_OPTIONS = ["School", "Trust", "Transport"];
const SIGNATURE_OPTIONS = ["Principal", "Accountant", "Admin Officer"];

const SAMPLE_ROWS: DayBookRow[] = [
  {
    id: "db-1",
    date: "25/Sep/2026",
    voucherNo: "DB-1001",
    particular: "Cash Fee Collection",
    debit: "38,400",
    credit: "0",
    mode: "Cash",
  },
  {
    id: "db-2",
    date: "25/Sep/2026",
    voucherNo: "DB-1002",
    particular: "UPI Fee Collection",
    debit: "82,100",
    credit: "0",
    mode: "UPI",
  },
  {
    id: "db-3",
    date: "25/Sep/2026",
    voucherNo: "DB-1003",
    particular: "Bank Deposit",
    debit: "0",
    credit: "1,20,500",
    mode: "Bank",
  },
];

export function DayBookReportPage() {
  const [fromDate, setFromDate] = useState("2026-09-25");
  const [toDate, setToDate] = useState("2026-09-25");
  const [bookType, setBookType] = useState("School");
  const [signature, setSignature] = useState("none");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select From Date and To Date");
      return;
    }
    setHasSearched(true);
    toast.success(`Day book loaded for ${bookType}`);
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#03a9f4]">Day Book Report</h2>
          <p className="text-sm text-[#6b7280]">
            Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Day Book Report
          </p>
        </div>
        <ActionPills items={DAY_BOOK_PILLS} />
      </div>

      <div className="overflow-hidden rounded-sm border border-[#d7e3ec] bg-white shadow-sm">
        <div className="bg-[#03a9f4] px-4 py-2.5">
          <h3 className="text-sm font-semibold text-white">Day Book Report</h3>
        </div>

        <div className="space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block space-y-1.5 text-sm text-[#111827]">
              <span>From Date</span>
              <Input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="h-9 bg-white"
                aria-label="From Date"
              />
            </label>

            <label className="block space-y-1.5 text-sm text-[#111827]">
              <span>To Date</span>
              <Input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="h-9 bg-white"
                aria-label="To Date"
              />
            </label>

            <label className="block space-y-1.5 text-sm text-[#111827]">
              <span>Book Type</span>
              <Select value={bookType} onValueChange={setBookType}>
                <SelectTrigger className="h-9 bg-white" aria-label="Book Type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BOOK_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="block space-y-1.5 text-sm text-[#111827]">
              <span>Authorised Signature</span>
              <Select value={signature} onValueChange={setSignature}>
                <SelectTrigger className="h-9 bg-white" aria-label="Authorised Signature">
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">--Select--</SelectItem>
                  {SIGNATURE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          <Button
            type="button"
            className="h-9 rounded-sm bg-[#03a9f4] px-5 text-sm font-semibold text-white hover:bg-[#0288d1]"
            onClick={handleSearch}
          >
            <Search className="size-4" />
            Search
          </Button>

          {hasSearched ? (
            <div className="overflow-hidden rounded-sm border border-[#dbe3ea]">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                      {["Date", "Voucher No", "Particular", "Debit", "Credit", "Mode"].map(
                        (heading) => (
                          <TableHead key={heading} className="text-xs font-bold">
                            {heading}
                          </TableHead>
                        ),
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SAMPLE_ROWS.map((row, index) => (
                      <TableRow
                        key={row.id}
                        className={cn(index % 2 === 1 ? "bg-[#f3f9fc]" : "bg-white")}
                      >
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.voucherNo}</TableCell>
                        <TableCell className="font-medium">{row.particular}</TableCell>
                        <TableCell>{row.debit}</TableCell>
                        <TableCell>{row.credit}</TableCell>
                        <TableCell>{row.mode}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
