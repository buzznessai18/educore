import { useMemo, useState } from "react";
import { Copy, FileSpreadsheet, FileText, Plus, Printer } from "lucide-react";
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
import { EXPORT_ACTIONS, type ExportAction } from "@/modules/admin-portal/constants";
import { cn } from "@/lib/utils";

type FeeDescriptionRow = {
  id: string;
  name: string;
  course: string;
  feeType: string;
};

const FEE_DESCRIPTION_PILLS: ActionPill[] = [
  { label: "Fee Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Day Book Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Fee Pending Report", tone: "green", href: "/fms/fee-pending-report" },
  { label: "Fee Print List", tone: "green", href: "/fms/fee-print-list" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Reports", tone: "blue", href: "/fms/fee-pending-report", dropdown: true },
  { label: "Transaction", tone: "blue", href: "/fms/fee-receipt", dropdown: true },
];

const COURSE_OPTIONS = ["State", "CBSE", "ICSE"];
const FEE_TYPE_OPTIONS = ["ACADEMIC", "MISCELLANEOUS", "TRANSPORT", "TRUST", "ADDITIONAL"];

const INITIAL_ROWS: FeeDescriptionRow[] = [
  { id: "fd-1", name: "ACADEMIC FEE", course: "State", feeType: "ACADEMIC" },
  { id: "fd-2", name: "BOOKS FEES", course: "State", feeType: "MISCELLANEOUS" },
  { id: "fd-3", name: "June Fee", course: "State", feeType: "TRANSPORT" },
  { id: "fd-4", name: "July Fee", course: "State", feeType: "TRANSPORT" },
  { id: "fd-5", name: "August Fee", course: "State", feeType: "TRANSPORT" },
  { id: "fd-6", name: "September Fee", course: "State", feeType: "TRANSPORT" },
  { id: "fd-7", name: "October Fee", course: "State", feeType: "TRANSPORT" },
  { id: "fd-8", name: "November Fee", course: "State", feeType: "TRANSPORT" },
  { id: "fd-9", name: "December Fee", course: "State", feeType: "TRANSPORT" },
  { id: "fd-10", name: "January Fee", course: "State", feeType: "TRANSPORT" },
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

export function FeeDescriptionListPage() {
  const [rows, setRows] = useState<FeeDescriptionRow[]>(INITIAL_ROWS);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("State");
  const [feeType, setFeeType] = useState("ACADEMIC");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [row.name, row.course, row.feeType].join(" ").toLowerCase().includes(query),
    );
  }, [rows, search]);

  const openAdd = () => {
    setEditingId(null);
    setName("");
    setCourse("State");
    setFeeType("ACADEMIC");
    setDialogOpen(true);
  };

  const openEdit = (row: FeeDescriptionRow) => {
    setEditingId(row.id);
    setName(row.name);
    setCourse(row.course);
    setFeeType(row.feeType);
    setDialogOpen(true);
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Fee Description Name is required");
      return;
    }

    if (editingId) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingId ? { ...row, name: trimmedName, course, feeType } : row,
        ),
      );
      toast.success("Fee description updated");
    } else {
      setRows((current) => [
        ...current,
        { id: `fd-${Date.now()}`, name: trimmedName, course, feeType },
      ]);
      toast.success("Fee description saved");
    }

    setDialogOpen(false);
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered
        .map((row, index) => `${index + 1}\t${row.name}\t${row.course}\t${row.feeType}`)
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Fee description list copied"),
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
          <h2 className="text-xl font-semibold text-[#03a9f4]">Fee Description List</h2>
          <p className="text-sm text-[#6b7280]">
            Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Fee Description List
          </p>
        </div>
        <ActionPills items={FEE_DESCRIPTION_PILLS} />
      </div>

      <div className="rounded-sm border border-[#d7e3ec] bg-white p-5 shadow-sm">
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
              className="h-8 w-44 bg-white"
              aria-label="Search fee descriptions"
            />
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-sm border border-[#dbe3ea]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                  <TableHead className="text-xs font-bold">Sl.No</TableHead>
                  <TableHead className="text-xs font-bold">Fee Description Name</TableHead>
                  <TableHead className="text-xs font-bold">Course</TableHead>
                  <TableHead className="text-xs font-bold">Fee Type</TableHead>
                  <TableHead className="text-center text-xs font-bold">Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-sm text-[#6b7280]">
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
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>{row.course}</TableCell>
                      <TableCell>{row.feeType}</TableCell>
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
        aria-label="Add fee description"
        onClick={openAdd}
      >
        <Plus className="size-6" />
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Fee Description" : "Add Fee Description"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <label className="block space-y-1.5 text-sm">
              <span>
                Fee Description Name<span className="text-[#e53935]">*</span>
              </span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-label="Fee Description Name"
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>Course</span>
              <Select value={course} onValueChange={setCourse}>
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
              <span>Fee Type</span>
              <Select value={feeType} onValueChange={setFeeType}>
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
