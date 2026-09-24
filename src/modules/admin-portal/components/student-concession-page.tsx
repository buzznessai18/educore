import { useMemo, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  ActionPills,
  type ActionPill,
} from "@/modules/admin-portal/components/admission-action-pills";
import { CLASS_OPTIONS } from "@/modules/admin-portal/constants";

const STUDENT_CONCESSION_PILLS: ActionPill[] = [
  { label: "Fee Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Day Book Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Fee Pending Report", tone: "green", href: "/fms/fee-pending-report" },
  { label: "Fee Print List", tone: "green", href: "/fms/fee-print-list" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Reports", tone: "blue", href: "/fms/fee-pending-report", dropdown: true },
  { label: "Transaction", tone: "blue", href: "/fms/fee-receipt", dropdown: true },
];

const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"];
const FYID_OPTIONS = ["2024-25", "2025-26", "2026-27"];

const STUDENT_OPTIONS = [
  { value: "stu-1", label: "UMME ARIBA DHARWADKAR", classId: "nursery", father: "MOHAMMED ALI" },
  { value: "stu-2", label: "MEERA IYER", classId: "lkg", father: "RAVI IYER" },
  { value: "stu-3", label: "ARJUN SHETTY", classId: "ukg", father: "SURESH SHETTY" },
  { value: "stu-4", label: "RIYA PATIL", classId: "nursery", father: "ANIL PATIL" },
  { value: "stu-5", label: "ANANYA RAO", classId: "class-8", father: "VIJAY RAO" },
];

export function StudentConcessionPage() {
  const [yearName, setYearName] = useState("none");
  const [fyid, setFyid] = useState("none");
  const [classId, setClassId] = useState("none");
  const [studentId, setStudentId] = useState("none");
  const [remarks, setRemarks] = useState("");
  const [fileName, setFileName] = useState("");

  const studentsForClass = useMemo(() => {
    if (classId === "none") return STUDENT_OPTIONS;
    return STUDENT_OPTIONS.filter((student) => student.classId === classId);
  }, [classId]);

  const fatherName = useMemo(() => {
    return STUDENT_OPTIONS.find((student) => student.value === studentId)?.father ?? "";
  }, [studentId]);

  const handleClassChange = (value: string) => {
    setClassId(value);
    setStudentId("none");
  };

  const handleSave = () => {
    if (classId === "none" || studentId === "none") {
      toast.error("Please select Class and Student");
      return;
    }
    const student = STUDENT_OPTIONS.find((item) => item.value === studentId);
    toast.success(`Concession saved for ${student?.label ?? "student"}`);
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-info">Student Concession</h2>
          <p className="text-sm text-muted-foreground">
            Home <span className="mx-1 text-muted-foreground/70">&gt;</span> Student Concession
          </p>
        </div>
        <ActionPills items={STUDENT_CONCESSION_PILLS} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-enterprise-sm">
        <div className="bg-info px-4 py-2.5">
          <h3 className="text-sm font-semibold text-white">Student Concession</h3>
        </div>

        <div className="space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <label className="block space-y-1.5 text-sm text-foreground">
              <span>YearName</span>
              <Select value={yearName} onValueChange={setYearName}>
                <SelectTrigger className="h-9 bg-card" aria-label="YearName">
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
              <span>FYID</span>
              <Select value={fyid} onValueChange={setFyid}>
                <SelectTrigger className="h-9 bg-card" aria-label="FYID">
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">--Select--</SelectItem>
                  {FYID_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
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

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>FatherName</span>
              <Input
                value={fatherName}
                readOnly
                className="h-9 bg-muted text-muted-foreground"
                aria-label="FatherName"
              />
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <label className="block space-y-1.5 text-sm text-foreground">
              <span>Attachment</span>
              <Input
                type="file"
                className="h-9 cursor-pointer bg-card file:mr-3 file:border-0 file:bg-muted file:px-2 file:text-sm"
                aria-label="Attachment"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setFileName(file?.name ?? "");
                }}
              />
              <span className="block text-xs text-muted-foreground">
                {fileName || "No file chosen"}
              </span>
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>Remarks</span>
              <Textarea
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Remarks.."
                className="min-h-[96px] bg-card"
                aria-label="Remarks"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="h-9 rounded-md bg-info px-5 text-sm font-semibold text-white hover:bg-info/90"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              type="button"
              className="h-9 rounded-md bg-muted-foreground px-5 text-sm font-semibold text-white hover:bg-foreground/70"
              onClick={() => {
                setYearName("none");
                setFyid("none");
                setClassId("none");
                setStudentId("none");
                setRemarks("");
                setFileName("");
                toast.message("Concession form cleared");
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
