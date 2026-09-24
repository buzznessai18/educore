import { useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

type DailyMopRow = {
  id: string;
  date: string;
  cash: string;
  upi: string;
  card: string;
  cheque: string;
  online: string;
  total: string;
  type: "receipt" | "payment";
};

const DAILY_MOP_PILLS: ActionPill[] = [
  { label: "Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Payment", tone: "green" },
  { label: "Application Receipt", tone: "green" },
  { label: "Ledger Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Journal", tone: "light-green" },
  { label: "Contra", tone: "light-green" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Reports", tone: "green", href: "/fms/daily-mop-report", dropdown: true },
  { label: "Transaction", tone: "red", href: "/fms/cheque-clearence", dropdown: true },
];

const SAMPLE_ROWS: DailyMopRow[] = [
  {
    id: "dm-1",
    date: "25/Sep/2026",
    cash: "38,400",
    upi: "82,100",
    card: "18,500",
    cheque: "12,000",
    online: "0",
    total: "1,51,000",
    type: "receipt",
  },
  {
    id: "dm-2",
    date: "24/Sep/2026",
    cash: "22,100",
    upi: "71,000",
    card: "15,500",
    cheque: "12,000",
    online: "0",
    total: "1,20,600",
    type: "receipt",
  },
  {
    id: "dm-3",
    date: "25/Sep/2026",
    cash: "8,000",
    upi: "0",
    card: "0",
    cheque: "25,000",
    online: "0",
    total: "33,000",
    type: "payment",
  },
];

export function DailyMopReportPage() {
  const [reportType, setReportType] = useState<"receipt" | "payment">("receipt");
  const [fromDate, setFromDate] = useState("2026-09-25");
  const [toDate, setToDate] = useState("2026-09-25");
  const [hasSearched, setHasSearched] = useState(false);

  const rows = hasSearched
    ? SAMPLE_ROWS.filter((row) => row.type === reportType)
    : [];

  const handleSearch = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select From Date and To Date");
      return;
    }
    setHasSearched(true);
    toast.success("Daily mode of payment report loaded");
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#03a9f4]">Mode of Payment Report</h2>
          <p className="text-sm text-[#6b7280]">
            Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Mode of Payment Report
          </p>
        </div>
        <ActionPills items={DAILY_MOP_PILLS} />
      </div>

      <div className="overflow-hidden rounded-sm border border-[#d7e3ec] bg-white shadow-sm">
        <div className="bg-[#03a9f4] px-4 py-2.5">
          <h3 className="text-sm font-semibold text-white">Mode of Payment Report</h3>
        </div>

        <div className="space-y-5 p-5">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#111827]">Report Type</p>
            <RadioGroup
              value={reportType}
              onValueChange={(value) => setReportType(value as "receipt" | "payment")}
              className="flex flex-wrap gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="receipt" id="daily-mop-receipt" />
                <Label htmlFor="daily-mop-receipt" className="cursor-pointer text-sm font-medium">
                  Receipt
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="payment" id="daily-mop-payment" />
                <Label htmlFor="daily-mop-payment" className="cursor-pointer text-sm font-medium">
                  Payment
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <label className="block min-w-[200px] space-y-1.5 text-sm text-[#111827]">
              <span>
                From Date<span className="text-[#e53935]">*</span>
              </span>
              <Input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="h-9 bg-white"
                aria-label="From Date"
              />
            </label>

            <label className="block min-w-[200px] space-y-1.5 text-sm text-[#111827]">
              <span>
                To Date<span className="text-[#e53935]">*</span>
              </span>
              <Input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="h-9 bg-white"
                aria-label="To Date"
              />
            </label>

            <Button
              type="button"
              className="h-9 rounded-sm bg-[#03a9f4] px-5 text-sm font-semibold text-white hover:bg-[#0288d1]"
              onClick={handleSearch}
            >
              <Search className="size-4" />
              Search
            </Button>
          </div>

          {hasSearched ? (
            <div className="overflow-hidden rounded-sm border border-[#dbe3ea]">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                      {["Date", "Cash", "UPI", "Card", "Cheque", "Online", "Total"].map(
                        (heading) => (
                          <TableHead key={heading} className="text-xs font-bold">
                            {heading}
                          </TableHead>
                        ),
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-sm text-[#6b7280]">
                          No data available in table
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((row, index) => (
                        <TableRow
                          key={row.id}
                          className={cn(index % 2 === 1 ? "bg-[#f3f9fc]" : "bg-white")}
                        >
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{row.cash}</TableCell>
                          <TableCell>{row.upi}</TableCell>
                          <TableCell>{row.card}</TableCell>
                          <TableCell>{row.cheque}</TableCell>
                          <TableCell>{row.online}</TableCell>
                          <TableCell className="font-semibold">{row.total}</TableCell>
                        </TableRow>
                      ))
                    )}
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
