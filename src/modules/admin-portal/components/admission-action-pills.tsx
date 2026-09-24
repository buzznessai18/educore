import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { portalTone } from "@/modules/admin-portal/components/portal-ui";
import { cn } from "@/lib/utils";

export type ActionPill = {
  label: string;
  tone: "green" | "light-green" | "blue" | "red";
  href?: string;
  dropdown?: boolean;
};

export function ActionPills({ items }: { items: ActionPill[] }) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      {items.map((pill) => {
        const className = cn(portalTone[pill.tone]);

        if (pill.href) {
          return (
            <Button key={pill.label} asChild className={className}>
              <Link to={pill.href}>
                {pill.label}
                {pill.dropdown ? <ChevronDown className="size-3.5" /> : null}
              </Link>
            </Button>
          );
        }

        return (
          <Button
            key={pill.label}
            type="button"
            className={className}
            onClick={() => toast.info(`${pill.label} ready for Phase 2 wiring`)}
          >
            {pill.label}
            {pill.dropdown ? <ChevronDown className="size-3.5" /> : null}
          </Button>
        );
      })}
    </div>
  );
}

export const ADMISSION_ACTION_PILLS: ActionPill[] = [
  { label: "Application Form", tone: "green", href: "/admissions/registration/new" },
  { label: "Direct Admission Form", tone: "green", href: "/admissions/registration/new" },
  { label: "Admission", tone: "green", href: "/admissions/applied" },
  { label: "Interview List", tone: "green" },
  { label: "Selection List", tone: "green" },
  { label: "Masters", tone: "blue", dropdown: true },
  { label: "Reports", tone: "blue", href: "/admissions/report", dropdown: true },
  { label: "Transaction", tone: "blue", dropdown: true },
];

export const ACADEMIC_ACTION_PILLS: ActionPill[] = [
  { label: "Student Master", tone: "green", href: "/academic/students" },
  { label: "Student Info", tone: "green", href: "/academic/students" },
  { label: "Employee Master", tone: "green", href: "/hr/staff" },
  { label: "Class Master", tone: "green", href: "/academic/classes" },
  { label: "Section Master", tone: "green", href: "/academic/sections" },
  { label: "Subject List", tone: "green", href: "/academic/subjects" },
  { label: "Masters", tone: "blue", dropdown: true },
  { label: "Reports", tone: "blue", href: "/academic/feedback-report", dropdown: true },
  { label: "Transaction", tone: "blue", dropdown: true },
];

export const STUDENT_TC_ACTION_PILLS: ActionPill[] = [
  { label: "Class", tone: "green", href: "/academic/classes" },
  { label: "Country", tone: "green" },
  { label: "Admission List", tone: "green", href: "/admissions/registration" },
  { label: "Add Student", tone: "green", href: "/admissions/registration/new" },
  { label: "Admission", tone: "green", href: "/admissions/applied" },
  { label: "Fee Receipt", tone: "green" },
  { label: "Masters", tone: "blue", dropdown: true },
  { label: "Reports", tone: "blue", href: "/academic/student-tc", dropdown: true },
];

export function AdmissionActionPills() {
  return <ActionPills items={ADMISSION_ACTION_PILLS} />;
}

export function AcademicActionPills() {
  return <ActionPills items={ACADEMIC_ACTION_PILLS} />;
}

export function StudentTcActionPills() {
  return <ActionPills items={STUDENT_TC_ACTION_PILLS} />;
}
