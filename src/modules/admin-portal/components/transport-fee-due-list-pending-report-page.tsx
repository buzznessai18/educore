import { useState } from "react";
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

const TRANSPORT_FEE_DUE_PILLS: ActionPill[] = [
  { label: "Fee Receipt", tone: "green", href: "/fms/fee-receipt" },
  { label: "Day Book Report", tone: "green", href: "/fms/day-book-report" },
  { label: "Fee Pending Report", tone: "green", href: "/fms/fee-pending-report" },
  { label: "Fee Print List", tone: "green", href: "/fms/fee-print-list" },
  { label: "Masters", tone: "blue", href: "/fms/fee-type-master", dropdown: true },
  {
    label: "Reports",
    tone: "blue",
    href: "/fms/transport-fee-due-list-pending-report",
    dropdown: true,
  },
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
const SEMESTER_OPTIONS = ["I-Term", "II-Term", "III-Term", "NURSERY", "LKG", "UKG"];
const ROUTE_OPTIONS = ["Route-1", "Route-2", "Route-3"];
const PICKUP_OPTIONS = [
  "Sadhankeri (PRIMARY)",
  "Rajiv Gandhi Nagar(PRIMARY)",
  "Malapur Last Stop (PRIMARY)",
  "City Center (PRIMARY)",
  "North Campus Gate (HIGH)",
];

const FEE_MONTHS = [
  "June Fee",
  "July Fee",
  "August Fee",
  "September Fee",
  "October Fee",
  "November Fee",
  "December Fee",
  "January Fee",
  "February fee",
  "March fee",
] as const;

export function TransportFeeDueListPendingReportPage() {
  const [year, setYear] = useState("2026");
  const [level, setLevel] = useState("all");
  const [semester, setSemester] = useState("none");
  const [route, setRoute] = useState("none");
  const [pickupPoint, setPickupPoint] = useState("none");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedFees, setSelectedFees] = useState<string[]>([...FEE_MONTHS]);
  const [balanceFilter, setBalanceFilter] = useState<"all" | "balance" | "paid">("all");

  const allFeesSelected = selectedFees.length === FEE_MONTHS.length;

  const toggleFee = (fee: string) => {
    setSelectedFees((current) =>
      current.includes(fee) ? current.filter((item) => item !== fee) : [...current, fee],
    );
  };

  const toggleAllFees = (checked: boolean) => {
    setSelectedFees(checked ? [...FEE_MONTHS] : []);
  };

  const handleFind = () => {
    if (selectedFees.length === 0) {
      toast.error("Select at least one transport fee month");
      return;
    }
    toast.success(
      `Transport pending fee-descriptions ready (${selectedFees.length} month(s), ${balanceFilter} view)`,
    );
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#03a9f4]">Pending Fee-Descriptions</h2>
          <p className="text-sm text-[#6b7280]">
            Home <span className="mx-1 text-[#9ca3af]">&gt;</span> Pending Fee-Descriptions
          </p>
        </div>
        <ActionPills items={TRANSPORT_FEE_DUE_PILLS} />
      </div>

      <div className="overflow-hidden rounded-sm border border-[#d7e3ec] bg-white shadow-sm">
        <div className="bg-[#03a9f4] px-4 py-2.5">
          <h3 className="text-sm font-semibold text-white">Pending Fee-Descriptions</h3>
        </div>

        <div className="space-y-5 bg-[#f8fafc] p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block space-y-1.5 text-sm text-[#111827]">
              <span>Year</span>
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

            <label className="block space-y-1.5 text-sm text-[#111827]">
              <span>Level/Combination</span>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="h-9 bg-white" aria-label="Level/Combination">
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

            <label className="block space-y-1.5 text-sm text-[#111827]">
              <span>Semester</span>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger className="h-9 bg-white" aria-label="Semester">
                  <SelectValue placeholder="Nothing selected" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nothing selected</SelectItem>
                  {SEMESTER_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="block space-y-1.5 text-sm text-[#111827]">
              <span>Route</span>
              <Select value={route} onValueChange={setRoute}>
                <SelectTrigger className="h-9 bg-white" aria-label="Route">
                  <SelectValue placeholder="Nothing selected" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nothing selected</SelectItem>
                  {ROUTE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="block space-y-1.5 text-sm text-[#111827]">
              <span>PickupPoint</span>
              <Select value={pickupPoint} onValueChange={setPickupPoint}>
                <SelectTrigger className="h-9 bg-white" aria-label="PickupPoint">
                  <SelectValue placeholder="Nothing selected" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nothing selected</SelectItem>
                  {PICKUP_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="block space-y-1.5 text-sm text-[#111827]">
              <span>From Date</span>
              <Input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="h-9 bg-white"
                aria-label="From Date"
              />
            </label>

            <label className="block space-y-1.5 text-sm text-[#111827]">
              <span>To Date</span>
              <Input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="h-9 bg-white"
                aria-label="To Date"
              />
            </label>
          </div>

          <Button
            type="button"
            className="h-9 rounded-sm bg-[#5cb85c] px-4 text-sm font-semibold text-white hover:bg-[#4cae4c]"
            onClick={handleFind}
          >
            <Search className="size-4" />
            Find
          </Button>

          <div className="space-y-3 rounded-sm border border-[#dbe3ea] bg-white p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-[#111827]">
              <Checkbox
                checked={allFeesSelected}
                onCheckedChange={(checked) => toggleAllFees(Boolean(checked))}
                aria-label="Select / Deselect All"
              />
              <span>Select / Deselect All</span>
            </label>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {FEE_MONTHS.map((fee) => (
                <label key={fee} className="flex items-center gap-2 text-sm text-[#111827]">
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
              <RadioGroupItem value="all" id="transport-due-all" />
              <Label htmlFor="transport-due-all" className="cursor-pointer text-sm font-medium">
                All
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="balance" id="transport-due-balance" />
              <Label htmlFor="transport-due-balance" className="cursor-pointer text-sm font-medium">
                Only Balance
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="paid" id="transport-due-paid" />
              <Label htmlFor="transport-due-paid" className="cursor-pointer text-sm font-medium">
                Only Paid
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
