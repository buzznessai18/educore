import { type ReactNode, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdmissionActionPills } from "@/modules/admin-portal/components/admission-action-pills";
import {
  CLASS_OPTIONS,
  QUOTA_OPTIONS,
} from "@/modules/admin-portal/constants";

const YEAR_OPTIONS = ["2024", "2025", "2026", "2027"];

const FINANCIAL_YEAR_OPTIONS = [
  { value: "2024-25", label: "2024-25" },
  { value: "2025-26", label: "2025-26" },
  { value: "2026-27", label: "2026-27" },
];

const ADMISSION_TYPE_OPTIONS = [
  { value: "new-registration", label: "New Registration" },
  { value: "direct-admission", label: "Direct Admission" },
  { value: "transfer", label: "Transfer" },
  { value: "readmission", label: "Re-admission" },
];

export function StudentAdmissionPage() {
  const [year, setYear] = useState("2026");
  const [financialYear, setFinancialYear] = useState("2026-27");
  const [classId, setClassId] = useState("none");
  const [quota, setQuota] = useState("none");
  const [admissionType, setAdmissionType] = useState("new-registration");

  const handleGetResult = () => {
    if (classId === "none" || quota === "none") {
      toast.error("Please select Class/Semester and Quota");
      return;
    }
    toast.success("Admission filters applied");
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-4 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Home <span className="mx-1 text-muted-foreground/70">&gt;</span> Student Admission
        </p>
        <AdmissionActionPills />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-enterprise-sm">
        <div className="bg-info px-4 py-2.5">
          <h2 className="text-sm font-semibold text-white">Student Admission</h2>
        </div>

        <div className="space-y-5 p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Year">
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
            </Field>

            <Field label="Financial Year">
              <Select value={financialYear} onValueChange={setFinancialYear}>
                <SelectTrigger className="h-9 bg-card" aria-label="Financial Year">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FINANCIAL_YEAR_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Class/Semester" required>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger className="h-9 bg-card" aria-label="Class or Semester">
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">--Select--</SelectItem>
                  {CLASS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Quota" required>
              <Select value={quota} onValueChange={setQuota}>
                <SelectTrigger className="h-9 bg-card" aria-label="Quota">
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">--Select--</SelectItem>
                  {QUOTA_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,280px)_auto] md:items-end">
            <Field label="AdmissionType" required>
              <Select value={admissionType} onValueChange={setAdmissionType}>
                <SelectTrigger className="h-9 bg-card" aria-label="Admission Type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ADMISSION_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Button
              type="button"
              className="h-9 rounded-md bg-info px-5 text-sm font-semibold text-white hover:bg-info/90"
              onClick={handleGetResult}
            >
              Get Result
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-sm text-foreground">
      <span>
        {label}
        {required ? <span className="text-danger">*</span> : null}
      </span>
      {children}
    </label>
  );
}
