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
import { Switch } from "@/components/ui/switch";
import {
  ACADEMIC_YEAR_OPTIONS,
  CLASS_OPTIONS,
  SECTION_OPTIONS,
} from "@/modules/admin-portal/constants";

const LEVEL_OPTIONS = [
  { value: "primary", label: "Primary" },
  { value: "middle", label: "Middle" },
  { value: "high", label: "High" },
  { value: "pre-primary", label: "Pre-Primary" },
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
  const emptyValue = placeholder === "--ALL" || placeholder === "--ALL--" ? "all" : "none";

  return (
    <label className={`block space-y-1.5 text-sm font-semibold text-[#111827] ${className ?? ""}`}>
      <span>
        {label}
        {required ? <span className="text-[#e53935]">*</span> : null}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 font-normal bg-white" aria-label={label}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={emptyValue}>{placeholder}</SelectItem>
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

export function SummatativeReportPage() {
  const navigate = useNavigate();
  const [year, setYear] = useState("2026");
  const [level, setLevel] = useState("none");
  const [classId, setClassId] = useState("none");
  const [sectionId, setSectionId] = useState("none");
  const [studentId, setStudentId] = useState("all");
  const [getGrades, setGetGrades] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [searched, setSearched] = useState(false);

  const filtersReady = useMemo(
    () => year !== "none" && level !== "none" && classId !== "none" && sectionId !== "none",
    [classId, level, sectionId, year],
  );

  const handleSearch = () => {
    if (!filtersReady) {
      toast.error("Please select Year, Level, Class and Section");
      return;
    }
    setSearched(true);
    toast.success("Summatative report loaded");
  };

  const handlePrint = () => {
    if (!searched) {
      toast.error("Please search with required filters first");
      return;
    }
    const studentLabel =
      studentId === "all"
        ? "all students"
        : (STUDENT_OPTIONS.find((item) => item.value === studentId)?.label ?? "student");
    toast.success(
      `Printing summatative report for ${studentLabel}${getGrades ? " with grades" : ""}${
        showHeader ? " (with header)" : " (without header)"
      }`,
    );
    window.print();
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 pb-10">
      <div className="rounded-sm border border-[#d7e3ec] bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:items-end">
          <FilterSelect
            label="Year"
            value={year}
            onChange={setYear}
            options={ACADEMIC_YEAR_OPTIONS}
          />
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
            label="Student Name"
            value={studentId}
            onChange={setStudentId}
            options={STUDENT_OPTIONS}
            placeholder="--ALL"
            required={false}
          />
          <div className="flex h-full items-end pb-1">
            <label className="flex items-center gap-3 text-sm font-semibold text-[#111827]">
              <span>Get grades</span>
              <Switch
                checked={getGrades}
                onCheckedChange={setGetGrades}
                aria-label="Get grades"
                className="data-[state=checked]:bg-[#03a9f4]"
              />
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-3 text-sm font-semibold text-[#111827]">
            <span>Show/Hide Header</span>
            <Switch
              checked={showHeader}
              onCheckedChange={setShowHeader}
              aria-label="Show or hide header"
              className="data-[state=checked]:bg-[#03a9f4]"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            className="h-9 rounded-sm bg-[#03a9f4] px-5 text-sm font-semibold text-white hover:bg-[#0288d1]"
            onClick={handleSearch}
          >
            Search
          </Button>
          <Button
            type="button"
            className="h-9 rounded-sm bg-[#03a9f4] px-5 text-sm font-semibold text-white hover:bg-[#0288d1]"
            onClick={handlePrint}
          >
            <Printer className="size-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            className="h-10 rounded-sm bg-[#9e9e9e] px-6 text-sm font-semibold text-white hover:bg-[#757575]"
            onClick={() => navigate({ to: "/academic/marks-report" })}
          >
            Back
          </Button>
          <Button
            type="button"
            className="h-10 rounded-sm bg-[#03a9f4] px-6 text-sm font-semibold text-white hover:bg-[#0288d1]"
            onClick={handlePrint}
          >
            <Printer className="size-4" />
            Print
          </Button>
        </div>

        <div className="min-h-[220px] rounded-sm border border-[#e5e7eb] bg-white p-6">
          {!searched ? (
            <p className="text-sm text-[#9ca3af]"> </p>
          ) : (
            <div className="space-y-2 text-sm text-[#374151]">
              {showHeader ? (
                <div className="border-b border-[#e5e7eb] pb-3">
                  <p className="text-base font-semibold text-[#0288d1]">Summatative Report</p>
                  <p>
                    Year {year} · Level{" "}
                    {LEVEL_OPTIONS.find((item) => item.value === level)?.label} · Class{" "}
                    {CLASS_OPTIONS.find((item) => item.value === classId)?.label}
                  </p>
                </div>
              ) : null}
              <p>
                Report ready for{" "}
                {studentId === "all"
                  ? "all students"
                  : STUDENT_OPTIONS.find((item) => item.value === studentId)?.label}
                {getGrades ? " with grade columns enabled." : "."}
              </p>
              <p className="text-[#6b7280]">
                Sample summative outcomes will appear here once backend marks are connected.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
