import { useMemo, useState } from "react";
import { Copy, FileSpreadsheet, FileText, Pencil, Plus, Printer } from "lucide-react";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
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
import {
  ActionPills,
  type ActionPill,
} from "@/modules/admin-portal/components/admission-action-pills";
import { EXPORT_ACTIONS, type ExportAction } from "@/modules/admin-portal/constants";
import { cn } from "@/lib/utils";

type CollegeProfileRow = {
  id: string;
  collegeCode: string;
  collegeName: string;
  website: string;
  dateOfEstablishment: string;
  city: string;
};

const PROFILE_ACTION_PILLS: ActionPill[] = [
  { label: "Class", tone: "green", href: "/settings/class" },
  { label: "Country", tone: "green", href: "/settings/nationality" },
  { label: "Admission List", tone: "green", href: "/admissions/registration" },
  { label: "Add Student", tone: "green", href: "/admissions/registration/new" },
  { label: "Admission", tone: "green", href: "/admissions/applied" },
  { label: "Masters", tone: "blue", href: "/settings/academic", dropdown: true },
  { label: "Reports", tone: "blue", href: "/admissions/report", dropdown: true },
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

const PAGE_SIZE = 10;

const EMPTY_FORM = {
  collegeCode: "",
  collegeName: "",
  website: "",
  dateOfEstablishment: "",
  city: "",
};

export function SchoolProfileListPage() {
  const [rows, setRows] = useState<CollegeProfileRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [
        row.collegeCode,
        row.collegeName,
        row.website,
        row.dateOfEstablishment,
        row.city,
      ]
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

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (row: CollegeProfileRow) => {
    setEditingId(row.id);
    setForm({
      collegeCode: row.collegeCode,
      collegeName: row.collegeName,
      website: row.website,
      dateOfEstablishment: row.dateOfEstablishment,
      city: row.city,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.collegeCode.trim() || !form.collegeName.trim()) {
      toast.error("College Code and College Name are required");
      return;
    }

    if (editingId) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingId
            ? {
                ...row,
                collegeCode: form.collegeCode.trim(),
                collegeName: form.collegeName.trim(),
                website: form.website.trim(),
                dateOfEstablishment: form.dateOfEstablishment,
                city: form.city.trim(),
              }
            : row,
        ),
      );
      toast.success("College profile updated");
    } else {
      setRows((current) => [
        {
          id: `cp-${Date.now()}`,
          collegeCode: form.collegeCode.trim(),
          collegeName: form.collegeName.trim(),
          website: form.website.trim(),
          dateOfEstablishment: form.dateOfEstablishment,
          city: form.city.trim(),
        },
        ...current,
      ]);
      toast.success("College profile saved");
      setPage(1);
    }

    setDialogOpen(false);
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered
        .map(
          (row) =>
            `${row.collegeCode}\t${row.collegeName}\t${row.website}\t${row.dateOfEstablishment}\t${row.city}`,
        )
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("College profile list copied"),
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Home <span className="mx-1 text-muted-foreground/70">&gt;</span> College Profile List
        </p>
        <ActionPills items={PROFILE_ACTION_PILLS} />
      </div>

      <section className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
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
              aria-label="Search college profiles"
            />
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs font-bold">College Code</TableHead>
                  <TableHead className="text-xs font-bold">College Name</TableHead>
                  <TableHead className="text-xs font-bold">Website</TableHead>
                  <TableHead className="text-xs font-bold">Date Of Establishment</TableHead>
                  <TableHead className="text-xs font-bold">City</TableHead>
                  <TableHead className="w-28 text-center text-xs font-bold">Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                      No data available in table
                    </TableCell>
                  </TableRow>
                ) : (
                  pageRows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={cn(index % 2 === 1 ? "bg-info-soft/50" : "bg-card")}
                    >
                      <TableCell className="font-medium">{row.collegeCode}</TableCell>
                      <TableCell>{row.collegeName}</TableCell>
                      <TableCell>{row.website || "—"}</TableCell>
                      <TableCell>{row.dateOfEstablishment || "—"}</TableCell>
                      <TableCell>{row.city || "—"}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          size="icon"
                          className="size-8 rounded-full bg-info text-white hover:bg-info/90"
                          aria-label={`Edit ${row.collegeName}`}
                          onClick={() => openEdit(row)}
                        >
                          <Pencil className="size-3.5" />
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

      <Button
        type="button"
        size="icon"
        className="fixed bottom-6 right-6 z-20 size-14 rounded-full bg-success text-white shadow-lg hover:bg-success/90"
        onClick={openAdd}
        aria-label="Add college profile"
      >
        <Plus className="size-7" />
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit College Profile" : "Add College Profile"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <label className="space-y-1.5 text-sm">
              <span>College Code</span>
              <Input
                value={form.collegeCode}
                onChange={(event) => setForm((current) => ({ ...current, collegeCode: event.target.value }))}
                aria-label="College Code"
              />
            </label>
            <label className="space-y-1.5 text-sm">
              <span>College Name</span>
              <Input
                value={form.collegeName}
                onChange={(event) => setForm((current) => ({ ...current, collegeName: event.target.value }))}
                aria-label="College Name"
              />
            </label>
            <label className="space-y-1.5 text-sm">
              <span>Website</span>
              <Input
                value={form.website}
                onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
                aria-label="Website"
              />
            </label>
            <label className="space-y-1.5 text-sm">
              <span>Date Of Establishment</span>
              <Input
                type="date"
                value={form.dateOfEstablishment}
                onChange={(event) =>
                  setForm((current) => ({ ...current, dateOfEstablishment: event.target.value }))
                }
                aria-label="Date Of Establishment"
              />
            </label>
            <label className="space-y-1.5 text-sm">
              <span>City</span>
              <Input
                value={form.city}
                onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                aria-label="City"
              />
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-info text-white hover:bg-info/90"
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
