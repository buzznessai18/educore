import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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

type FeePrintRow = {
  id: string;
  rollNo: string;
  classGrade: string;
  studentName: string;
  fatherName: string;
  feeReceiptNo: string;
  receiptDate: string;
  amount: string;
  mop: string;
  remarks: string;
  year: string;
};

const FEE_PRINT_PILLS: ActionPill[] = [
  { label: "Fee Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Day Book Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Fee Pending Report", tone: "green", href: "/fms/fee-pending-report" },
  { label: "Fee Print List", tone: "green", href: "/fms/fee-print-list" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Reports", tone: "blue", href: "/fms/fee-pending-report", dropdown: true },
  { label: "Transaction", tone: "blue", href: "/fms/fee-receipt", dropdown: true },
];

const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"];

const INITIAL_ROWS: FeePrintRow[] = [
  {
    id: "fp-1",
    rollNo: "N/A",
    classGrade: "IV",
    studentName: "Tanaaz Fatima Shilledar",
    fatherName: "Iliyaskhan Shilledar",
    feeReceiptNo: "FRN02026-5",
    receiptDate: "08/06/26",
    amount: "6000",
    mop: "ONLINE",
    remarks: "",
    year: "2026",
  },
  {
    id: "fp-2",
    rollNo: "N/A",
    classGrade: "VII",
    studentName: "Furqan Khan Shilledar",
    fatherName: "Iliyaskhan Shilledar",
    feeReceiptNo: "FRN02026-23",
    receiptDate: "09/06/26",
    amount: "7000",
    mop: "CASH",
    remarks: "",
    year: "2026",
  },
  {
    id: "fp-3",
    rollNo: "N/A",
    classGrade: "IX",
    studentName: "Ayaan Suranagi",
    fatherName: "Arif Suranagi",
    feeReceiptNo: "FRN02026-31",
    receiptDate: "10/06/26",
    amount: "10000",
    mop: "ONLINE",
    remarks: "",
    year: "2026",
  },
  {
    id: "fp-4",
    rollNo: "N/A",
    classGrade: "II",
    studentName: "Zoya Pathan",
    fatherName: "Imran Pathan",
    feeReceiptNo: "FRN02026-42",
    receiptDate: "11/06/26",
    amount: "5000",
    mop: "CASH",
    remarks: "",
    year: "2026",
  },
  {
    id: "fp-5",
    rollNo: "N/A",
    classGrade: "III",
    studentName: "Rehan Shaikh",
    fatherName: "Nadeem Shaikh",
    feeReceiptNo: "FRN02026-48",
    receiptDate: "12/06/26",
    amount: "5500",
    mop: "ONLINE",
    remarks: "",
    year: "2026",
  },
  {
    id: "fp-6",
    rollNo: "N/A",
    classGrade: "VI",
    studentName: "Sara Banu",
    fatherName: "Yusuf Banu",
    feeReceiptNo: "FRN02026-55",
    receiptDate: "13/06/26",
    amount: "6500",
    mop: "CASH",
    remarks: "",
    year: "2026",
  },
];

export function FeePrintListPage() {
  const [receiptNo, setReceiptNo] = useState("all");
  const [academicYear, setAcademicYear] = useState("2026");

  const filtered = useMemo(() => {
    return INITIAL_ROWS.filter((row) => {
      if (academicYear !== "none" && row.year !== academicYear) return false;
      if (receiptNo !== "all" && row.feeReceiptNo !== receiptNo) return false;
      return true;
    });
  }, [academicYear, receiptNo]);

  const receiptOptions = useMemo(
    () => Array.from(new Set(INITIAL_ROWS.map((row) => row.feeReceiptNo))),
    [],
  );

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-info">Fee Print List</h2>
          <p className="text-sm text-muted-foreground">
            Home <span className="mx-1 text-muted-foreground/70">&gt;</span> Fee Print List
          </p>
        </div>
        <ActionPills items={FEE_PRINT_PILLS} />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-xl">
          <label className="block space-y-1.5 text-sm text-foreground">
            <span>Receipt No</span>
            <Select value={receiptNo} onValueChange={setReceiptNo}>
              <SelectTrigger className="h-9 bg-card" aria-label="Receipt No">
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

          <label className="block space-y-1.5 text-sm text-foreground">
            <span>Academic year</span>
            <Select value={academicYear} onValueChange={setAcademicYear}>
              <SelectTrigger className="h-9 bg-card" aria-label="Academic year">
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

        <div className="mt-5 overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs font-bold">Roll No</TableHead>
                  <TableHead className="text-xs font-bold">Class/Grade</TableHead>
                  <TableHead className="text-xs font-bold">Student Name</TableHead>
                  <TableHead className="text-xs font-bold">Father&apos;s Name</TableHead>
                  <TableHead className="text-xs font-bold">Fee Receipt No</TableHead>
                  <TableHead className="text-xs font-bold">Receipt Date</TableHead>
                  <TableHead className="text-xs font-bold">Amount</TableHead>
                  <TableHead className="text-xs font-bold">MOP</TableHead>
                  <TableHead className="text-xs font-bold">Remarks</TableHead>
                  <TableHead className="text-center text-xs font-bold">Print</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-sm text-muted-foreground">
                      No data available in table
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={cn(index % 2 === 1 ? "bg-info-soft/50" : "bg-card")}
                    >
                      <TableCell>{row.rollNo}</TableCell>
                      <TableCell>{row.classGrade}</TableCell>
                      <TableCell className="font-medium">{row.studentName}</TableCell>
                      <TableCell>{row.fatherName}</TableCell>
                      <TableCell>{row.feeReceiptNo}</TableCell>
                      <TableCell>{row.receiptDate}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>{row.mop}</TableCell>
                      <TableCell>{row.remarks || "—"}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          size="sm"
                          className="h-8 rounded-full bg-info px-3 text-xs font-semibold text-white hover:bg-info/90"
                          onClick={() => {
                            toast.success(`Printing fee receipt ${row.feeReceiptNo}`);
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
      </div>
    </div>
  );
}
