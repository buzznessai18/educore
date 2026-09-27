import { Link, useRouterState } from "@tanstack/react-router";
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

export const SETTINGS_MASTER_PILLS: ActionPill[] = [
  { label: "Academic", tone: "green", href: "/settings/academic" },
  { label: "Year", tone: "green", href: "/settings/financial-year" },
  { label: "Leave Year", tone: "green", href: "/settings/leave-year" },
  { label: "Board", tone: "green", href: "/settings/board" },
  { label: "Course", tone: "green", href: "/settings/course" },
  { label: "Syllabus", tone: "green", href: "/settings/syllabus" },
  { label: "Level", tone: "green", href: "/settings/level" },
  { label: "Quota", tone: "green", href: "/settings/quota" },
  { label: "Class", tone: "green", href: "/settings/class" },
  { label: "Label Master", tone: "green", href: "/settings/document-label" },
  { label: "Exam Passed", tone: "green" },
  { label: "Components List", tone: "green" },
  { label: "Shift Master", tone: "green" },
  { label: "Country", tone: "green", href: "/settings/nationality" },
];

export function ActionPills({
  items,
  className,
}: {
  items: ActionPill[];
  className?: string;
}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className={cn("flex flex-wrap justify-end gap-2", className)}>
      {items.map((pill) => {
        const isActive = Boolean(pill.href && pathname === pill.href);
        const pillClassName = cn(
          portalTone[pill.tone],
          isActive && "brightness-90 ring-2 ring-white/40",
        );

        if (pill.href) {
          return (
            <Button key={pill.label} asChild className={pillClassName}>
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
            className={pillClassName}
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
