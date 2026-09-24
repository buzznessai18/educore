import { useMemo, useState } from "react";
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
import { AcademicActionPills } from "@/modules/admin-portal/components/admission-action-pills";
import { cn } from "@/lib/utils";

const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"];

const FACULTY_OPTIONS = [
  { value: "daniel-fernandes", label: "Daniel Fernandes" },
  { value: "meera-kapoor", label: "Meera Kapoor" },
  { value: "ananya-rao", label: "Ananya Rao" },
  { value: "priya-nair", label: "Priya Nair" },
];

type FeedbackRow = {
  id: string;
  student: string;
  className: string;
  faculty: string;
  rating: string;
  comment: string;
  submitted: string;
};

const MOCK_FEEDBACK: FeedbackRow[] = [
  {
    id: "fb-1",
    student: "AARAV MEHTA",
    className: "10-A",
    faculty: "Daniel Fernandes",
    rating: "4.5",
    comment: "Clear explanation and good classroom engagement.",
    submitted: "20/Sep/2026",
  },
  {
    id: "fb-2",
    student: "MAYA IYER",
    className: "9-C",
    faculty: "Meera Kapoor",
    rating: "3.8",
    comment: "Would like more practice worksheets.",
    submitted: "19/Sep/2026",
  },
  {
    id: "fb-3",
    student: "REHAN THOMAS",
    className: "11-B",
    faculty: "Ananya Rao",
    rating: "4.2",
    comment: "Lab sessions are helpful and well organized.",
    submitted: "18/Sep/2026",
  },
  {
    id: "fb-4",
    student: "NISHA PAUL",
    className: "9-C",
    faculty: "Daniel Fernandes",
    rating: "4.0",
    comment: "Good support during revision classes.",
    submitted: "17/Sep/2026",
  },
];

export function StudentFeedbackReportPage() {
  const [year, setYear] = useState("2026");
  const [showComments, setShowComments] = useState(false);
  const [faculty, setFaculty] = useState("none");
  const [hasSearched, setHasSearched] = useState(false);

  const rows = useMemo(() => {
    if (!hasSearched || faculty === "none") return [];
    const selected = FACULTY_OPTIONS.find((option) => option.value === faculty);
    if (!selected) return [];
    return MOCK_FEEDBACK.filter((row) => row.faculty === selected.label);
  }, [faculty, hasSearched]);

  const handleSearch = () => {
    if (faculty === "none") {
      toast.error("Please select Faculty");
      return;
    }
    setHasSearched(true);
    toast.success("Feedback report loaded");
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-4 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-[#6b7280]">
          Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Student FeedBack Report
        </p>
        <AcademicActionPills />
      </div>

      <div className="overflow-hidden rounded-sm border border-[#d7e3ec] bg-white shadow-sm">
        <div className="bg-[#03a9f4] px-4 py-2.5">
          <h2 className="text-sm font-semibold text-white">Student FeedBack Report</h2>
        </div>

        <div className="space-y-5 p-5">
          <div className="grid gap-4 md:grid-cols-[140px_auto_minmax(0,260px)_auto] md:items-end">
            <label className="block space-y-1.5 text-sm text-[#374151]">
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

            <label className="flex h-9 items-center gap-2 self-end text-sm text-[#374151]">
              <Checkbox
                checked={showComments}
                onCheckedChange={(value) => setShowComments(value === true)}
                aria-label="Show Comments"
              />
              <span>Show Comments</span>
            </label>

            <label className="block space-y-1.5 text-sm text-[#374151]">
              <span>
                Faculty<span className="text-[#e53935]">*</span>
              </span>
              <Select value={faculty} onValueChange={setFaculty}>
                <SelectTrigger className="h-9 bg-white" aria-label="Faculty">
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">--Select--</SelectItem>
                  {FACULTY_OPTIONS.map((option) => (
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
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>

          {!hasSearched || rows.length === 0 ? (
            <div className="grid min-h-40 place-items-center text-sm text-[#6b7280]">
              No feedback Recorded
            </div>
          ) : (
            <div className="overflow-hidden rounded-sm border border-[#dbe3ea]">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                      <TableHead className="text-xs font-bold">SlNo.</TableHead>
                      <TableHead className="text-xs font-bold">Student</TableHead>
                      <TableHead className="text-xs font-bold">Class</TableHead>
                      <TableHead className="text-xs font-bold">Faculty</TableHead>
                      <TableHead className="text-xs font-bold">Rating</TableHead>
                      {showComments ? (
                        <TableHead className="text-xs font-bold">Comments</TableHead>
                      ) : null}
                      <TableHead className="text-xs font-bold">Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        className={cn(index % 2 === 1 ? "bg-[#f3f9fc]" : "bg-white")}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium text-[#0288d1]">{row.student}</TableCell>
                        <TableCell>{row.className}</TableCell>
                        <TableCell>{row.faculty}</TableCell>
                        <TableCell>{row.rating}</TableCell>
                        {showComments ? <TableCell className="max-w-xs">{row.comment}</TableCell> : null}
                        <TableCell>{row.submitted}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
