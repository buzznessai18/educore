import { useMemo, useState } from "react";
import { Copy, FileSpreadsheet, FileText, Printer } from "lucide-react";
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
import { EXPORT_ACTIONS, SECTION_OPTIONS, type ExportAction } from "@/modules/admin-portal/constants";
import { cn } from "@/lib/utils";

type AllocationRow = {
  id: string;
  slNo: number;
  faculty: string;
  className: string;
  subject: string;
  year: string;
  sectionId: string;
};

const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"];

const CLASS_ALLOCATION_PILLS: ActionPill[] = [
  { label: "Enter Student Attendance", tone: "green", href: "/academic/attendance" },
  { label: "Update Student Attendance", tone: "green", href: "/academic/attendance" },
  { label: "Enter Student Marks", tone: "green", href: "/academic/marks-report" },
  { label: "Update Student Marks", tone: "green", href: "/academic/marks-card" },
  { label: "Lesson Update", tone: "green", href: "/learning/lessons" },
  { label: "Reports", tone: "blue", href: "/academic/class-allocation-report", dropdown: true },
  { label: "Transaction", tone: "blue", dropdown: true },
];

const MOCK_ALLOCATIONS: AllocationRow[] = [
  {
    id: "alloc-1",
    slNo: 1,
    faculty: "Mohammed Zubair Dafedar",
    className: "IX A Section",
    subject: "Science",
    year: "2026",
    sectionId: "a",
  },
  {
    id: "alloc-2",
    slNo: 2,
    faculty: "Mohammed Zubair Dafedar",
    className: "IX HINDI",
    subject: "Science",
    year: "2026",
    sectionId: "a",
  },
  {
    id: "alloc-3",
    slNo: 3,
    faculty: "Mohammed Zubair Dafedar",
    className: "VIII A Section",
    subject: "Science",
    year: "2026",
    sectionId: "a",
  },
  {
    id: "alloc-4",
    slNo: 4,
    faculty: "Priya Nair",
    className: "X A Section",
    subject: "Mathematics",
    year: "2026",
    sectionId: "a",
  },
  {
    id: "alloc-5",
    slNo: 5,
    faculty: "Meera Kapoor",
    className: "IX B Section",
    subject: "English",
    year: "2026",
    sectionId: "b",
  },
  {
    id: "alloc-6",
    slNo: 6,
    faculty: "Ananya Rao",
    className: "XI A Section",
    subject: "Physics",
    year: "2026",
    sectionId: "a",
  },
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

export function ClassAllocationReportPage() {
  const [year, setYear] = useState("none");
  const [sectionId, setSectionId] = useState("all");
  const [search, setSearch] = useState("");
  const [hasShown, setHasShown] = useState(false);

  const rows = useMemo(() => {
    if (!hasShown) return [];
    const query = search.trim().toLowerCase();
    return MOCK_ALLOCATIONS.filter((row) => {
      if (year !== "none" && row.year !== year) return false;
      if (sectionId !== "all" && row.sectionId !== sectionId) return false;
      if (!query) return true;
      return [row.faculty, row.className, row.subject].join(" ").toLowerCase().includes(query);
    }).map((row, index) => ({ ...row, slNo: index + 1 }));
  }, [hasShown, search, sectionId, year]);

  const handleShow = () => {
    if (year === "none") {
      toast.error("Please select Year");
      return;
    }
    setHasShown(true);
    toast.success("Subject faculty allocation loaded");
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      if (rows.length === 0) {
        toast.message("No data available to copy");
        return;
      }
      const text = rows
        .map((row) => `${row.slNo}\t${row.faculty}\t${row.className}\t${row.subject}`)
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Allocation report copied"),
        () => toast.error("Unable to copy report"),
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-[#6b7280]">
          Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Subject Faculty Info
        </p>
        <ActionPills items={CLASS_ALLOCATION_PILLS} />
      </div>

      <div className="overflow-hidden rounded-sm border border-[#d7e3ec] bg-white shadow-sm">
        <div className="bg-[#03a9f4] px-4 py-2.5">
          <h2 className="text-sm font-semibold text-white">Subject Faculty Info</h2>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid gap-4 md:grid-cols-[180px_220px_auto] md:items-end">
            <label className="block space-y-1.5 text-sm text-[#374151]">
              <span>
                Year<span className="text-[#e53935]">*</span>
              </span>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="h-9 bg-white" aria-label="Year">
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

            <label className="block space-y-1.5 text-sm text-[#374151]">
              <span>
                Section<span className="text-[#e53935]">*</span>
              </span>
              <Select value={sectionId} onValueChange={setSectionId}>
                <SelectTrigger className="h-9 bg-white" aria-label="Section">
                  <SelectValue placeholder="--ALL--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">--ALL--</SelectItem>
                  {SECTION_OPTIONS.map((option) => (
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
              onClick={handleShow}
            >
              SHOW
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
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
                onChange={(event) => setSearch(event.target.value)}
                className="h-8 w-52 bg-white"
                aria-label="Search subject faculty info"
              />
            </label>
          </div>

          <div className="overflow-hidden rounded-sm border border-[#dbe3ea]">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                    <TableHead className="text-xs font-bold">SL No</TableHead>
                    <TableHead className="text-xs font-bold">Faculty</TableHead>
                    <TableHead className="text-xs font-bold">Class</TableHead>
                    <TableHead className="text-xs font-bold">Subject</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!hasShown ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-28 text-center text-sm text-[#6b7280]">
                        Select Year and click SHOW to load subject faculty allocation.
                      </TableCell>
                    </TableRow>
                  ) : rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-28 text-center text-sm text-[#6b7280]">
                        No data available in table
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        className={cn(index % 2 === 1 ? "bg-[#f3f9fc]" : "bg-white")}
                      >
                        <TableCell>{row.slNo}</TableCell>
                        <TableCell className="font-medium text-[#0288d1]">{row.faculty}</TableCell>
                        <TableCell>{row.className}</TableCell>
                        <TableCell>{row.subject}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
