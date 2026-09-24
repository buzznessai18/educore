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
  ActionPills,
  type ActionPill,
} from "@/modules/admin-portal/components/admission-action-pills";
import { ACADEMIC_YEAR_OPTIONS, CLASS_OPTIONS } from "@/modules/admin-portal/constants";

const CHANGE_STUDENT_FEE_PILLS: ActionPill[] = [
  { label: "Fee Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Day Book Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Fee Pending Report", tone: "green", href: "/fms/fee-pending-report" },
  { label: "Fee Print List", tone: "green", href: "/fms/fee-print-list" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Reports", tone: "blue", href: "/fms/fee-pending-report", dropdown: true },
  { label: "Transaction", tone: "blue", href: "/fms/fee-receipt", dropdown: true },
];

const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"];

const STUDENT_OPTIONS = [
  { value: "stu-1", label: "UMME ARIBA DHARWADKAR", classId: "nursery" },
  { value: "stu-2", label: "MEERA IYER", classId: "lkg" },
  { value: "stu-3", label: "ARJUN SHETTY", classId: "ukg" },
  { value: "stu-4", label: "RIYA PATIL", classId: "nursery" },
  { value: "stu-5", label: "ANANYA RAO", classId: "class-8" },
];

export function ChangeStudentFeePage() {
  const [year, setYear] = useState("none");
  const [academicYear, setAcademicYear] = useState("2026-27");
  const [classId, setClassId] = useState("none");
  const [studentId, setStudentId] = useState("none");

  const studentsForClass = useMemo(() => {
    if (classId === "none") return STUDENT_OPTIONS;
    return STUDENT_OPTIONS.filter((student) => student.classId === classId);
  }, [classId]);

  const handleClassChange = (value: string) => {
    setClassId(value);
    setStudentId("none");
  };

  const handleProceed = () => {
    if (year === "none" || academicYear === "none" || classId === "none" || studentId === "none") {
      toast.error("Please select Year, Academic Year, Class and Student");
      return;
    }
    const student = STUDENT_OPTIONS.find((item) => item.value === studentId);
    toast.success(`Ready to change/upgrade fees for ${student?.label ?? "student"}`);
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-info">Change/Upgrade Fees</h2>
          <p className="text-sm text-muted-foreground">
            Home <span className="mx-1 text-muted-foreground/70">&gt;</span> Change/Upgrade Fees
          </p>
        </div>
        <ActionPills items={CHANGE_STUDENT_FEE_PILLS} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-enterprise-sm">
        <div className="bg-info px-4 py-2.5">
          <h3 className="text-sm font-semibold text-white">Change/Upgrade Fees</h3>
        </div>

        <div className="space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block space-y-1.5 text-sm text-foreground">
              <span>
                Year<span className="text-danger">*</span>
              </span>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="h-9 bg-card" aria-label="Year">
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">--Select--</SelectItem>
                  {YEAR_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>
                Academic Year<span className="text-danger">*</span>
              </span>
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger className="h-9 bg-card" aria-label="Academic Year">
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">--Select--</SelectItem>
                  {ACADEMIC_YEAR_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>
                Class<span className="text-danger">*</span>
              </span>
              <Select value={classId} onValueChange={handleClassChange}>
                <SelectTrigger className="h-9 bg-card" aria-label="Class">
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

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>
                Student<span className="text-danger">*</span>
              </span>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger className="h-9 bg-card" aria-label="Student">
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">--Select--</SelectItem>
                  {studentsForClass.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          <Button
            type="button"
            className="h-9 rounded-md bg-info px-5 text-sm font-semibold text-white hover:bg-info/90"
            onClick={handleProceed}
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
}
