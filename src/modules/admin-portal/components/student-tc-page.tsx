import { useMemo, useState } from "react";
import { Copy, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type TcRow = {
  id: string;
  studentName: string;
  fatherName: string;
  fatherNo: string;
  course: string;
  semester: string;
};

const MOCK_TC_ROWS: TcRow[] = [
  {
    id: "tc-1",
    studentName: "Abdul Ajiz Tamboli",
    fatherName: "N/A",
    fatherNo: "9731122001",
    course: "State",
    semester: "I",
  },
  {
    id: "tc-2",
    studentName: "Abu Zaid Shaikh",
    fatherName: "Imran Shaikh",
    fatherNo: "9845011223",
    course: "State",
    semester: "VI",
  },
  {
    id: "tc-3",
    studentName: "Aliya Nijamuddin Betageri",
    fatherName: "Nijamuddin Betageri",
    fatherNo: "9739672909",
    course: "State",
    semester: "III",
  },
  {
    id: "tc-4",
    studentName: "Ayesha Fatima Pathan",
    fatherName: "Rashid Pathan",
    fatherNo: "9001122334",
    course: "State",
    semester: "VII",
  },
  {
    id: "tc-5",
    studentName: "Mohammed Rehan Khan",
    fatherName: "N/A",
    fatherNo: "9811122233",
    course: "State",
    semester: "UKG",
  },
  {
    id: "tc-6",
    studentName: "Sana Mirza",
    fatherName: "Javed Mirza",
    fatherNo: "9123456780",
    course: "State",
    semester: "LKG",
  },
  {
    id: "tc-7",
    studentName: "Zoya Ahmed",
    fatherName: "Farooq Ahmed",
    fatherNo: "9988776655",
    course: "State",
    semester: "II",
  },
  {
    id: "tc-8",
    studentName: "Arhaan Hussain",
    fatherName: "N/A",
    fatherNo: "9876501234",
    course: "State",
    semester: "V",
  },
  {
    id: "tc-9",
    studentName: "Maryam Banu",
    fatherName: "Sultan Banu",
    fatherNo: "9765432100",
    course: "State",
    semester: "IV",
  },
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

export function StudentTcPage() {
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return MOCK_TC_ROWS;
    return MOCK_TC_ROWS.filter((row) =>
      [row.studentName, row.fatherName, row.fatherNo, row.course, row.semester]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = rows
        .map(
          (row) =>
            `${row.studentName}\t${row.fatherName}\t${row.fatherNo}\t${row.course}\t${row.semester}`,
        )
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("TC list copied to clipboard"),
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

  const handlePrintRow = (row: TcRow) => {
    toast.success(`Print TC queued for ${row.studentName}`);
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-[#6b7280]">
          Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Applicable for TC List
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
        </div>
        <label className="flex items-center gap-2 text-sm text-[#374151]">
          <span>Search:</span>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-8 w-52 bg-white"
            aria-label="Search transfer certificate list"
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
                <TableHead className="whitespace-nowrap text-xs font-bold text-[#374151]">
                  Print
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-28 text-center text-sm text-muted-foreground">
                    No students found for TC list.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => (
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
                    <TableCell>
                      <Button
                        size="sm"
                        className="h-7 rounded-sm bg-[#03a9f4] px-3 text-xs font-semibold text-white hover:bg-[#0288d1]"
                        onClick={() => handlePrintRow(row)}
                      >
                        Print
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {rows.length} record{rows.length === 1 ? "" : "s"}.
      </p>
    </div>
  );
}
