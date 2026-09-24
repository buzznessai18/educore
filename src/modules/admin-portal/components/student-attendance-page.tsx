import { useMemo, useState } from "react";
import { Copy, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { CLASS_OPTIONS, EXPORT_ACTIONS, type ExportAction } from "@/modules/admin-portal/constants";
import { cn } from "@/lib/utils";

type AttendanceRow = {
  id: string;
  studentId: string;
  admissionNo: string;
  studentName: string;
  classSemester: string;
  inTime: string;
  outTime: string;
  totalHours: string;
  syllabus: string;
  level: string;
  classId: string;
};

const SYLLABUS_OPTIONS = [
  { value: "all", label: "--All--" },
  { value: "state", label: "State" },
  { value: "cbse", label: "CBSE" },
  { value: "icse", label: "ICSE" },
];

const LEVEL_OPTIONS = [
  { value: "all", label: "--All--" },
  { value: "primary", label: "Primary" },
  { value: "middle", label: "Middle" },
  { value: "high", label: "High" },
  { value: "pre-primary", label: "Pre-Primary" },
];

const DEMO_ATTENDANCE_ROWS: AttendanceRow[] = [
  {
    id: "att-1",
    studentId: "STU-1001",
    admissionNo: "468",
    studentName: "UMME ARIBA DHARWADKAR",
    classSemester: "NURSERY",
    inTime: "08:45",
    outTime: "13:30",
    totalHours: "4:45",
    syllabus: "state",
    level: "pre-primary",
    classId: "nursery",
  },
  {
    id: "att-2",
    studentId: "STU-1002",
    admissionNo: "466",
    studentName: "MEERA IYER",
    classSemester: "LKG",
    inTime: "08:50",
    outTime: "13:20",
    totalHours: "4:30",
    syllabus: "state",
    level: "pre-primary",
    classId: "lkg",
  },
  {
    id: "att-3",
    studentId: "STU-1018",
    admissionNo: "441",
    studentName: "AARAV MEHTA",
    classSemester: "Class 10",
    inTime: "08:40",
    outTime: "15:10",
    totalHours: "6:30",
    syllabus: "cbse",
    level: "high",
    classId: "class-10",
  },
];

const PAGE_SIZE = 10;

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

const TABLE_COLUMNS = [
  "StudentId",
  "AdmissionNo",
  "Student Name",
  "Class/Semester",
  "In Time",
  "Out Time",
  "Total Hours",
] as const;

export function StudentAttendancePage() {
  const [syllabus, setSyllabus] = useState("all");
  const [level, setLevel] = useState("all");
  const [classId, setClassId] = useState("all");
  const [selectedDate, setSelectedDate] = useState("24/09/2026 00:00");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [sourceRows, setSourceRows] = useState<AttendanceRow[]>([]);

  const filteredRows = useMemo(() => {
    if (!hasSearched) return [];
    const query = search.trim().toLowerCase();
    return sourceRows.filter((row) => {
      if (syllabus !== "all" && row.syllabus !== syllabus) return false;
      if (level !== "all" && row.level !== level) return false;
      if (classId !== "all" && row.classId !== classId) return false;
      if (!query) return true;
      return [row.studentId, row.admissionNo, row.studentName, row.classSemester, row.inTime, row.outTime, row.totalHours]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [classId, hasSearched, level, search, sourceRows, syllabus]);

  const total = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE;
  const endIndex = total === 0 ? 0 : Math.min(startIndex + PAGE_SIZE, total);
  const pageRows = filteredRows.slice(startIndex, endIndex);

  const handleSearch = () => {
    setHasSearched(true);
    setSourceRows(DEMO_ATTENDANCE_ROWS);
    setPage(1);
    toast.success(`Attendance loaded for ${selectedDate}`);
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      if (filteredRows.length === 0) {
        toast.message("No data available to copy");
        return;
      }
      const text = filteredRows
        .map(
          (row) =>
            `${row.studentId}\t${row.admissionNo}\t${row.studentName}\t${row.classSemester}\t${row.inTime}\t${row.outTime}\t${row.totalHours}`,
        )
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Attendance copied to clipboard"),
        () => toast.error("Unable to copy attendance"),
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
    <div className="mx-auto max-w-[1200px] space-y-4 pb-10">
      <p className="text-sm text-[#6b7280]">
        Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Student Attendance
      </p>

      <div className="grid gap-3 rounded-sm border border-[#d7e3ec] bg-white p-4 shadow-sm md:grid-cols-[repeat(4,minmax(0,1fr))_auto] md:items-end">
        <label className="block space-y-1.5 text-sm text-[#374151]">
          <span>Syllabus</span>
          <Select value={syllabus} onValueChange={setSyllabus}>
            <SelectTrigger className="h-9 bg-white" aria-label="Syllabus">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SYLLABUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="block space-y-1.5 text-sm text-[#374151]">
          <span>Level</span>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="h-9 bg-white" aria-label="Level">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEVEL_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="block space-y-1.5 text-sm text-[#374151]">
          <span>Class</span>
          <Select value={classId} onValueChange={setClassId}>
            <SelectTrigger className="h-9 bg-white" aria-label="Class">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">--All--</SelectItem>
              {CLASS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="block space-y-1.5 text-sm text-[#374151]">
          <span>Select Date</span>
          <Input
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="h-9 bg-white"
            aria-label="Select date"
            placeholder="DD/MM/YYYY HH:mm"
          />
        </label>

        <Button
          type="button"
          className="h-9 rounded-sm bg-[#7e57c2] px-5 text-sm font-semibold text-white hover:bg-[#673ab7]"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      <div className="overflow-hidden rounded-sm border border-[#dbe3ea] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dbe3ea] px-4 py-3">
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
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="h-8 w-52 bg-white"
              aria-label="Search attendance table"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#dbe3ea] bg-[#f8fafc] hover:bg-[#f8fafc]">
                {TABLE_COLUMNS.map((column) => (
                  <TableHead key={column} className="whitespace-nowrap text-xs font-bold text-[#374151]">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-28 text-center text-sm text-[#6b7280]">
                    No data available in table
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "border-[#e5eaf0] text-sm",
                      index % 2 === 1 ? "bg-[#f3f9fc]" : "bg-white",
                    )}
                  >
                    <TableCell>{row.studentId}</TableCell>
                    <TableCell>{row.admissionNo}</TableCell>
                    <TableCell className="font-medium text-[#0288d1]">{row.studentName}</TableCell>
                    <TableCell>{row.classSemester}</TableCell>
                    <TableCell>{row.inTime}</TableCell>
                    <TableCell>{row.outTime}</TableCell>
                    <TableCell>{row.totalHours}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableHeader>
              <TableRow className="border-[#dbe3ea] bg-[#f8fafc] hover:bg-[#f8fafc]">
                {TABLE_COLUMNS.map((column) => (
                  <TableHead key={`footer-${column}`} className="whitespace-nowrap text-xs font-bold text-[#374151]">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#dbe3ea] px-4 py-3">
          <p className="text-sm text-[#6b7280]">
            Showing {total === 0 ? 0 : startIndex + 1} to {endIndex} of {total} entries
          </p>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    setPage((current) => Math.max(1, current - 1));
                  }}
                  className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    setPage((current) => Math.min(totalPages, current + 1));
                  }}
                  className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
