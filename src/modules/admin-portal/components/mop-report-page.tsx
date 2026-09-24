import { useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

type MopRow = {
  id: string;
  receiptNo: string;
  studentName: string;
  mop: string;
  amount: string;
  employee: string;
  date: string;
  type: "receipt" | "payment";
};

const MOP_REPORT_PILLS: ActionPill[] = [
  { label: "Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Payment", tone: "green" },
  { label: "Application Receipt", tone: "green" },
  { label: "Ledger Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Journal", tone: "light-green" },
  { label: "Contra", tone: "light-green" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Reports", tone: "green", href: "/fms/mop-report", dropdown: true },
  { label: "Transaction", tone: "red", href: "/fms/cheque-clearence", dropdown: true },
];

const MOP_OPTIONS = ["ALL", "Cash", "UPI", "Card", "Cheque", "Online"];
const EMPLOYEE_OPTIONS = [
  { value: "emp-1", label: "Maya Singh" },
  { value: "emp-2", label: "Rohan Mehta" },
  { value: "emp-3", label: "Priya Nair" },
];

const SAMPLE_ROWS: MopRow[] = [
  {
    id: "mop-1",
    receiptNo: "FRN02026-101",
    studentName: "Aaisa Khan",
    mop: "UPI",
    amount: "6,000",
    employee: "Maya Singh",
    date: "25/Sep/2026",
    type: "receipt",
  },
  {
    id: "mop-2",
    receiptNo: "FRN02026-102",
    studentName: "Aakifah Mirjannavar",
    mop: "Cash",
    amount: "7,500",
    employee: "Rohan Mehta",
    date: "25/Sep/2026",
    type: "receipt",
  },
  {
    id: "mop-3",
    receiptNo: "PAY-2026-18",
    studentName: "LabWorks India",
    mop: "Cheque",
    amount: "12,000",
    employee: "Priya Nair",
    date: "25/Sep/2026",
    type: "payment",
  },
];

export function MopReportPage() {
  const [reportType, setReportType] = useState<"receipt" | "payment">("receipt");
  const [mop, setMop] = useState("ALL");
  const [employee, setEmployee] = useState("none");
  const [fromDate, setFromDate] = useState("2026-09-25");
  const [toDate, setToDate] = useState("2026-09-25");
  const [hasSearched, setHasSearched] = useState(false);

  const rows = hasSearched
    ? SAMPLE_ROWS.filter((row) => {
        if (row.type !== reportType) return false;
        if (mop !== "ALL" && row.mop !== mop) return false;
        if (employee !== "none") {
          const selected = EMPLOYEE_OPTIONS.find((item) => item.value === employee)?.label;
          if (selected && row.employee !== selected) return false;
        }
        return true;
      })
    : [];

  const handleSearch = () => {
    if (employee === "none") {
      toast.error("Please select Employee");
      return;
    }
    if (!fromDate || !toDate) {
      toast.error("Please select From Date and To Date");
      return;
    }
    setHasSearched(true);
    toast.success("Mode of payment report loaded");
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
        <ActionPills items={MOP_REPORT_PILLS} />
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
                <RadioGroupItem value="receipt" id="mop-receipt" />
                <Label htmlFor="mop-receipt" className="cursor-pointer text-sm font-medium">
                  Receipt
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="payment" id="mop-payment" />
                <Label htmlFor="mop-payment" className="cursor-pointer text-sm font-medium">
                  Payment
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block space-y-1.5 text-sm text-[#111827]">
              <span>
                Mode of Payment<span className="text-[#e53935]">*</span>
              </span>
              <Select value={mop} onValueChange={setMop}>
                <SelectTrigger className="h-9 bg-white" aria-label="Mode of Payment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOP_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="block space-y-1.5 text-sm text-[#111827]">
              <span>
                Employee<span className="text-[#e53935]">*</span>
              </span>
              <Select value={employee} onValueChange={setEmployee}>
                <SelectTrigger className="h-9 bg-white" aria-label="Employee">
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">--Select--</SelectItem>
                  {EMPLOYEE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="block space-y-1.5 text-sm text-[#111827]">
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

            <label className="block space-y-1.5 text-sm text-[#111827]">
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
                      {["Receipt/Payment No", "Name", "MOP", "Amount", "Employee", "Date"].map(
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
                        <TableCell colSpan={6} className="h-24 text-center text-sm text-[#6b7280]">
                          No data available in table
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((row, index) => (
                        <TableRow
                          key={row.id}
                          className={cn(index % 2 === 1 ? "bg-[#f3f9fc]" : "bg-white")}
                        >
                          <TableCell>{row.receiptNo}</TableCell>
                          <TableCell className="font-medium">{row.studentName}</TableCell>
                          <TableCell>{row.mop}</TableCell>
                          <TableCell>{row.amount}</TableCell>
                          <TableCell>{row.employee}</TableCell>
                          <TableCell>{row.date}</TableCell>
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
