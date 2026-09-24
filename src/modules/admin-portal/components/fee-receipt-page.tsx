import { useMemo, useState } from "react";
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
import { CLASS_OPTIONS } from "@/modules/admin-portal/constants";
import { cn } from "@/lib/utils";

type LedgerLine = {
  id: string;
  ledger: string;
  amount: string;
};

const FEE_CATEGORIES = [
  "ACADEMIC",
  "MISCELLANEOUS",
  "TRANSPORT",
  "ADDITIONAL",
  "Other Fees",
] as const;

const RECEIPT_OPTIONS = ["RCP-1001", "RCP-1002", "RCP-1003"];
const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"];
const FINANCIAL_YEAR_OPTIONS = ["2024-25", "2025-26", "2026-27"];
const BOARD_OPTIONS = ["Karnataka", "CBSE", "ICSE"];
const COURSE_OPTIONS = ["State", "CBSE", "ICSE"];
const TERM_OPTIONS = ["I-Term", "II-Term", "III-Term"];
const STUDENT_OPTIONS = [
  { value: "stu-1", label: "UMME ARIBA DHARWADKAR", admissionNo: "468", father: "MOHAMMED ALI", dob: "12/Mar/2021" },
  { value: "stu-2", label: "MEERA IYER", admissionNo: "466", father: "RAVI IYER", dob: "04/Jun/2020" },
  { value: "stu-3", label: "ARJUN SHETTY", admissionNo: "501", father: "SURESH SHETTY", dob: "22/Jan/2019" },
];
const LEDGER_OPTIONS = [
  "Cash Fee Collection",
  "Bank Fee Collection",
  "UPI Fee Collection",
  "Cheque Fee Collection",
];

export function FeeReceiptPage() {
  const [receiptNo, setReceiptNo] = useState("none");
  const [feeCategory, setFeeCategory] = useState<(typeof FEE_CATEGORIES)[number]>("ACADEMIC");
  const [year, setYear] = useState("2026");
  const [financialYear, setFinancialYear] = useState("2026-27");
  const [date, setDate] = useState("2026-09-24");
  const [nextDue, setNextDue] = useState("none");
  const [board, setBoard] = useState("Karnataka");
  const [course, setCourse] = useState("State");
  const [classId, setClassId] = useState("none");
  const [term, setTerm] = useState("I-Term");
  const [studentId, setStudentId] = useState("none");
  const [admissionNo, setAdmissionNo] = useState("none");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [feePayable] = useState("0");
  const [ledgerDraft, setLedgerDraft] = useState("Cash Fee Collection");
  const [amountDraft, setAmountDraft] = useState("0");
  const [ledgerLines, setLedgerLines] = useState<LedgerLine[]>([]);

  const selectedStudent = useMemo(
    () => STUDENT_OPTIONS.find((item) => item.value === studentId),
    [studentId],
  );

  const handleStudentChange = (value: string) => {
    setStudentId(value);
    const student = STUDENT_OPTIONS.find((item) => item.value === value);
    if (!student) {
      setAdmissionNo("none");
      setFatherName("");
      setDob("");
      return;
    }
    setAdmissionNo(student.admissionNo);
    setFatherName(student.father);
    setDob(student.dob);
  };

  const handleAdmissionChange = (value: string) => {
    setAdmissionNo(value);
    const student = STUDENT_OPTIONS.find((item) => item.admissionNo === value);
    if (!student) return;
    setStudentId(student.value);
    setFatherName(student.father);
    setDob(student.dob);
  };

  const handleAddLedger = () => {
    if (!ledgerDraft) {
      toast.error("Select Dr Ledger");
      return;
    }
    setLedgerLines((current) => [
      ...current,
      { id: `led-${Date.now()}`, ledger: ledgerDraft, amount: amountDraft || "0" },
    ]);
    setAmountDraft("0");
    toast.success("Ledger line added");
  };

  const handleRemoveLedger = () => {
    setLedgerLines((current) => current.slice(0, -1));
    toast.message("Last ledger line removed");
  };

  const handlePay = (print = false) => {
    if (studentId === "none" || classId === "none") {
      toast.error("Please select Class and Name");
      return;
    }
    toast.success(print ? "Payment recorded and print started" : "Payment recorded");
    if (print) window.print();
  };

  const displayDate = useMemo(() => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [date]);

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 pb-10">
      <div>
        <h2 className="text-xl font-semibold text-info">Fee Receipt</h2>
        <p className="text-sm text-muted-foreground">
          Home <span className="mx-1 text-muted-foreground/70">&gt;</span> Fee Receipt
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <label className="block w-full max-w-[220px] space-y-1.5 text-sm text-foreground">
            <span>Receipt No</span>
            <Select value={receiptNo} onValueChange={setReceiptNo}>
              <SelectTrigger className="h-9 bg-card" aria-label="Receipt No">
                <SelectValue placeholder="--Select--" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">--Select--</SelectItem>
                {RECEIPT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="h-9 rounded-md bg-muted-foreground px-4 text-sm font-semibold text-white hover:bg-foreground/70"
              onClick={() => {
                setReceiptNo("none");
                setStudentId("none");
                setAdmissionNo("none");
                setFatherName("");
                setDob("");
                setClassId("none");
                setLedgerLines([]);
                setAmountDraft("0");
                toast.message("Receipt form cleared");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="h-9 rounded-md bg-success px-4 text-sm font-semibold text-white hover:bg-success/90"
              onClick={() => handlePay(false)}
            >
              Pay
            </Button>
            <Button
              type="button"
              className="h-9 rounded-md bg-success px-4 text-sm font-semibold text-white hover:bg-success/90"
              onClick={() => handlePay(true)}
            >
              Pay & Print
            </Button>
            <Button
              type="button"
              className="h-9 rounded-md bg-info px-4 text-sm font-semibold text-white hover:bg-info/90"
              onClick={() =>
                toast.info(
                  selectedStudent
                    ? `Showing fee history for ${selectedStudent.label}`
                    : "Select a student to view history",
                )
              }
            >
              Show History
            </Button>
          </div>
        </div>

        <div className="mt-3">
          <Button
            type="button"
            className="h-8 rounded-md bg-info px-3 text-xs font-semibold text-white hover:bg-info/90"
            onClick={() => toast.info("Transaction ready for Phase 2 wiring")}
          >
            Transaction
          </Button>
        </div>

        <RadioGroup
          value={feeCategory}
          onValueChange={(value) => setFeeCategory(value as (typeof FEE_CATEGORIES)[number])}
          className="mt-5 flex flex-wrap gap-x-6 gap-y-2"
        >
          {FEE_CATEGORIES.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <RadioGroupItem value={category} id={`fee-cat-${category}`} />
              <Label htmlFor={`fee-cat-${category}`} className="cursor-pointer text-sm font-medium">
                {category}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <FieldSelect label="Year" value={year} onChange={setYear} options={YEAR_OPTIONS} />
          <FieldSelect
            label="Financial Year"
            value={financialYear}
            onChange={setFinancialYear}
            options={FINANCIAL_YEAR_OPTIONS}
          />
          <label className="block space-y-1.5 text-sm text-foreground">
            <span>Date</span>
            <Input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-9 bg-card"
              aria-label="Date"
            />
            <span className="block text-xs text-muted-foreground">{displayDate}</span>
          </label>
          <FieldSelect
            label="Next Due"
            value={nextDue}
            onChange={setNextDue}
            options={["30 Sep 2026", "31 Oct 2026", "30 Nov 2026"]}
            emptyLabel="--Select--"
          />
          <FieldSelect
            label="Board/Graduation"
            value={board}
            onChange={setBoard}
            options={BOARD_OPTIONS}
          />
          <FieldSelect label="Course" value={course} onChange={setCourse} options={COURSE_OPTIONS} />
          <FieldSelect
            label="Class"
            value={classId}
            onChange={setClassId}
            options={CLASS_OPTIONS.map((item) => item.label)}
            optionValues={CLASS_OPTIONS.map((item) => item.value)}
            emptyLabel="--Select--"
          />
          <FieldSelect
            label="Term*"
            value={term}
            onChange={setTerm}
            options={TERM_OPTIONS}
            required
          />
          <label className="block space-y-1.5 text-sm text-foreground">
            <span>Name</span>
            <Select value={studentId} onValueChange={handleStudentChange}>
              <SelectTrigger className="h-9 bg-card" aria-label="Name">
                <SelectValue placeholder="--Select--" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">--Select--</SelectItem>
                {STUDENT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="block space-y-1.5 text-sm text-foreground">
            <span>Admission No.</span>
            <Select value={admissionNo} onValueChange={handleAdmissionChange}>
              <SelectTrigger className="h-9 bg-card" aria-label="Admission No.">
                <SelectValue placeholder="--Select--" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">--Select--</SelectItem>
                {STUDENT_OPTIONS.map((option) => (
                  <SelectItem key={option.admissionNo} value={option.admissionNo}>
                    {option.admissionNo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="block space-y-1.5 text-sm text-foreground">
            <span>Fathers Name</span>
            <Input
              value={fatherName}
              onChange={(event) => setFatherName(event.target.value)}
              className="h-9 bg-card"
              aria-label="Fathers Name"
            />
          </label>
          <label className="block space-y-1.5 text-sm text-foreground">
            <span>DOB</span>
            <Input
              value={dob}
              onChange={(event) => setDob(event.target.value)}
              className="h-9 bg-card"
              placeholder="--Select--"
              aria-label="DOB"
            />
          </label>
          <label className="block space-y-1.5 text-sm text-foreground">
            <span>Fee Payable</span>
            <Input
              value={feePayable}
              readOnly
              className="h-9 bg-muted text-muted-foreground"
              aria-label="Fee Payable"
            />
          </label>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-info hover:bg-info">
                <TableHead className="text-xs font-bold text-white">Dr Ledger</TableHead>
                <TableHead className="text-xs font-bold text-white">Amount</TableHead>
                <TableHead className="text-center text-xs font-bold text-white">Add</TableHead>
                <TableHead className="text-center text-xs font-bold text-white">Remove</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Select value={ledgerDraft} onValueChange={setLedgerDraft}>
                    <SelectTrigger className="h-9 bg-card" aria-label="Dr Ledger">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEDGER_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    value={amountDraft}
                    onChange={(event) => setAmountDraft(event.target.value)}
                    className="h-9 bg-card"
                    aria-label="Amount"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    type="button"
                    className="h-8 rounded-md bg-success px-3 text-xs font-semibold text-white hover:bg-success/90"
                    onClick={handleAddLedger}
                  >
                    Add
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    type="button"
                    className="h-8 rounded-md bg-danger px-3 text-xs font-semibold text-white hover:bg-danger/90"
                    onClick={handleRemoveLedger}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
              {ledgerLines.map((line, index) => (
                <TableRow key={line.id} className={cn(index % 2 === 1 ? "bg-info-soft/50" : "bg-card")}>
                  <TableCell>{line.ledger}</TableCell>
                  <TableCell>{line.amount}</TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
  optionValues,
  emptyLabel,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  optionValues?: string[];
  emptyLabel?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5 text-sm text-foreground">
      <span>
        {label}
        {required ? <span className="text-danger">*</span> : null}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 bg-card" aria-label={label}>
          <SelectValue placeholder={emptyLabel ?? "--Select--"} />
        </SelectTrigger>
        <SelectContent>
          {emptyLabel ? <SelectItem value="none">{emptyLabel}</SelectItem> : null}
          {options.map((option, index) => {
            const optionValue = optionValues?.[index] ?? option;
            return (
              <SelectItem key={optionValue} value={optionValue}>
                {option}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </label>
  );
}
