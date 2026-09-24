import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLASS_OPTIONS, SECTION_OPTIONS } from "@/modules/admin-portal/constants";

const COMBINATION_OPTIONS = [
  { value: "general", label: "General" },
  { value: "science", label: "Science" },
  { value: "commerce", label: "Commerce" },
  { value: "arts", label: "Arts" },
];

const ASSESSMENT_OPTIONS = [
  { value: "fa1", label: "Formative Assessment 1" },
  { value: "fa2", label: "Formative Assessment 2" },
  { value: "sa1", label: "Summative Assessment 1" },
  { value: "sa2", label: "Summative Assessment 2" },
];

const EXAM_OPTIONS = [
  { value: "unit-1", label: "Unit Test 1" },
  { value: "mid-term", label: "Mid Term" },
  { value: "unit-2", label: "Unit Test 2" },
  { value: "final", label: "Final Exam" },
];

const STUDENT_OPTIONS = [
  { value: "stu-1", label: "UMME ARIBA DHARWADKAR" },
  { value: "stu-2", label: "MEERA IYER" },
  { value: "stu-3", label: "ARJUN SHETTY" },
  { value: "stu-4", label: "ANANYA RAO" },
  { value: "stu-5", label: "RIYA PATIL" },
];

type FilterFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
};

function RequiredSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "--Select--",
  className,
}: FilterFieldProps) {
  return (
    <label className={`block space-y-1.5 text-sm text-foreground ${className ?? ""}`}>
      <span>
        {label}
        <span className="text-danger">*</span>
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 bg-card" aria-label={label}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">{placeholder}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

export function StudentMarksCardPage() {
  const navigate = useNavigate();
  const [combination, setCombination] = useState("none");
  const [classId, setClassId] = useState("none");
  const [sectionId, setSectionId] = useState("none");
  const [assessment, setAssessment] = useState("none");
  const [exam, setExam] = useState("none");
  const [studentId, setStudentId] = useState("none");
  const [searched, setSearched] = useState(false);

  const filtersReady = useMemo(
    () =>
      combination !== "none" &&
      classId !== "none" &&
      sectionId !== "none" &&
      assessment !== "none" &&
      exam !== "none",
    [assessment, classId, combination, exam, sectionId],
  );

  const handleSearch = () => {
    if (!filtersReady) {
      toast.error("Please select Combination, Class, Section, Assessment and Exam");
      return;
    }
    setSearched(true);
    setStudentId("none");
    toast.success("MarksCard filters loaded. Select a student to print.");
  };

  const handlePrint = () => {
    if (!searched) {
      toast.error("Please search with required filters first");
      return;
    }
    if (studentId === "none") {
      toast.error("Please select Student Name");
      return;
    }
    const student = STUDENT_OPTIONS.find((item) => item.value === studentId);
    toast.success(`Printing MarksCard for ${student?.label ?? "student"}`);
    window.print();
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-5 pb-10">
      <div className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto] lg:items-end">
          <RequiredSelect
            label="Combination"
            value={combination}
            onChange={setCombination}
            options={COMBINATION_OPTIONS}
          />
          <RequiredSelect
            label="Class"
            value={classId}
            onChange={setClassId}
            options={CLASS_OPTIONS}
          />
          <RequiredSelect
            label="Section"
            value={sectionId}
            onChange={setSectionId}
            options={SECTION_OPTIONS}
          />
          <RequiredSelect
            label="Assessment"
            value={assessment}
            onChange={setAssessment}
            options={ASSESSMENT_OPTIONS}
          />
          <RequiredSelect
            label="Exam"
            value={exam}
            onChange={setExam}
            options={EXAM_OPTIONS}
          />
          <Button
            type="button"
            className="h-9 rounded-md bg-info px-6 text-sm font-semibold text-white hover:bg-info/90"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
          <RequiredSelect
            label="Student Name"
            value={studentId}
            onChange={setStudentId}
            options={searched ? STUDENT_OPTIONS : []}
            className="w-full sm:max-w-md"
          />
          <Button
            type="button"
            className="h-9 rounded-md bg-info px-4 text-sm font-semibold text-white hover:bg-info/90"
            onClick={handlePrint}
          >
            <Printer className="size-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          className="h-10 rounded-md bg-muted-foreground px-6 text-sm font-semibold text-white hover:bg-foreground/70"
          onClick={() => navigate({ to: "/academic/class-allocation-report" })}
        >
          Back
        </Button>
        <Button
          type="button"
          className="h-10 rounded-md bg-info px-6 text-sm font-semibold text-white hover:bg-info/90"
          onClick={handlePrint}
        >
          <Printer className="size-4" />
          Print
        </Button>
      </div>
    </div>
  );
}
