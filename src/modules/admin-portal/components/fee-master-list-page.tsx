import { useMemo, useState } from "react";
import { Copy, FileSpreadsheet, FileText, Plus, Printer, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  ACADEMIC_YEAR_OPTIONS,
  CLASS_OPTIONS,
  EXPORT_ACTIONS,
  QUOTA_OPTIONS,
  type ExportAction,
} from "@/modules/admin-portal/constants";
import { cn } from "@/lib/utils";

type FeeMasterRow = {
  id: string;
  year: string;
  academicYear: string;
  admissionType: string;
  feeType: string;
  quota: string;
  course: string;
  branch: string;
  level: string;
  classId: string;
  classLabel: string;
  feeAmount: string;
};

const FEE_MASTER_PILLS: ActionPill[] = [
  { label: "Fee Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Day Book Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Fee Pending Report", tone: "green", href: "/fms/fee-pending-report" },
  { label: "Fee Print List", tone: "green", href: "/fms/fee-print-list" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Reports", tone: "blue", href: "/fms/fee-pending-report", dropdown: true },
  { label: "Transaction", tone: "blue", href: "/fms/fee-receipt", dropdown: true },
];

const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"];
const ADMISSION_TYPE_OPTIONS = ["New Registration", "Re-Registration"];
const COURSE_OPTIONS = ["State", "CBSE", "ICSE"];
const BRANCH_OPTIONS = ["State", "Main", "City"];
const LEVEL_OPTIONS = ["Pre-Primary", "Primary", "Middle", "High"];
const FEE_TYPE_OPTIONS = ["ACADEMIC", "MISCELLANEOUS", "TRANSPORT", "TRUST"];

const INITIAL_ROWS: FeeMasterRow[] = [
  {
    id: "fm-1",
    year: "2026",
    academicYear: "2026-27",
    admissionType: "New Registration",
    feeType: "ACADEMIC",
    quota: "General",
    course: "State",
    branch: "State",
    level: "Pre-Primary",
    classId: "nursery",
    classLabel: "NURSERY",
    feeAmount: "12000",
  },
  {
    id: "fm-2",
    year: "2026",
    academicYear: "2026-27",
    admissionType: "New Registration",
    feeType: "ACADEMIC",
    quota: "General",
    course: "State",
    branch: "State",
    level: "Pre-Primary",
    classId: "lkg",
    classLabel: "LKG",
    feeAmount: "11000",
  },
  {
    id: "fm-3",
    year: "2026",
    academicYear: "2026-27",
    admissionType: "Re-Registration",
    feeType: "ACADEMIC",
    quota: "General",
    course: "State",
    branch: "State",
    level: "Pre-Primary",
    classId: "ukg",
    classLabel: "UKG",
    feeAmount: "11000",
  },
  {
    id: "fm-4",
    year: "2026",
    academicYear: "2026-27",
    admissionType: "New Registration",
    feeType: "ACADEMIC",
    quota: "General",
    course: "State",
    branch: "State",
    level: "Primary",
    classId: "class-8",
    classLabel: "Class 8",
    feeAmount: "18500",
  },
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
};

function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "--Select--",
}: FilterSelectProps) {
  return (
    <label className="block space-y-1.5 text-sm text-[#111827]">
      <span>{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 bg-white" aria-label={label}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">{placeholder}</SelectItem>
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

export function FeeMasterListPage() {
  const [rows, setRows] = useState<FeeMasterRow[]>(INITIAL_ROWS);
  const [year, setYear] = useState("2026");
  const [academicYear, setAcademicYear] = useState("2026-27");
  const [admissionType, setAdmissionType] = useState("none");
  const [course, setCourse] = useState("none");
  const [branch, setBranch] = useState("none");
  const [level, setLevel] = useState("none");
  const [classId, setClassId] = useState("none");
  const [applied, setApplied] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    admissionType: "New Registration",
    feeType: "ACADEMIC",
    quota: "general",
    course: "State",
    branch: "State",
    level: "Pre-Primary",
    classId: "nursery",
    feeAmount: "",
  });

  const filtered = useMemo(() => {
    if (!applied) return [];
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (year !== "none" && row.year !== year) return false;
      if (academicYear !== "none" && row.academicYear !== academicYear) return false;
      if (admissionType !== "none" && row.admissionType !== admissionType) return false;
      if (course !== "none" && row.course !== course) return false;
      if (branch !== "none" && row.branch !== branch) return false;
      if (level !== "none" && row.level !== level) return false;
      if (classId !== "none" && row.classId !== classId) return false;
      if (!query) return true;
      return [
        row.admissionType,
        row.feeType,
        row.quota,
        row.course,
        row.branch,
        row.classLabel,
        row.feeAmount,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [academicYear, admissionType, applied, branch, classId, course, level, rows, search, year]);

  const openAdd = () => {
    setEditingId(null);
    setForm({
      admissionType: "New Registration",
      feeType: "ACADEMIC",
      quota: "general",
      course: "State",
      branch: "State",
      level: "Pre-Primary",
      classId: "nursery",
      feeAmount: "",
    });
    setDialogOpen(true);
  };

  const openEdit = (row: FeeMasterRow) => {
    setEditingId(row.id);
    setForm({
      admissionType: row.admissionType,
      feeType: row.feeType,
      quota: QUOTA_OPTIONS.find((item) => item.label === row.quota)?.value ?? "general",
      course: row.course,
      branch: row.branch,
      level: row.level,
      classId: row.classId,
      feeAmount: row.feeAmount,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.feeAmount.trim()) {
      toast.error("Fee Amount is required");
      return;
    }
    const classLabel =
      CLASS_OPTIONS.find((item) => item.value === form.classId)?.label ?? form.classId;
    const quotaLabel =
      QUOTA_OPTIONS.find((item) => item.value === form.quota)?.label ?? form.quota;

    if (editingId) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingId
            ? {
                ...row,
                admissionType: form.admissionType,
                feeType: form.feeType,
                quota: quotaLabel,
                course: form.course,
                branch: form.branch,
                level: form.level,
                classId: form.classId,
                classLabel,
                feeAmount: form.feeAmount.trim(),
              }
            : row,
        ),
      );
      toast.success("Fee master updated");
    } else {
      setRows((current) => [
        ...current,
        {
          id: `fm-${Date.now()}`,
          year: year === "none" ? "2026" : year,
          academicYear: academicYear === "none" ? "2026-27" : academicYear,
          admissionType: form.admissionType,
          feeType: form.feeType,
          quota: quotaLabel,
          course: form.course,
          branch: form.branch,
          level: form.level,
          classId: form.classId,
          classLabel,
          feeAmount: form.feeAmount.trim(),
        },
      ]);
      toast.success("Fee master saved");
    }
    setDialogOpen(false);
    setApplied(true);
  };

  const handleDelete = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    toast.success("Fee master deleted");
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered
        .map(
          (row, index) =>
            `${index + 1}\t${row.admissionType}\t${row.feeType}\t${row.quota}\t${row.course}\t${row.branch}\t${row.classLabel}\t${row.feeAmount}`,
        )
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Fee list copied"),
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
    <div className="relative mx-auto max-w-[1200px] space-y-4 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#03a9f4]">Fee List</h2>
          <p className="text-sm text-[#6b7280]">
            Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Fee List
          </p>
        </div>
        <ActionPills items={FEE_MASTER_PILLS} />
      </div>

      <div className="rounded-sm border border-[#d7e3ec] bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <FilterSelect
            label="Year"
            value={year}
            onChange={setYear}
            options={YEAR_OPTIONS.map((item) => ({ value: item, label: item }))}
          />
          <FilterSelect
            label="Academic Year"
            value={academicYear}
            onChange={setAcademicYear}
            options={ACADEMIC_YEAR_OPTIONS}
          />
          <FilterSelect
            label="AdmissionType"
            value={admissionType}
            onChange={setAdmissionType}
            options={ADMISSION_TYPE_OPTIONS.map((item) => ({ value: item, label: item }))}
          />
          <FilterSelect
            label="Course"
            value={course}
            onChange={setCourse}
            options={COURSE_OPTIONS.map((item) => ({ value: item, label: item }))}
          />
          <FilterSelect
            label="Branch"
            value={branch}
            onChange={setBranch}
            options={BRANCH_OPTIONS.map((item) => ({ value: item, label: item }))}
            placeholder="Nothing selected"
          />
          <FilterSelect
            label="Level"
            value={level}
            onChange={setLevel}
            options={LEVEL_OPTIONS.map((item) => ({ value: item, label: item }))}
            placeholder="Nothing selected"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="w-full max-w-[220px]">
            <FilterSelect
              label="Class"
              value={classId}
              onChange={setClassId}
              options={CLASS_OPTIONS}
              placeholder="Nothing selected"
            />
          </div>
          <Button
            type="button"
            className="h-9 rounded-sm bg-[#03a9f4] px-5 text-sm font-semibold text-white hover:bg-[#0288d1]"
            onClick={() => {
              setApplied(true);
              toast.success("Fee list filtered");
            }}
          >
            Search
          </Button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
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
              className="h-8 w-44 bg-white"
              aria-label="Search fee list"
            />
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-sm border border-[#dbe3ea]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                  <TableHead className="text-xs font-bold">Sl.No</TableHead>
                  <TableHead className="text-xs font-bold">Admission Type</TableHead>
                  <TableHead className="text-xs font-bold">Fee Type</TableHead>
                  <TableHead className="text-xs font-bold">Quota</TableHead>
                  <TableHead className="text-xs font-bold">Course</TableHead>
                  <TableHead className="text-xs font-bold">Branch</TableHead>
                  <TableHead className="text-xs font-bold">Class</TableHead>
                  <TableHead className="text-xs font-bold">Fee Amount</TableHead>
                  <TableHead className="text-center text-xs font-bold">Edit</TableHead>
                  <TableHead className="text-center text-xs font-bold">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-sm text-[#6b7280]">
                      No data available in table
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={cn(index % 2 === 1 ? "bg-[#f3f9fc]" : "bg-white")}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.admissionType}</TableCell>
                      <TableCell>{row.feeType}</TableCell>
                      <TableCell>{row.quota}</TableCell>
                      <TableCell>{row.course}</TableCell>
                      <TableCell>{row.branch}</TableCell>
                      <TableCell className="font-medium">{row.classLabel}</TableCell>
                      <TableCell>{row.feeAmount}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          size="sm"
                          className="h-8 rounded-sm bg-[#03a9f4] px-3 text-xs font-semibold text-white hover:bg-[#0288d1]"
                          onClick={() => openEdit(row)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          size="icon"
                          className="size-8 rounded-full bg-[#e53935] text-white hover:bg-[#c62828]"
                          aria-label={`Delete fee ${row.classLabel}`}
                          onClick={() => handleDelete(row.id)}
                        >
                          <X className="size-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Button
        type="button"
        size="icon"
        className="fixed bottom-8 right-8 z-20 size-12 rounded-full bg-[#5cb85c] text-white shadow-lg hover:bg-[#4cae4c]"
        aria-label="Add fee master"
        onClick={openAdd}
      >
        <Plus className="size-6" />
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Fee" : "Add Fee"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm">
              <span>Admission Type</span>
              <Select
                value={form.admissionType}
                onValueChange={(value) => setForm((current) => ({ ...current, admissionType: value }))}
              >
                <SelectTrigger aria-label="Admission Type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ADMISSION_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>Fee Type</span>
              <Select
                value={form.feeType}
                onValueChange={(value) => setForm((current) => ({ ...current, feeType: value }))}
              >
                <SelectTrigger aria-label="Fee Type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FEE_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>Quota</span>
              <Select
                value={form.quota}
                onValueChange={(value) => setForm((current) => ({ ...current, quota: value }))}
              >
                <SelectTrigger aria-label="Quota">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUOTA_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>Course</span>
              <Select
                value={form.course}
                onValueChange={(value) => setForm((current) => ({ ...current, course: value }))}
              >
                <SelectTrigger aria-label="Course">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>Branch</span>
              <Select
                value={form.branch}
                onValueChange={(value) => setForm((current) => ({ ...current, branch: value }))}
              >
                <SelectTrigger aria-label="Branch">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRANCH_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>Level</span>
              <Select
                value={form.level}
                onValueChange={(value) => setForm((current) => ({ ...current, level: value }))}
              >
                <SelectTrigger aria-label="Level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVEL_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>Class</span>
              <Select
                value={form.classId}
                onValueChange={(value) => setForm((current) => ({ ...current, classId: value }))}
              >
                <SelectTrigger aria-label="Class">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>
                Fee Amount<span className="text-[#e53935]">*</span>
              </span>
              <Input
                value={form.feeAmount}
                onChange={(event) =>
                  setForm((current) => ({ ...current, feeAmount: event.target.value }))
                }
                aria-label="Fee Amount"
              />
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#03a9f4] text-white hover:bg-[#0288d1]"
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
