import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ActionPills,
  type ActionPill,
} from "@/modules/admin-portal/components/admission-action-pills";
import { CLASS_OPTIONS, SECTION_OPTIONS } from "@/modules/admin-portal/constants";

const FEE_DUE_PILLS: ActionPill[] = [
  { label: "Fee Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Day Book Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Fee Pending Report", tone: "green", href: "/fms/fee-pending-report" },
  { label: "Fee Print List", tone: "green", href: "/fms/fee-print-list" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  { label: "Reports", tone: "blue", href: "/fms/fee-due-list-pending-report", dropdown: true },
  { label: "Transaction", tone: "blue", href: "/fms/fee-receipt", dropdown: true },
];

const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"];
const LEVEL_OPTIONS = [
  { value: "all", label: "--ALL--" },
  { value: "pre-primary", label: "Pre-Primary" },
  { value: "primary", label: "Primary" },
  { value: "middle", label: "Middle" },
  { value: "high", label: "High" },
];

const STATUS_OPTIONS = ["Regular", "RTE", "Staff Child", "Pending", "Partial", "Paid"];

const FEE_CATEGORIES = [
  "ACADEMIC FEE",
  "BOOKS FEES",
  "June Fee",
  "July Fee",
  "August Fee",
  "September Fee",
  "October Fee",
  "November Fee",
  "December Fee",
  "January Fee",
  "February Fee",
  "March Fee",
] as const;

export function FeeDueListPendingReportPage() {
  const [year, setYear] = useState("2026");
  const [level, setLevel] = useState("all");
  const [classId, setClassId] = useState("all");
  const [sectionId, setSectionId] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [selectedFees, setSelectedFees] = useState<string[]>([...FEE_CATEGORIES]);
  const [balanceFilter, setBalanceFilter] = useState<"all" | "balance" | "paid">("all");

  const allFeesSelected = selectedFees.length === FEE_CATEGORIES.length;

  const statusLabel = useMemo(() => {
    if (statuses.length === 0) return "Nothing selected";
    if (statuses.length === 1) return statuses[0];
    return `${statuses.length} selected`;
  }, [statuses]);

  const toggleFee = (fee: string) => {
    setSelectedFees((current) =>
      current.includes(fee) ? current.filter((item) => item !== fee) : [...current, fee],
    );
  };

  const toggleAllFees = (checked: boolean) => {
    setSelectedFees(checked ? [...FEE_CATEGORIES] : []);
  };

  const toggleStatus = (status: string) => {
    setStatuses((current) =>
      current.includes(status) ? current.filter((item) => item !== status) : [...current, status],
    );
  };

  const handleFind = () => {
    if (selectedFees.length === 0) {
      toast.error("Select at least one fee description");
      return;
    }
    toast.success(
      `Pending fee-descriptions ready (${selectedFees.length} fee type(s), ${balanceFilter} view)`,
    );
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-info">Pending Fee-Descriptions</h2>
          <p className="text-sm text-muted-foreground">
            Home <span className="mx-1 text-muted-foreground/70">&gt;</span> Pending Fee-Descriptions
          </p>
        </div>
        <ActionPills items={FEE_DUE_PILLS} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-enterprise-sm">
        <div className="bg-info px-4 py-2.5">
          <h3 className="text-sm font-semibold text-white">Pending Fee-Descriptions</h3>
        </div>

        <div className="space-y-5 bg-muted/50 p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block space-y-1.5 text-sm text-foreground">
              <span>Year</span>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="h-9 bg-card" aria-label="Year">
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

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>Level/Combination</span>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="h-9 bg-card" aria-label="Level/Combination">
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
              <span>Class/Semester</span>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger className="h-9 bg-card" aria-label="Class/Semester">
                  <SelectValue placeholder="--ALL--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">--ALL--</SelectItem>
                  {CLASS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>Section</span>
              <Select value={sectionId} onValueChange={setSectionId}>
                <SelectTrigger className="h-9 bg-card" aria-label="Section">
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

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>From Date</span>
              <Input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="h-9 bg-card"
                aria-label="From Date"
              />
            </label>

            <label className="block space-y-1.5 text-sm text-foreground">
              <span>To Date</span>
              <Input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="h-9 bg-card"
                aria-label="To Date"
              />
            </label>

            <div className="space-y-1.5 text-sm text-foreground sm:col-span-2">
              <span>Status</span>
              <div className="rounded-sm border border-input bg-card p-3">
                <p className="mb-2 text-xs text-muted-foreground">{statusLabel}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {STATUS_OPTIONS.map((status) => (
                    <label key={status} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={statuses.includes(status)}
                        onCheckedChange={() => toggleStatus(status)}
                        aria-label={status}
                      />
                      <span>{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button
            type="button"
            className="h-9 rounded-md bg-success px-4 text-sm font-semibold text-white hover:bg-success/90"
            onClick={handleFind}
          >
            <Search className="size-4" />
            Find
          </Button>

          <div className="space-y-3 rounded-xl border border-border bg-card p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Checkbox
                checked={allFeesSelected}
                onCheckedChange={(checked) => toggleAllFees(Boolean(checked))}
                aria-label="Select / Deselect All"
              />
              <span>Select / Deselect All</span>
            </label>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {FEE_CATEGORIES.map((fee) => (
                <label key={fee} className="flex items-center gap-2 text-sm text-foreground">
                  <Checkbox
                    checked={selectedFees.includes(fee)}
                    onCheckedChange={() => toggleFee(fee)}
                    aria-label={fee}
                  />
                  <span>{fee}</span>
                </label>
              ))}
            </div>
          </div>

          <RadioGroup
            value={balanceFilter}
            onValueChange={(value) => setBalanceFilter(value as "all" | "balance" | "paid")}
            className="flex flex-wrap gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="all" id="fee-due-all" />
              <Label htmlFor="fee-due-all" className="cursor-pointer text-sm font-medium">
                All
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="balance" id="fee-due-balance" />
              <Label htmlFor="fee-due-balance" className="cursor-pointer text-sm font-medium">
                Only Balance
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="paid" id="fee-due-paid" />
              <Label htmlFor="fee-due-paid" className="cursor-pointer text-sm font-medium">
                Only Paid
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
