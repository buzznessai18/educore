import { useMemo, useState } from "react";
import { Search } from "lucide-react";
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
import { AdmissionActionPills } from "@/modules/admin-portal/components/admission-action-pills";
import { useAdmissionList } from "@/modules/admin-portal/hooks";
import { cn } from "@/lib/utils";

type ReportTab = "total" | "regular" | "tc";

const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"];

const REPORT_TABS: { id: ReportTab; label: string }[] = [
  { id: "total", label: "Total Admissions" },
  { id: "regular", label: "Regular List" },
  { id: "tc", label: "TC List" },
];

function formatInputDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function AdmissionReportPage() {
  const [year, setYear] = useState("2026");
  const [fromDate, setFromDate] = useState(formatInputDate(new Date(2026, 8, 24)));
  const [toDate, setToDate] = useState(formatInputDate(new Date(2026, 8, 24)));
  const [activeTab, setActiveTab] = useState<ReportTab>("total");
  const [hasSearched, setHasSearched] = useState(false);

  const { data = [], isFetching } = useAdmissionList({
    listStatus: "admitted",
    academicYear: year,
  });

  const rows = useMemo(() => {
    if (!hasSearched) return [];
    if (activeTab === "tc") {
      return data.filter((row) => row.quota.toLowerCase().includes("tc") || row.studentName.includes("TC"));
    }
    if (activeTab === "regular") {
      return data.filter((row) => row.quota === "GENERAL" || row.quota === "general");
    }
    return data;
  }, [activeTab, data, hasSearched]);

  const handleFind = () => {
    setHasSearched(true);
    toast.success(`Report loaded for ${year} (${fromDate} – ${toDate})`);
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-4 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-[#6b7280]">
          Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Student Admission Report
        </p>
        <AdmissionActionPills />
      </div>

      <div className="overflow-hidden rounded-sm border border-[#d7e3ec] bg-white shadow-sm">
        <div className="bg-[#03a9f4] px-4 py-2.5">
          <h2 className="text-sm font-semibold text-white">Student Admission Report</h2>
        </div>

        <div className="space-y-5 p-5">
          <div className="grid gap-4 md:grid-cols-[160px_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
            <label className="block space-y-1.5 text-sm text-[#374151]">
              <span>
                Year<span className="text-[#e53935]">*</span>
              </span>
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

            <label className="block space-y-1.5 text-sm text-[#374151]">
              <span>From Date</span>
              <Input
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="h-9 bg-white"
                aria-label="From date"
              />
            </label>

            <label className="block space-y-1.5 text-sm text-[#374151]">
              <span>To Date</span>
              <Input
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="h-9 bg-white"
                aria-label="To date"
              />
            </label>

            <Button
              type="button"
              className="h-9 rounded-sm bg-[#03a9f4] px-4 text-sm font-semibold text-white hover:bg-[#0288d1]"
              onClick={handleFind}
            >
              <Search className="size-4" />
              Find
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {REPORT_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "rounded-sm border px-4 py-2 text-sm font-semibold transition",
                    isActive
                      ? "border-[#0288d1] bg-[#03a9f4] text-white"
                      : "border-[#03a9f4] bg-white text-[#0288d1] hover:bg-[#e1f5fe]",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-sm border border-[#dbe3ea]">
            {!hasSearched ? (
              <div className="grid min-h-40 place-items-center px-4 py-10 text-sm text-muted-foreground">
                Select year and date range, then click Find to load the report.
              </div>
            ) : rows.length === 0 ? (
              <div className="grid min-h-40 place-items-center px-4 py-10 text-sm text-muted-foreground">
                No {REPORT_TABS.find((tab) => tab.id === activeTab)?.label.toLowerCase()} found
                {isFetching ? " · Loading…" : ""}.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                      <TableHead className="text-xs font-bold">SlNo.</TableHead>
                      <TableHead className="text-xs font-bold">Student Name</TableHead>
                      <TableHead className="text-xs font-bold">Class</TableHead>
                      <TableHead className="text-xs font-bold">Section</TableHead>
                      <TableHead className="text-xs font-bold">Admission No</TableHead>
                      <TableHead className="text-xs font-bold">Quota</TableHead>
                      <TableHead className="text-xs font-bold">Admission Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        className={cn(index % 2 === 1 ? "bg-[#f3f9fc]" : "bg-white")}
                      >
                        <TableCell>{row.slNo}</TableCell>
                        <TableCell className="font-medium text-[#0288d1]">{row.studentName}</TableCell>
                        <TableCell>{row.semesterClass}</TableCell>
                        <TableCell>{row.section}</TableCell>
                        <TableCell>{row.admissionNo}</TableCell>
                        <TableCell>{row.quota}</TableCell>
                        <TableCell>{row.admissionDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
