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
  type ExportAction,
} from "@/modules/admin-portal/constants";
import { cn } from "@/lib/utils";

type PendingFeeRow = {
  id: string;
  rollNo: string;
  admissionNo: string;
  studentName: string;
  fatherName: string;
  fatherMobile: string;
  classLabel: string;
  classId: string;
  section: string;
  term: string;
  feeType: string;
  fees: number;
  paid: number;
  concession: number;
  pending: number;
  lastYearPending: number;
  advanceBalance: number;
  status: string;
  remarks: string;
  year: string;
  course: string;
  branch: string;
  level: string;
  paymentStatus: string;
};

const FEE_PENDING_PILLS: ActionPill[] = [
  { label: "Fee Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Day Book Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Fee Pending Report", tone: "green", href: "/fms/fee-pending-report" },
  { label: "Fee Print List", tone: "green", href: "/fms/fee-print-list" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Reports", tone: "blue", href: "/fms/fee-pending-report", dropdown: true },
  { label: "Transaction", tone: "blue", href: "/fms/fee-receipt", dropdown: true },
];

const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"];
const COURSE_OPTIONS = ["State", "CBSE", "ICSE"];
const BRANCH_OPTIONS = ["State", "Main", "City"];
const LEVEL_OPTIONS = ["Pre-Primary", "Primary", "Middle", "High"];
const STATUS_OPTIONS = ["Regular", "RTE", "Staff Child"];
const PAYMENT_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "partial", label: "Partial" },
  { value: "paid", label: "Paid" },
];

const SAMPLE_ROWS: PendingFeeRow[] = [
  {
    id: "pf-1",
    rollNo: "N/A",
    admissionNo: "468",
    studentName: "Aaisa Khan",
    fatherName: "Imran Khan",
    fatherMobile: "9876543210",
    classLabel: "NURSERY",
    classId: "nursery",
    section: "A",
    term: "I-Term",
    feeType: "ACADEMIC",
    fees: 12000,
    paid: 6000,
    concession: 1000,
    pending: 5000,
    lastYearPending: 0,
    advanceBalance: 0,
    status: "Regular",
    remarks: "",
    year: "2026",
    course: "State",
    branch: "State",
    level: "Pre-Primary",
    paymentStatus: "partial",
  },
  {
    id: "pf-2",
    rollNo: "N/A",
    admissionNo: "512",
    studentName: "Aakifah Mirjannavar",
    fatherName: "Rizwan Mirjannavar",
    fatherMobile: "9988776655",
    classLabel: "Class 8",
    classId: "class-8",
    section: "A",
    term: "I-Term",
    feeType: "ACADEMIC",
    fees: 15000,
    paid: 7500,
    concession: 0,
    pending: 7500,
    lastYearPending: 0,
    advanceBalance: 0,
    status: "Regular",
    remarks: "",
    year: "2026",
    course: "State",
    branch: "State",
    level: "Middle",
    paymentStatus: "partial",
  },
  {
    id: "pf-3",
    rollNo: "N/A",
    admissionNo: "530",
    studentName: "Zoya Pathan",
    fatherName: "Arif Pathan",
    fatherMobile: "9123456780",
    classLabel: "LKG",
    classId: "lkg",
    section: "A",
    term: "I-Term",
    feeType: "ACADEMIC",
    fees: 11000,
    paid: 0,
    concession: 500,
    pending: 10500,
    lastYearPending: 2000,
    advanceBalance: 0,
    status: "Regular",
    remarks: "Follow-up",
    year: "2026",
    course: "State",
    branch: "State",
    level: "Pre-Primary",
    paymentStatus: "pending",
  },
];

const SUMMARY_CARDS = [
  { label: "No of Students", value: "307", tone: "bg-[#f5a623]" },
  { label: "Total Payable Fee", value: "₹ 4,520,000", tone: "bg-[#03a9f4]" },
  { label: "Total Fee Paid", value: "₹ 1,425,000", tone: "bg-[#ec407a]" },
  { label: "Total Concession", value: "₹ 7,000", tone: "bg-[#26a69a]" },
  { label: "Total Pending Fee", value: "₹ 3,088,000", tone: "bg-[#7e57c2]" },
] as const;

const TABLE_HEADERS = [
  "#",
  "Roll No",
  "AdmissionNo",
  "Student Name",
  "Father Name",
  "Father Mobile",
  "Class",
  "Section",
  "Term",
  "FeeType",
  "Fees",
  "Paid",
  "Concession",
  "Pending",
  "Last Year Pending",
  "Advance Balance",
  "Status",
  "Remarks",
] as const;

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

const currency = (value: number) => value.toLocaleString("en-IN");

export function FeePendingReportPage() {
  const [year, setYear] = useState("2026");
  const [course, setCourse] = useState("none");
  const [branch, setBranch] = useState("none");
  const [level, setLevel] = useState("none");
  const [classId, setClassId] = useState("none");
  const [studentId, setStudentId] = useState("all");
  const [status, setStatus] = useState("none");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [hasShown, setHasShown] = useState(true);

  const filtered = useMemo(() => {
    if (!hasShown) return [];
    const query = search.trim().toLowerCase();
    return SAMPLE_ROWS.filter((row) => {
      if (row.year !== year) return false;
      if (course !== "none" && row.course !== course) return false;
      if (branch !== "none" && row.branch !== branch) return false;
      if (level !== "none" && row.level !== level) return false;
      if (classId !== "none" && row.classId !== classId) return false;
      if (studentId !== "all" && row.id !== studentId) return false;
      if (status !== "none" && row.status !== status) return false;
      if (paymentStatus !== "all" && row.paymentStatus !== paymentStatus) return false;
      if (!query) return true;
      return [
        row.rollNo,
        row.admissionNo,
        row.studentName,
        row.fatherName,
        row.fatherMobile,
        row.classLabel,
        row.section,
        row.feeType,
        row.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [branch, classId, course, hasShown, level, paymentStatus, search, status, studentId, year]);

  const handleShow = () => {
    setHasShown(true);
    toast.success("Pending fee details loaded");
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
            `${index + 1}\t${row.rollNo}\t${row.admissionNo}\t${row.studentName}\t${row.fatherName}\t${row.fatherMobile}\t${row.classLabel}\t${row.section}\t${row.term}\t${row.feeType}\t${row.fees}\t${row.paid}\t${row.concession}\t${row.pending}\t${row.lastYearPending}\t${row.advanceBalance}\t${row.status}\t${row.remarks}`,
        )
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Pending fee details copied"),
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
    <div className="mx-auto max-w-[1280px] space-y-4 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#03a9f4]">Pending Fee- Details</h2>
          <p className="text-sm text-[#6b7280]">
            Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Pending Fee- Details
          </p>
        </div>
        <ActionPills items={FEE_PENDING_PILLS} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {SUMMARY_CARDS.map((card) => (
          <div
            key={card.label}
            className={cn(
              "rounded-sm px-4 py-4 text-white shadow-sm",
              card.tone,
            )}
          >
            <p className="text-2xl font-semibold tracking-tight">{card.value}</p>
            <p className="mt-1 text-xs font-medium opacity-95">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-sm border border-[#d7e3ec] bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-[#111827]">Fees Details</h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          <FilterSelect label="Year" value={year} onChange={setYear} options={YEAR_OPTIONS} />
          <FilterSelect
            label="Course"
            value={course}
            onChange={setCourse}
            options={COURSE_OPTIONS}
            emptyLabel="--Select--"
          />
          <FilterSelect
            label="Branch"
            value={branch}
            onChange={setBranch}
            options={BRANCH_OPTIONS}
            emptyLabel="Nothing selected"
          />
          <FilterSelect
            label="Level"
            value={level}
            onChange={setLevel}
            options={LEVEL_OPTIONS}
            emptyLabel="Nothing selected"
          />
          <label className="block space-y-1.5 text-sm text-[#111827]">
            <span>Class</span>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger className="h-9 bg-white" aria-label="Class">
                <SelectValue placeholder="Nothing selected" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nothing selected</SelectItem>
                {CLASS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="block space-y-1.5 text-sm text-[#111827]">
            <span>Student</span>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger className="h-9 bg-white" aria-label="Student">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {SAMPLE_ROWS.map((row) => (
                  <SelectItem key={row.id} value={row.id}>
                    {row.studentName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <FilterSelect
            label="Status"
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
            emptyLabel="Nothing selected"
          />
          <label className="block space-y-1.5 text-sm text-[#111827]">
            <span>Payment Status</span>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger className="h-9 bg-white" aria-label="Payment Status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        </div>

        <div className="mt-4">
          <Button
            type="button"
            className="h-9 rounded-sm bg-[#5cb85c] px-5 text-sm font-semibold text-white hover:bg-[#4cae4c]"
            onClick={handleShow}
          >
            Show Fee Pending
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
              aria-label="Search pending fees"
            />
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-sm border border-[#dbe3ea]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                  {TABLE_HEADERS.map((heading) => (
                    <TableHead key={heading} className="whitespace-nowrap text-xs font-bold">
                      {heading}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={18} className="h-24 text-center text-sm text-[#6b7280]">
                      No data available in table
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={cn(index % 2 === 1 ? "bg-[#f3f9fc]" : "bg-white")}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.rollNo}</TableCell>
                      <TableCell>{row.admissionNo}</TableCell>
                      <TableCell>
                        <button
                          type="button"
                          className="font-medium text-[#0288d1] hover:underline"
                          onClick={() => toast.info(`Opening profile for ${row.studentName}`)}
                        >
                          {row.studentName}
                        </button>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{row.fatherName}</TableCell>
                      <TableCell>{row.fatherMobile}</TableCell>
                      <TableCell>{row.classLabel}</TableCell>
                      <TableCell>{row.section}</TableCell>
                      <TableCell>{row.term}</TableCell>
                      <TableCell>{row.feeType}</TableCell>
                      <TableCell>{currency(row.fees)}</TableCell>
                      <TableCell>{currency(row.paid)}</TableCell>
                      <TableCell>{currency(row.concession)}</TableCell>
                      <TableCell className="font-semibold text-[#c62828]">
                        {currency(row.pending)}
                      </TableCell>
                      <TableCell>{currency(row.lastYearPending)}</TableCell>
                      <TableCell>{currency(row.advanceBalance)}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.remarks || "—"}</TableCell>
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

function FilterSelect({
  label,
  value,
  onChange,
  options,
  emptyLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  emptyLabel?: string;
}) {
  return (
    <label className="block space-y-1.5 text-sm text-[#111827]">
      <span>{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 bg-white" aria-label={label}>
          <SelectValue placeholder={emptyLabel ?? "--Select--"} />
        </SelectTrigger>
        <SelectContent>
          {emptyLabel ? <SelectItem value="none">{emptyLabel}</SelectItem> : null}
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
