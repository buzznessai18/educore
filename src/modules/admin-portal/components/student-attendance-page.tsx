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
      <p className="text-sm text-muted-foreground">
        Home <span className="mx-1 text-muted-foreground/70">&gt;</span> Student Attendance
      </p>

      <div className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-enterprise-sm md:grid-cols-[repeat(4,minmax(0,1fr))_auto] md:items-end">
        <label className="block space-y-1.5 text-sm text-foreground">
          <span>Syllabus</span>
          <Select value={syllabus} onValueChange={setSyllabus}>
            <SelectTrigger className="h-9 bg-card" aria-label="Syllabus">
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

        <label className="block space-y-1.5 text-sm text-foreground">
          <span>Level</span>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="h-9 bg-card" aria-label="Level">
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

        <label className="block space-y-1.5 text-sm text-foreground">
          <span>Class</span>
          <Select value={classId} onValueChange={setClassId}>
            <SelectTrigger className="h-9 bg-card" aria-label="Class">
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

        <label className="block space-y-1.5 text-sm text-foreground">
          <span>Select Date</span>
          <Input
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="h-9 bg-card"
            aria-label="Select date"
            placeholder="DD/MM/YYYY HH:mm"
          />
        </label>

        <Button
          type="button"
          className="h-9 rounded-md bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-enterprise-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex flex-wrap gap-1.5">
            {EXPORT_ACTIONS.map((action) => {
              const Icon = exportIcons[action];
              return (
                <Button
                  key={action}
                  type="button"
                  size="sm"
                  className="h-8 rounded-md bg-info px-3 text-xs font-semibold text-white hover:bg-info/90"
                  onClick={() => handleExport(action)}
                >
                  <Icon className="size-3.5" />
                  {action}
                </Button>
              );
            })}
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <span>Search:</span>
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="h-8 w-52 bg-card"
              aria-label="Search attendance table"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
                {TABLE_COLUMNS.map((column) => (
                  <TableHead key={column} className="whitespace-nowrap text-xs font-bold text-foreground">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-28 text-center text-sm text-muted-foreground">
                    No data available in table
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "border-border text-sm",
                      index % 2 === 1 ? "bg-info-soft/50" : "bg-card",
                    )}
                  >
                    <TableCell>{row.studentId}</TableCell>
                    <TableCell>{row.admissionNo}</TableCell>
                    <TableCell className="font-medium text-info">{row.studentName}</TableCell>
                    <TableCell>{row.classSemester}</TableCell>
                    <TableCell>{row.inTime}</TableCell>
                    <TableCell>{row.outTime}</TableCell>
                    <TableCell>{row.totalHours}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableHeader>
              <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
                {TABLE_COLUMNS.map((column) => (
                  <TableHead key={`footer-${column}`} className="whitespace-nowrap text-xs font-bold text-foreground">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
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
