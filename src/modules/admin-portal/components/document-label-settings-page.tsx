import { useMemo, useRef, useState } from "react";
import { Copy, FileSpreadsheet, FileText, Pencil, Plus, Printer, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
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
import {
  ActionPills,
  SETTINGS_MASTER_PILLS,
} from "@/modules/admin-portal/components/admission-action-pills";
import { EXPORT_ACTIONS, type ExportAction } from "@/modules/admin-portal/constants";
import { cn } from "@/lib/utils";

type DocumentLabelRow = {
  id: string;
  formName: string;
  labelName: string;
  labelDescription: string;
};

const FORM_OPTIONS = [
  "Student Admission",
  "Application Form",
  "Enquiry Form",
  "Transfer Certificate",
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

const PAGE_SIZE = 10;

export function DocumentLabelSettingsPage() {
  const [rows, setRows] = useState<DocumentLabelRow[]>([]);
  const [formName, setFormName] = useState("none");
  const [labelName, setLabelName] = useState("");
  const [labelDescription, setLabelDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState({ formName: false, labelName: false });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const labelRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [row.formName, row.labelName, row.labelDescription]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const resetForm = () => {
    setFormName("none");
    setLabelName("");
    setLabelDescription("");
    setEditingId(null);
    setErrors({ formName: false, labelName: false });
  };

  const handleSave = () => {
    const nextErrors = {
      formName: formName === "none",
      labelName: !labelName.trim(),
    };
    setErrors(nextErrors);
    if (nextErrors.formName || nextErrors.labelName) {
      toast.error("Please fill all required fields");
      labelRef.current?.focus();
      return;
    }

    const trimmedName = labelName.trim();
    const trimmedDescription = labelDescription.trim();
    const duplicate = rows.some(
      (row) =>
        row.formName === formName &&
        row.labelName.toLowerCase() === trimmedName.toLowerCase() &&
        row.id !== editingId,
    );
    if (duplicate) {
      toast.error("Label already exists for this form");
      return;
    }

    if (editingId) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingId
            ? {
                ...row,
                formName,
                labelName: trimmedName,
                labelDescription: trimmedDescription,
              }
            : row,
        ),
      );
      toast.success("Label updated");
    } else {
      setRows((current) => [
        {
          id: `lbl-${Date.now()}`,
          formName,
          labelName: trimmedName,
          labelDescription: trimmedDescription,
        },
        ...current,
      ]);
      toast.success("Label saved");
    }

    resetForm();
    setPage(1);
  };

  const handleEdit = (row: DocumentLabelRow) => {
    setEditingId(row.id);
    setFormName(row.formName);
    setLabelName(row.labelName);
    setLabelDescription(row.labelDescription);
    setErrors({ formName: false, labelName: false });
    labelRef.current?.focus();
  };

  const handleDelete = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    if (editingId === id) resetForm();
    toast.success("Label deleted");
  };

  const handleAddNew = () => {
    resetForm();
    labelRef.current?.focus();
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered
        .map((row) => `${row.formName}\t${row.labelName}\t${row.labelDescription}`)
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Label list copied"),
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
    <div className="relative mx-auto max-w-[1400px] space-y-4 pb-20">
      <ActionPills items={SETTINGS_MASTER_PILLS} className="justify-start" />

      <div className="grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
          <h2 className="text-lg font-semibold text-foreground">
            {editingId ? "Edit Label" : "Add Label"}
          </h2>

          <div className="mt-5 space-y-4">
            <label className="block space-y-1.5 text-sm text-foreground">
              <span>
                Form Name<span className="text-danger">*</span>
              </span>
              <Select
                value={formName}
                onValueChange={(value) => {
                  setFormName(value);
                  setErrors((current) => ({ ...current, formName: false }));
                }}
              >
                <SelectTrigger
                  className="h-9 bg-card"
                  aria-label="Form Name"
                  aria-invalid={errors.formName}
                >
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">--Select--</SelectItem>
                  {FORM_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.formName ? (
                <span className="text-sm text-danger">Form Name is required</span>
              ) : null}
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>
                Label Name<span className="text-danger">*</span>
              </span>
              <Input
                ref={labelRef}
                value={labelName}
                onChange={(event) => {
                  setLabelName(event.target.value);
                  if (event.target.value.trim()) {
                    setErrors((current) => ({ ...current, labelName: false }));
                  }
                }}
                className="h-9 bg-card"
                aria-label="Label Name"
                aria-invalid={errors.labelName}
              />
              {errors.labelName ? (
                <span className="text-sm text-danger">Label Name is required</span>
              ) : null}
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>Label Description</span>
              <Input
                value={labelDescription}
                onChange={(event) => setLabelDescription(event.target.value)}
                className="h-9 bg-card"
                aria-label="Label Description"
              />
            </label>

            <div className="flex justify-center pt-2">
              <Button
                type="button"
                className="h-9 rounded-md bg-info px-8 text-sm font-semibold text-white hover:bg-info/90"
                onClick={handleSave}
              >
                Save
              </Button>
              {editingId ? (
                <Button
                  type="button"
                  variant="outline"
                  className="ml-2 h-9 rounded-md"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
          <h2 className="text-lg font-semibold text-foreground">Label List</h2>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
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
                className="h-8 w-44 bg-card"
                aria-label="Search labels"
              />
            </label>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-xs font-bold">Form Name</TableHead>
                    <TableHead className="text-xs font-bold">Label Name</TableHead>
                    <TableHead className="text-xs font-bold">Label Description</TableHead>
                    <TableHead className="w-24 text-center text-xs font-bold">Edit</TableHead>
                    <TableHead className="w-24 text-center text-xs font-bold">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-sm text-muted-foreground">
                        No data available in table
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageRows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        className={cn(index % 2 === 1 ? "bg-info-soft/50" : "bg-card")}
                      >
                        <TableCell className="font-medium">{row.formName}</TableCell>
                        <TableCell>{row.labelName}</TableCell>
                        <TableCell>{row.labelDescription || "—"}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            type="button"
                            size="icon"
                            className="size-8 rounded-full bg-info text-white hover:bg-info/90"
                            aria-label={`Edit ${row.labelName}`}
                            onClick={() => handleEdit(row)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            type="button"
                            size="icon"
                            className="size-8 rounded-full bg-danger text-white hover:bg-danger/90"
                            aria-label={`Delete ${row.labelName}`}
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

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>
              Showing {from} to {to} of {filtered.length} entries
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
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive onClick={(event) => event.preventDefault()}>
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setPage((current) => Math.min(totalPages, current + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>
      </div>

      <Button
        type="button"
        className="fixed bottom-6 right-6 z-20 h-12 gap-2 rounded-full bg-success px-5 text-sm font-semibold text-white shadow-lg hover:bg-success/90"
        onClick={handleAddNew}
        aria-label="Add New Label"
      >
        <Plus className="size-5" />
        Add New
      </Button>
    </div>
  );
}
