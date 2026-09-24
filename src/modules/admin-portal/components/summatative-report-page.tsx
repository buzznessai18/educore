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
    <label className={`block space-y-1.5 text-sm font-semibold text-foreground ${className ?? ""}`}>
      <span>
        {label}
        {required ? <span className="text-danger">*</span> : null}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 font-normal bg-card" aria-label={label}>
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
      <div className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm sm:p-6">
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
            <label className="flex items-center gap-3 text-sm font-semibold text-foreground">
              <span>Get grades</span>
              <Switch
                checked={getGrades}
                onCheckedChange={setGetGrades}
                aria-label="Get grades"
                className="data-[state=checked]:bg-info"
              />
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-3 text-sm font-semibold text-foreground">
            <span>Show/Hide Header</span>
            <Switch
              checked={showHeader}
              onCheckedChange={setShowHeader}
              aria-label="Show or hide header"
              className="data-[state=checked]:bg-info"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            className="h-9 rounded-md bg-info px-5 text-sm font-semibold text-white hover:bg-info/90"
            onClick={handleSearch}
          >
            Search
          </Button>
          <Button
            type="button"
            className="h-9 rounded-md bg-info px-5 text-sm font-semibold text-white hover:bg-info/90"
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
            className="h-10 rounded-md bg-muted-foreground px-6 text-sm font-semibold text-white hover:bg-foreground/70"
            onClick={() => navigate({ to: "/academic/marks-report" })}
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

        <div className="min-h-[220px] rounded-xl border border-border bg-card p-6">
          {!searched ? (
            <p className="text-sm text-muted-foreground/70"> </p>
          ) : (
            <div className="space-y-2 text-sm text-foreground">
              {showHeader ? (
                <div className="border-b border-border pb-3">
                  <p className="text-base font-semibold text-info">Summatative Report</p>
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
              <p className="text-muted-foreground">
                Sample summative outcomes will appear here once backend marks are connected.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
