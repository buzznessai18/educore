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
          <h2 className="text-xl font-semibold text-info">Day Book Report</h2>
          <p className="text-sm text-muted-foreground">
            Home <span className="mx-1 text-muted-foreground/70">&gt;</span> Day Book Report
          </p>
        </div>
        <ActionPills items={DAY_BOOK_PILLS} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-enterprise-sm">
        <div className="bg-info px-4 py-2.5">
          <h3 className="text-sm font-semibold text-white">Day Book Report</h3>
        </div>

        <div className="space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block space-y-1.5 text-sm text-foreground">
              <span>From Date</span>
              <Input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="h-9 bg-card"
                aria-label="From Date"
              />
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>To Date</span>
              <Input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="h-9 bg-card"
                aria-label="To Date"
              />
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>Book Type</span>
              <Select value={bookType} onValueChange={setBookType}>
                <SelectTrigger className="h-9 bg-card" aria-label="Book Type">
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

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>Authorised Signature</span>
              <Select value={signature} onValueChange={setSignature}>
                <SelectTrigger className="h-9 bg-card" aria-label="Authorised Signature">
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
            className="h-9 rounded-md bg-info px-5 text-sm font-semibold text-white hover:bg-info/90"
            onClick={handleSearch}
          >
            <Search className="size-4" />
            Search
          </Button>

          {hasSearched ? (
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
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
                        className={cn(index % 2 === 1 ? "bg-info-soft/50" : "bg-card")}
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
