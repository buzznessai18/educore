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

const LEVEL_OPTIONS = [
  { value: "primary", label: "Primary" },
  { value: "middle", label: "Middle" },
  { value: "high", label: "High" },
  { value: "pre-primary", label: "Pre-Primary" },
];

const EXAM_TYPE_OPTIONS = [
  { value: "unit-1", label: "Unit Test 1" },
  { value: "mid-term", label: "Mid Term" },
  { value: "unit-2", label: "Unit Test 2" },
  { value: "final", label: "Final Exam" },
  { value: "sa1", label: "Summative Assessment 1" },
  { value: "sa2", label: "Summative Assessment 2" },
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
  required?: boolean;
  className?: string;
};

function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "--Select--",
  required = true,
  className,
}: FilterFieldProps) {
  return (
    <label className={`block space-y-1.5 text-sm text-[#111827] ${className ?? ""}`}>
      <span>
        {label}
        {required ? <span className="text-[#e53935]">*</span> : null}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 bg-white" aria-label={label}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={placeholder === "--ALL--" ? "all" : "none"}>
            {placeholder}
          </SelectItem>
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

export function MarksReportPage() {
  const navigate = useNavigate();
  const [level, setLevel] = useState("none");
  const [classId, setClassId] = useState("none");
  const [sectionId, setSectionId] = useState("none");
  const [examType, setExamType] = useState("none");
  const [studentId, setStudentId] = useState("all");
  const [searched, setSearched] = useState(false);

  const filtersReady = useMemo(
    () => level !== "none" && classId !== "none" && sectionId !== "none" && examType !== "none",
    [classId, examType, level, sectionId],
  );

  const handleSearch = () => {
    if (!filtersReady) {
      toast.error("Please select Level, Class, Section and Exam Type");
      return;
    }
    setSearched(true);
    toast.success("Marks report filters loaded");
  };

  const handlePrint = (withoutHeader = false) => {
    if (!searched) {
      toast.error("Please search with required filters first");
      return;
    }
    const studentLabel =
      studentId === "all"
        ? "all students"
        : (STUDENT_OPTIONS.find((item) => item.value === studentId)?.label ?? "student");
    toast.success(
      withoutHeader
        ? `Printing marks report without header for ${studentLabel}`
        : `Printing marks report for ${studentLabel}`,
    );
    window.print();
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-10 pb-10">
      <div className="rounded-sm border border-[#d7e3ec] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <FilterSelect
              label="Level"
              value={level}
              onChange={setLevel}
              options={LEVEL_OPTIONS}
            />
            <FilterSelect
              label="Class"
              value={classId}
              onChange={setClassId}
              options={CLASS_OPTIONS}
            />
            <FilterSelect
              label="Section"
              value={sectionId}
              onChange={setSectionId}
              options={SECTION_OPTIONS}
            />
            <FilterSelect
              label="Exam Type"
              value={examType}
              onChange={setExamType}
              options={EXAM_TYPE_OPTIONS}
            />
            <FilterSelect
              label="Student Name"
              value={studentId}
              onChange={setStudentId}
              options={STUDENT_OPTIONS}
              placeholder="--ALL--"
            />
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <Button
              type="button"
              className="h-8 rounded-sm bg-[#03a9f4] px-4 text-sm font-semibold text-white hover:bg-[#0288d1]"
              onClick={handleSearch}
            >
              Search
            </Button>
            <Button
              type="button"
              className="h-10 rounded-sm bg-[#03a9f4] px-5 text-sm font-semibold text-white hover:bg-[#0288d1]"
              onClick={() => handlePrint(false)}
            >
              <Printer className="size-4" />
              Print
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          className="h-10 rounded-sm bg-[#9e9e9e] px-6 text-sm font-semibold text-white hover:bg-[#757575]"
          onClick={() => navigate({ to: "/academic/marks-card" })}
        >
          Back
        </Button>
        <Button
          type="button"
          className="h-10 rounded-sm bg-[#03a9f4] px-6 text-sm font-semibold text-white hover:bg-[#0288d1]"
          onClick={() => handlePrint(false)}
        >
          <Printer className="size-4" />
          Print
        </Button>
        <Button
          type="button"
          className="h-10 rounded-sm bg-[#03a9f4] px-6 text-sm font-semibold text-white hover:bg-[#0288d1]"
          onClick={() => handlePrint(true)}
        >
          <Printer className="size-4" />
          Print without Header
        </Button>
      </div>
    </div>
  );
}
