import { useMemo, useState } from "react";
import { Copy, FileSpreadsheet, FileText, Printer } from "lucide-react";
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
import {
  CLASS_OPTIONS,
  EXPORT_ACTIONS,
  SECTION_OPTIONS,
  type ExportAction,
} from "@/modules/admin-portal/constants";
import { cn } from "@/lib/utils";

type ConcessionRow = {
  id: string;
  rollNo: string;
  admissionNo: string;
  name: string;
  course: string;
  combinationLevel: string;
  semester: string;
  receiptNo: string;
  date: string;
  totalFee: string;
  paidAmount: string;
  concession: string;
  balance: string;
  year: string;
  branch: string;
  classId: string;
  sectionId: string;
};

const FEE_CONCESSION_PILLS: ActionPill[] = [
  { label: "Fee Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Day Book Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Fee Pending Report", tone: "green", href: "/fms/fee-pending-report" },
  { label: "Fee Print List", tone: "green", href: "/fms/fee-print-list" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Reports", tone: "blue", href: "/fms/fee-concession-report", dropdown: true },
  { label: "Transaction", tone: "blue", href: "/fms/fee-receipt", dropdown: true },
];

const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"];
const BRANCH_OPTIONS = [
  { value: "all", label: "--ALL--" },
  { value: "state", label: "State" },
  { value: "main", label: "Main" },
  { value: "city", label: "City" },
];

const SAMPLE_ROWS: ConcessionRow[] = [
  {
    id: "fc-1",
    rollNo: "N/A",
    admissionNo: "619",
    name: "Arsalan Khan M Pathan",
    course: "State",
    combinationLevel: "Primary",
    semester: "IV",
    receiptNo: "FRN02026-198",
    date: "11/07/2026",
    totalFee: "13000",
    paidAmount: "5000",
    concession: "500",
    balance: "7500",
    year: "2026",
    branch: "state",
    classId: "class-8",
    sectionId: "a",
  },
  {
    id: "fc-2",
    rollNo: "N/A",
    admissionNo: "112",
    name: "Azeepa Masuti",
    course: "State",
    combinationLevel: "Primary",
    semester: "I",
    receiptNo: "FRN02026-201",
    date: "12/07/2026",
    totalFee: "15000",
    paidAmount: "2000",
    concession: "1000",
    balance: "12000",
    year: "2026",
    branch: "state",
    classId: "class-8",
    sectionId: "a",
  },
  {
    id: "fc-3",
    rollNo: "N/A",
    admissionNo: "626",
    name: "Hasanain Avati",
    course: "State",
    combinationLevel: "Pre Primary",
    semester: "NURSERY",
    receiptNo: "FRN02026-210",
    date: "13/07/2026",
    totalFee: "15000",
    paidAmount: "3000",
    concession: "2000",
    balance: "10000",
    year: "2026",
    branch: "state",
    classId: "nursery",
    sectionId: "nursery_a",
  },
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

export function FeeConcessionReportPage() {
  const [year, setYear] = useState("2026");
  const [branch, setBranch] = useState("all");
  const [classId, setClassId] = useState("all");
  const [sectionId, setSectionId] = useState("all");
  const [search, setSearch] = useState("");
  const [hasShown, setHasShown] = useState(false);

  const filtered = useMemo(() => {
    if (!hasShown) return [];
    const query = search.trim().toLowerCase();
    return SAMPLE_ROWS.filter((row) => {
      if (row.year !== year) return false;
      if (branch !== "all" && row.branch !== branch) return false;
      if (classId !== "all" && row.classId !== classId) return false;
      if (sectionId !== "all" && row.sectionId !== sectionId) return false;
      if (!query) return true;
      return [
        row.rollNo,
        row.admissionNo,
        row.name,
        row.course,
        row.combinationLevel,
        row.semester,
        row.receiptNo,
        row.concession,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [branch, classId, hasShown, search, sectionId, year]);

  const handleShow = () => {
    setHasShown(true);
    toast.success("Fee concession details loaded");
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      if (filtered.length === 0) {
        toast.message("No data available to copy");
        return;
      }
      const text = filtered
        .map(
          (row) =>
            `${row.rollNo}\t${row.admissionNo}\t${row.name}\t${row.course}\t${row.combinationLevel}\t${row.semester}\t${row.receiptNo}\t${row.date}\t${row.totalFee}\t${row.paidAmount}\t${row.concession}\t${row.balance}`,
        )
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Fee concession report copied"),
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
        <div>
          <h2 className="text-xl font-semibold text-[#03a9f4]">Fee Concession Details</h2>
          <p className="text-sm text-[#6b7280]">
            Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Fee Concession Details
          </p>
        </div>
        <ActionPills items={FEE_CONCESSION_PILLS} />
      </div>

      <div className="rounded-sm border border-[#d7e3ec] bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[150px_180px_180px_180px_auto] md:items-end">
          <label className="block space-y-1.5 text-sm text-[#111827]">
            <span>Year</span>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="h-9 bg-white" aria-label="Year">
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

          <label className="block space-y-1.5 text-sm text-[#111827]">
            <span>
              Branch<span className="text-[#e53935]">*</span>
            </span>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger className="h-9 bg-white" aria-label="Branch">
                <SelectValue placeholder="--ALL--" />
              </SelectTrigger>
              <SelectContent>
                {BRANCH_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="block space-y-1.5 text-sm text-[#111827]">
            <span>
              Class<span className="text-[#e53935]">*</span>
            </span>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger className="h-9 bg-white" aria-label="Class">
                <SelectValue placeholder="--ALL--" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">--ALL--</SelectItem>
                {CLASS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="block space-y-1.5 text-sm text-[#111827]">
            <span>Section</span>
            <Select value={sectionId} onValueChange={setSectionId}>
              <SelectTrigger className="h-9 bg-white" aria-label="Section">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {SECTION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <Button
            type="button"
            className="h-9 rounded-sm bg-[#03a9f4] px-5 text-sm font-semibold text-white hover:bg-[#0288d1]"
            onClick={handleShow}
          >
            Show
          </Button>
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
              onChange={(event) => setSearch(event.target.value)}
              className="h-8 w-44 bg-white"
              aria-label="Search fee concession details"
            />
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-sm border border-[#dbe3ea]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                  {[
                    "Roll No",
                    "Admission No",
                    "Name",
                    "Course",
                    "Combination/Level",
                    "Semester",
                    "Receipt No",
                    "Date",
                    "Total Fee",
                    "Paid Amount",
                    "Concession",
                    "Balance",
                  ].map((heading) => (
                    <TableHead key={heading} className="whitespace-nowrap text-xs font-bold">
                      {heading}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!hasShown || filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="h-24 text-center text-sm text-[#6b7280]">
                      {hasShown ? "No data available in table" : "Click Show to load concession details."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={cn(index % 2 === 1 ? "bg-[#f3f9fc]" : "bg-white")}
                    >
                      <TableCell>{row.rollNo}</TableCell>
                      <TableCell>{row.admissionNo}</TableCell>
                      <TableCell className="font-medium whitespace-nowrap">{row.name}</TableCell>
                      <TableCell>{row.course}</TableCell>
                      <TableCell>{row.combinationLevel}</TableCell>
                      <TableCell>{row.semester}</TableCell>
                      <TableCell className="whitespace-nowrap">{row.receiptNo}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.totalFee}</TableCell>
                      <TableCell>{row.paidAmount}</TableCell>
                      <TableCell className="font-semibold text-[#0288d1]">{row.concession}</TableCell>
                      <TableCell>{row.balance}</TableCell>
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
