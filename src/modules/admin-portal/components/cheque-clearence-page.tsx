import { useMemo, useState } from "react";
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

type BankTxnRow = {
  id: string;
  receiptNo: string;
  studentName: string;
  mop: string;
  amount: string;
  date: string;
  bank: string;
  status: string;
  category: "receipts" | "canceled-receipts" | "payments" | "canceled-payments";
};

const CHEQUE_CLEARANCE_PILLS: ActionPill[] = [
  { label: "Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Payment", tone: "green" },
  { label: "Application Receipt", tone: "green" },
  { label: "Ledger Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Journal", tone: "light-green" },
  { label: "Contra", tone: "light-green" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Transaction", tone: "red", href: "/fms/cheque-clearence", dropdown: true },
  { label: "Reports", tone: "green", href: "/fms/fee-pending-report", dropdown: true },
];

const MOP_OPTIONS = ["ALL", "Cheque", "Online", "Cash", "UPI", "Card"];

const TABS = [
  { id: "receipts", label: "Receipts" },
  { id: "canceled-receipts", label: "Canceled Receipts" },
  { id: "payments", label: "Payments" },
  { id: "canceled-payments", label: "Canceled Payments" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const SAMPLE_ROWS: BankTxnRow[] = [
  {
    id: "txn-1",
    receiptNo: "FRN02026-88",
    studentName: "Rehan Thomas",
    mop: "Cheque",
    amount: "15,200",
    date: "20/09/2026",
    bank: "HDFC",
    status: "Pending Clearance",
    category: "receipts",
  },
  {
    id: "txn-2",
    receiptNo: "FRN02026-91",
    studentName: "Maya Iyer",
    mop: "Cheque",
    amount: "8,500",
    date: "22/09/2026",
    bank: "SBI",
    status: "Pending Clearance",
    category: "receipts",
  },
  {
    id: "txn-3",
    receiptNo: "PAY-2026-12",
    studentName: "Vendor - LabWorks",
    mop: "Cheque",
    amount: "12,000",
    date: "18/09/2026",
    bank: "Canara",
    status: "Pending Clearance",
    category: "payments",
  },
];

export function ChequeClearencePage() {
  const [mop, setMop] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("receipts");
  const [hasSearched, setHasSearched] = useState(false);

  const rows = useMemo(() => {
    if (!hasSearched) return [];
    return SAMPLE_ROWS.filter((row) => {
      if (row.category !== activeTab) return false;
      if (mop !== "ALL" && row.mop !== mop) return false;
      return true;
    });
  }, [activeTab, hasSearched, mop]);

  const handleSearch = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select From Date and To Date");
      return;
    }
    setHasSearched(true);
    toast.success("Bank transactions loaded");
  };

  const handleAccept = (row: BankTxnRow) => {
    toast.success(`Accepted ${row.receiptNo} for clearance`);
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#03a9f4]">Accept Bank Transactions</h2>
          <p className="text-sm text-[#6b7280]">
            Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Accept Bank Transactions
          </p>
        </div>
        <ActionPills items={CHEQUE_CLEARANCE_PILLS} />
      </div>

      <div className="overflow-hidden rounded-sm border border-[#d7e3ec] bg-white shadow-sm">
        <div className="bg-[#03a9f4] px-4 py-2.5">
          <h3 className="text-sm font-semibold text-white">Accept Receipts/Payments</h3>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex flex-wrap items-end gap-3">
            <label className="block min-w-[180px] space-y-1.5 text-sm text-[#111827]">
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

            <label className="block min-w-[180px] space-y-1.5 text-sm text-[#111827]">
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

            <label className="block min-w-[180px] space-y-1.5 text-sm text-[#111827]">
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
              className="h-9 rounded-sm bg-[#03a9f4] px-4 text-sm font-semibold text-white hover:bg-[#0288d1]"
              onClick={handleSearch}
            >
              <Search className="size-4" />
              Search
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-[#dbe3ea] pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={cn(
                  "rounded-t-sm px-4 py-2 text-sm font-semibold",
                  activeTab === tab.id
                    ? "bg-[#03a9f4] text-white"
                    : "bg-[#eef2f7] text-[#374151] hover:bg-[#e2e8f0]",
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {!hasSearched || rows.length === 0 ? (
            <p className="py-10 text-center text-sm font-medium text-[#5cb85c]">
              No records found to Accept!
            </p>
          ) : (
            <div className="overflow-hidden rounded-sm border border-[#dbe3ea]">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                      {[
                        "Receipt/Payment No",
                        "Name",
                        "MOP",
                        "Amount",
                        "Date",
                        "Bank",
                        "Status",
                        "Action",
                      ].map((heading) => (
                        <TableHead key={heading} className="text-xs font-bold">
                          {heading}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        className={cn(index % 2 === 1 ? "bg-[#f3f9fc]" : "bg-white")}
                      >
                        <TableCell>{row.receiptNo}</TableCell>
                        <TableCell className="font-medium">{row.studentName}</TableCell>
                        <TableCell>{row.mop}</TableCell>
                        <TableCell>{row.amount}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.bank}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            size="sm"
                            className="h-8 rounded-sm bg-[#5cb85c] px-3 text-xs font-semibold text-white hover:bg-[#4cae4c]"
                            onClick={() => handleAccept(row)}
                          >
                            Accept
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
