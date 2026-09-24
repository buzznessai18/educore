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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StudentTcActionPills } from "@/modules/admin-portal/components/admission-action-pills";
import { EXPORT_ACTIONS, type ExportAction } from "@/modules/admin-portal/constants";
import { cn } from "@/lib/utils";

type WithheldRow = {
  id: string;
  studentName: string;
  fatherName: string;
  fatherNo: string;
  course: string;
  semester: string;
};

/** Seed list — empty by default to match the reference screen; toggle for demo data. */
const MOCK_WITHHELD_ROWS: WithheldRow[] = [];

const DEMO_WITHHELD_ROWS: WithheldRow[] = [
  {
    id: "wh-1",
    studentName: "Nisha Paul",
    fatherName: "Ramesh Paul",
    fatherNo: "9876501234",
    course: "State",
    semester: "IX",
  },
  {
    id: "wh-2",
    studentName: "Rehan Thomas",
    fatherName: "N/A",
    fatherNo: "9123456780",
    course: "State",
    semester: "XI",
  },
  {
    id: "wh-3",
    studentName: "Zara Khan",
    fatherName: "Imran Khan",
    fatherNo: "9811122233",
    course: "State",
    semester: "VIII",
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

export function WithheldListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsSource, setRowsSource] = useState<WithheldRow[]>(MOCK_WITHHELD_ROWS);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rowsSource;
    return rowsSource.filter((row) =>
      [row.studentName, row.fatherName, row.fatherNo, row.course, row.semester]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [rowsSource, search]);

  const total = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE;
  const endIndex = total === 0 ? 0 : Math.min(startIndex + PAGE_SIZE, total);
  const pageRows = filteredRows.slice(startIndex, endIndex);

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      if (filteredRows.length === 0) {
        toast.message("No data available to copy");
        return;
      }
      const text = filteredRows
        .map(
          (row) =>
            `${row.studentName}\t${row.fatherName}\t${row.fatherNo}\t${row.course}\t${row.semester}`,
        )
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Withhold list copied to clipboard"),
        () => toast.error("Unable to copy list"),
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
          Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Applicable for WithHold List
        </p>
        <StudentTcActionPills />
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
          {rowsSource.length === 0 ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 rounded-sm text-xs"
              onClick={() => {
                setRowsSource(DEMO_WITHHELD_ROWS);
                setPage(1);
                toast.success("Sample withhold records loaded");
              }}
            >
              Load sample
            </Button>
          ) : null}
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
            aria-label="Search withhold list"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-sm border border-[#dbe3ea] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#dbe3ea] bg-[#f8fafc] hover:bg-[#f8fafc]">
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">
                  Student Name
                </TableHead>
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">
                  Father/husband Name
                </TableHead>
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">
                  Father/Husband No.
                </TableHead>
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">
                  Course
                </TableHead>
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">
                  Semester
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-28 text-center text-sm text-[#6b7280]">
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
                    <TableCell>
                      <button
                        type="button"
                        className="font-medium text-[#0288d1] hover:underline"
                        onClick={() => toast.info(`Open profile: ${row.studentName}`)}
                      >
                        {row.studentName}
                      </button>
                    </TableCell>
                    <TableCell>{row.fatherName}</TableCell>
                    <TableCell>{row.fatherNo}</TableCell>
                    <TableCell>{row.course}</TableCell>
                    <TableCell>{row.semester}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
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
