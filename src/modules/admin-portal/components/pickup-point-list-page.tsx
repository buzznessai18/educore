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

type PickupPointRow = {
  id: string;
  route: string;
  pickupPoint: string;
  amount: string;
};

const PICKUP_POINT_PILLS: ActionPill[] = [
  { label: "Fee Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Day Book Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Fee Pending Report", tone: "green", href: "/fms/fee-pending-report" },
  { label: "Fee Print List", tone: "green", href: "/fms/fee-print-list" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Reports", tone: "blue", href: "/fms/fee-pending-report", dropdown: true },
  { label: "Transaction", tone: "blue", href: "/fms/fee-receipt", dropdown: true },
];

const ROUTE_OPTIONS = ["Route-1", "Route-2", "Route-3"];

const INITIAL_ROWS: PickupPointRow[] = [
  { id: "pp-1", route: "Route-1", pickupPoint: "Sadhankeri (PRIMARY)", amount: "1400" },
  { id: "pp-2", route: "Route-1", pickupPoint: "Rajiv Gandhi Nagar(PRIMARY)", amount: "1500" },
  { id: "pp-3", route: "Route-1", pickupPoint: "Malapur Last Stop (PRIMARY)", amount: "1200" },
  { id: "pp-4", route: "Route-1", pickupPoint: "Rajiv Gandhi Nagar(HIGH)", amount: "1500" },
  { id: "pp-5", route: "Route-1", pickupPoint: "Sadhankeri (HIGH)", amount: "1400" },
  { id: "pp-6", route: "Route-2", pickupPoint: "City Center (PRIMARY)", amount: "1300" },
  { id: "pp-7", route: "Route-2", pickupPoint: "North Campus Gate (HIGH)", amount: "1100" },
  { id: "pp-8", route: "Route-3", pickupPoint: "Railway Station (PRIMARY)", amount: "1600" },
];

const exportIcons: Record<ExportAction, typeof Copy> = {
  Copy,
  CSV: FileText,
  Excel: FileSpreadsheet,
  PDF: FileText,
  Print: Printer,
};

export function PickupPointListPage() {
  const [rows, setRows] = useState<PickupPointRow[]>(INITIAL_ROWS);
  const [routeFilter, setRouteFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [route, setRoute] = useState("Route-1");
  const [pickupPoint, setPickupPoint] = useState("");
  const [amount, setAmount] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (routeFilter !== "all" && row.route !== routeFilter) return false;
      if (!query) return true;
      return [row.route, row.pickupPoint, row.amount].join(" ").toLowerCase().includes(query);
    });
  }, [rows, routeFilter, search]);

  const openAdd = () => {
    setEditingId(null);
    setRoute("Route-1");
    setPickupPoint("");
    setAmount("");
    setDialogOpen(true);
  };

  const openEdit = (row: PickupPointRow) => {
    setEditingId(row.id);
    setRoute(row.route);
    setPickupPoint(row.pickupPoint);
    setAmount(row.amount);
    setDialogOpen(true);
  };

  const handleSave = () => {
    const trimmedPoint = pickupPoint.trim();
    const trimmedAmount = amount.trim();
    if (!trimmedPoint || !trimmedAmount) {
      toast.error("PickUp Point and Amount are required");
      return;
    }

    if (editingId) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingId
            ? { ...row, route, pickupPoint: trimmedPoint, amount: trimmedAmount }
            : row,
        ),
      );
      toast.success("Pickup point updated");
    } else {
      setRows((current) => [
        ...current,
        {
          id: `pp-${Date.now()}`,
          route,
          pickupPoint: trimmedPoint,
          amount: trimmedAmount,
        },
      ]);
      toast.success("Pickup point saved");
    }

    setDialogOpen(false);
  };

  const handleExport = (action: ExportAction) => {
    if (action === "Copy") {
      const text = filtered
        .map((row) => `${row.route}\t${row.pickupPoint}\t${row.amount}`)
        .join("\n");
      void navigator.clipboard.writeText(text).then(
        () => toast.success("Pickup point list copied"),
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
          <h2 className="text-xl font-semibold text-[#03a9f4]">Pickup Point List</h2>
          <p className="text-sm text-[#6b7280]">
            Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Pick Up Point List
          </p>
        </div>
        <ActionPills items={PICKUP_POINT_PILLS} />
      </div>

      <div className="rounded-sm border border-[#d7e3ec] bg-white p-5 shadow-sm">
        <label className="mb-5 block max-w-md space-y-1.5 text-sm text-[#111827]">
          <span>Route Name</span>
          <Select value={routeFilter} onValueChange={setRouteFilter}>
            <SelectTrigger className="h-9 bg-white" aria-label="Route Name">
              <SelectValue placeholder="--ALL--" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">--ALL--</SelectItem>
              {ROUTE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

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
              aria-label="Search pickup points"
            />
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-sm border border-[#dbe3ea]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                  <TableHead className="text-xs font-bold">Route</TableHead>
                  <TableHead className="text-xs font-bold">PickUp Point</TableHead>
                  <TableHead className="text-xs font-bold">Amount</TableHead>
                  <TableHead className="text-center text-xs font-bold">Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-sm text-[#6b7280]">
                      No data available in table
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={cn(index % 2 === 1 ? "bg-[#f3f9fc]" : "bg-white")}
                    >
                      <TableCell>{row.route}</TableCell>
                      <TableCell className="font-medium">{row.pickupPoint}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          size="sm"
                          className="h-8 rounded-full bg-[#03a9f4] px-3 text-xs font-semibold text-white hover:bg-[#0288d1]"
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
        aria-label="Add pickup point"
        onClick={openAdd}
      >
        <Plus className="size-6" />
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Pickup Point" : "Add Pickup Point"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <label className="block space-y-1.5 text-sm">
              <span>Route</span>
              <Select value={route} onValueChange={setRoute}>
                <SelectTrigger aria-label="Route">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROUTE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>
                PickUp Point<span className="text-[#e53935]">*</span>
              </span>
              <Input
                value={pickupPoint}
                onChange={(event) => setPickupPoint(event.target.value)}
                aria-label="PickUp Point"
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>
                Amount<span className="text-[#e53935]">*</span>
              </span>
              <Input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                aria-label="Amount"
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
