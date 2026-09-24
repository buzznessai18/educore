import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CLASS_OPTIONS, QUOTA_OPTIONS } from "@/modules/admin-portal/constants";
import { cn } from "@/lib/utils";

type FeeMasterRow = {
  id: string;
  classLabel: string;
  classId: string;
  term: string;
  feeAmount: string;
  regType: string;
  category: string;
  quota: string;
  year: string;
  financialYear: string;
};

type StudentMasterRow = {
  id: string;
  name: string;
  classLabel: string;
  classId: string;
  fatherName: string;
  category: string;
  registrationType: string;
  quota: string;
};

const UPDATE_MATERIAL_FEE_PILLS: ActionPill[] = [
  { label: "Fee Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Day Book Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Fee Pending Report", tone: "green", href: "/fms/fee-pending-report" },
  { label: "Fee Print List", tone: "green", href: "/fms/fee-print-list" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Reports", tone: "blue", href: "/fms/fee-pending-report", dropdown: true },
  { label: "Transaction", tone: "blue", href: "/fms/fee-receipt", dropdown: true },
];

const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"];
const FINANCIAL_YEAR_OPTIONS = ["2024-25", "2025-26", "2026-27"];
const ADMISSION_TYPE_OPTIONS = ["New Registration", "Re-Registration"];
const CATEGORY_OPTIONS = ["General", "OBC", "SC", "ST"];

const FEE_MASTER_ROWS: FeeMasterRow[] = [
  {
    id: "mat-1",
    classLabel: "NURSERY",
    classId: "nursery",
    term: "I-Term",
    feeAmount: "3500",
    regType: "New Registration",
    category: "General",
    quota: "General",
    year: "2026",
    financialYear: "2026-27",
  },
  {
    id: "mat-2",
    classLabel: "LKG",
    classId: "lkg",
    term: "I-Term",
    feeAmount: "4200",
    regType: "New Registration",
    category: "General",
    quota: "General",
    year: "2026",
    financialYear: "2026-27",
  },
  {
    id: "mat-3",
    classLabel: "UKG",
    classId: "ukg",
    term: "I-Term",
    feeAmount: "2800",
    regType: "Re-Registration",
    category: "General",
    quota: "General",
    year: "2026",
    financialYear: "2026-27",
  },
];

const STUDENT_MASTER_ROWS: StudentMasterRow[] = [
  {
    id: "stu-1",
    name: "UMME ARIBA DHARWADKAR",
    classLabel: "NURSERY",
    classId: "nursery",
    fatherName: "MOHAMMED ALI",
    category: "General",
    registrationType: "New Registration",
    quota: "General",
  },
  {
    id: "stu-2",
    name: "MEERA IYER",
    classLabel: "LKG",
    classId: "lkg",
    fatherName: "RAVI IYER",
    category: "General",
    registrationType: "New Registration",
    quota: "General",
  },
  {
    id: "stu-3",
    name: "ARJUN SHETTY",
    classLabel: "UKG",
    classId: "ukg",
    fatherName: "SURESH SHETTY",
    category: "General",
    registrationType: "Re-Registration",
    quota: "General",
  },
  {
    id: "stu-4",
    name: "RIYA PATIL",
    classLabel: "NURSERY",
    classId: "nursery",
    fatherName: "ANIL PATIL",
    category: "General",
    registrationType: "New Registration",
    quota: "General",
  },
];

export function UpdateMaterialFeePage() {
  const navigate = useNavigate();
  const [year, setYear] = useState("2026");
  const [financialYear, setFinancialYear] = useState("2026-27");
  const [quota, setQuota] = useState("general");
  const [classId, setClassId] = useState("none");
  const [admissionType, setAdmissionType] = useState("New Registration");
  const [category, setCategory] = useState("General");
  const [hasResult, setHasResult] = useState(false);
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const quotaLabel = QUOTA_OPTIONS.find((item) => item.value === quota)?.label ?? "General";

  const feeRows = useMemo(() => {
    if (!hasResult) return [];
    return FEE_MASTER_ROWS.filter((row) => {
      if (row.year !== year) return false;
      if (row.financialYear !== financialYear) return false;
      if (row.quota !== quotaLabel) return false;
      if (classId !== "none" && row.classId !== classId) return false;
      if (row.regType !== admissionType) return false;
      if (row.category !== category) return false;
      return true;
    });
  }, [admissionType, category, classId, financialYear, hasResult, quotaLabel, year]);

  const studentRows = useMemo(() => {
    if (!hasResult) return [];
    return STUDENT_MASTER_ROWS.filter((row) => {
      if (classId !== "none" && row.classId !== classId) return false;
      if (row.registrationType !== admissionType) return false;
      if (row.category !== category) return false;
      if (row.quota !== quotaLabel) return false;
      return true;
    });
  }, [admissionType, category, classId, hasResult, quotaLabel]);

  const allStudentsSelected =
    studentRows.length > 0 && studentRows.every((row) => selectedStudents.includes(row.id));

  const handleGetResult = () => {
    if (classId === "none") {
      toast.error("Please select Class/Semester");
      return;
    }
    setHasResult(true);
    setSelectedFees([]);
    setSelectedStudents([]);
    toast.success("Material fee and student masters loaded");
  };

  const toggleFee = (id: string) => {
    setSelectedFees((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const toggleStudent = (id: string) => {
    setSelectedStudents((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const toggleAllStudents = (checked: boolean) => {
    setSelectedStudents(checked ? studentRows.map((row) => row.id) : []);
  };

  const handleSubmit = () => {
    if (!hasResult) {
      toast.error("Click Get Result first");
      return;
    }
    if (selectedFees.length === 0 || selectedStudents.length === 0) {
      toast.error("Select at least one material fee and one student");
      return;
    }
    toast.success(
      `Updated ${selectedFees.length} material fee(s) for ${selectedStudents.length} student(s)`,
    );
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#03a9f4]">Update Material Fee</h2>
          <p className="text-sm text-[#6b7280]">
            Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Update Material Fee
          </p>
        </div>
        <ActionPills items={UPDATE_MATERIAL_FEE_PILLS} />
      </div>

      <div className="overflow-hidden rounded-sm border border-[#d7e3ec] bg-white shadow-sm">
        <div className="bg-[#03a9f4] px-4 py-2.5">
          <h3 className="text-sm font-semibold text-white">Update Material Fee</h3>
        </div>
        <div className="space-y-4 p-5">
          <div className="grid gap-4 lg:grid-cols-[repeat(6,minmax(0,1fr))_auto] lg:items-end">
            <FilterSelect label="Year" value={year} onChange={setYear} options={YEAR_OPTIONS} />
            <FilterSelect
              label="Financial Year"
              value={financialYear}
              onChange={setFinancialYear}
              options={FINANCIAL_YEAR_OPTIONS}
            />
            <label className="block space-y-1.5 text-sm text-[#111827]">
              <span>Quota</span>
              <Select value={quota} onValueChange={setQuota}>
                <SelectTrigger className="h-9 bg-white" aria-label="Quota">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUOTA_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="block space-y-1.5 text-sm text-[#111827]">
              <span>
                Class/Semester<span className="text-[#e53935]">*</span>
              </span>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger className="h-9 bg-white" aria-label="Class/Semester">
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">--Select--</SelectItem>
                  {CLASS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <FilterSelect
              label="AdmissionType"
              value={admissionType}
              onChange={setAdmissionType}
              options={ADMISSION_TYPE_OPTIONS}
            />
            <FilterSelect
              label="Category*"
              value={category}
              onChange={setCategory}
              options={CATEGORY_OPTIONS}
              required
            />
            <Button
              type="button"
              className="h-9 rounded-sm bg-[#03a9f4] px-4 text-sm font-semibold text-white hover:bg-[#0288d1]"
              onClick={handleGetResult}
            >
              Get Result
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-semibold text-[#374151]">Result:</p>

        <div className="overflow-hidden rounded-sm border border-[#dbe3ea] bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#03a9f4] hover:bg-[#03a9f4]">
                {["Add", "Class", "Term", "Fee Amount", "Reg. Type", "Category", "Quota"].map(
                  (heading) => (
                    <TableHead key={heading} className="text-xs font-bold text-white">
                      {heading}
                    </TableHead>
                  ),
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {!hasResult ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-16 text-center text-sm text-[#9ca3af]">
                    Fee Master
                  </TableCell>
                </TableRow>
              ) : feeRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-16 text-center text-sm text-[#6b7280]">
                    No material fee master records found
                  </TableCell>
                </TableRow>
              ) : (
                feeRows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={cn(index % 2 === 1 ? "bg-[#f3f9fc]" : "bg-white")}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedFees.includes(row.id)}
                        onCheckedChange={() => toggleFee(row.id)}
                        aria-label={`Add material fee ${row.classLabel}`}
                      />
                    </TableCell>
                    <TableCell>{row.classLabel}</TableCell>
                    <TableCell>{row.term}</TableCell>
                    <TableCell>{row.feeAmount}</TableCell>
                    <TableCell>{row.regType}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.quota}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-[#111827]">
            <Checkbox
              checked={allStudentsSelected}
              onCheckedChange={(checked) => toggleAllStudents(Boolean(checked))}
              disabled={!hasResult || studentRows.length === 0}
              aria-label="Select / Deselect All"
            />
            <span>Select / Deselect All</span>
          </label>

          <div className="overflow-hidden rounded-sm border border-[#dbe3ea] bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#03a9f4] hover:bg-[#03a9f4]">
                  {[
                    "Add",
                    "Name",
                    "Class",
                    "Father Name",
                    "Category",
                    "Registration Type",
                    "Quota",
                  ].map((heading) => (
                    <TableHead key={heading} className="text-xs font-bold text-white">
                      {heading}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!hasResult ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-16 text-center text-sm text-[#9ca3af]">
                      Student Master
                    </TableCell>
                  </TableRow>
                ) : studentRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-16 text-center text-sm text-[#6b7280]">
                      No student master records found
                    </TableCell>
                  </TableRow>
                ) : (
                  studentRows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={cn(index % 2 === 1 ? "bg-[#f3f9fc]" : "bg-white")}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.includes(row.id)}
                          onCheckedChange={() => toggleStudent(row.id)}
                          aria-label={`Add student ${row.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>{row.classLabel}</TableCell>
                      <TableCell>{row.fatherName}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.registrationType}</TableCell>
                      <TableCell>{row.quota}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            className="h-10 rounded-sm bg-[#03a9f4] px-6 text-sm font-semibold text-white hover:bg-[#0288d1]"
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button
            type="button"
            className="h-10 rounded-sm bg-[#9e9e9e] px-6 text-sm font-semibold text-white hover:bg-[#757575]"
            onClick={() => navigate({ to: "/fms/update-student-fee" })}
          >
            Exit
          </Button>
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
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5 text-sm text-[#111827]">
      <span>
        {label.replace(/\*$/, "")}
        {required || label.endsWith("*") ? <span className="text-[#e53935]">*</span> : null}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 bg-white" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
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
