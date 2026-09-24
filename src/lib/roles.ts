import {
  navigationSections,
  type EduRoutePath,
  type NavSection,
} from "@/lib/educore-data";

export const APP_ROLES = [
  "super_admin",
  "admin",
  "staff_admin",
  "teacher",
  "parent",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

export type DemoUser = {
  role: AppRole;
  name: string;
  email: string;
  initials: string;
  title: string;
};

const SESSION_KEY = "educore.demo.session";

/** Routes each role can open in the Phase 1 mock shell. */
const ROLE_ROUTE_ACCESS: Record<AppRole, readonly EduRoutePath[] | "all"> = {
  super_admin: "all",
  admin: "all",
  staff_admin: [
    "/dashboard",
    "/academic/students",
    "/academic/classes",
    "/academic/sections",
    "/academic/subjects",
    "/academic/timetable",
    "/academic/attendance",
    "/admissions/portal",
    "/admissions/applied",
    "/admissions/admitted",
    "/admissions/registration",
    "/admissions/applications",
    "/admissions/enquiries",
    "/admissions/process",
    "/learning/courses",
    "/learning/lessons",
    "/learning/assignments",
    "/learning/online-classes",
    "/administration/library",
    "/administration/inventory",
    "/administration/transport",
    "/administration/communication",
    "/administration/events",
    "/administration/documents",
    "/reports/academic",
    "/reports/attendance",
    "/reports/students",
  ],
  teacher: [
    "/dashboard",
    "/academic/students",
    "/academic/classes",
    "/academic/sections",
    "/academic/subjects",
    "/academic/timetable",
    "/academic/attendance",
    "/academic/examinations",
    "/academic/results",
    "/academic/report-cards",
    "/learning/courses",
    "/learning/lessons",
    "/learning/assignments",
    "/learning/online-classes",
    "/administration/communication",
    "/administration/events",
    "/reports/academic",
    "/reports/attendance",
    "/reports/students",
  ],
  parent: [
    "/dashboard",
    "/academic/attendance",
    "/academic/timetable",
    "/academic/results",
    "/academic/report-cards",
    "/finance/fees",
    "/finance/payments",
    "/learning/assignments",
    "/learning/online-classes",
    "/administration/communication",
    "/administration/events",
    "/administration/transport",
    "/reports/attendance",
    "/reports/academic",
  ],
};

export const ROLE_DEFINITIONS: Record<
  AppRole,
  { label: string; description: string; hierarchy: number }
> = {
  super_admin: {
    label: "Super Admin",
    description: "Platform-wide control across schools, roles, and critical settings.",
    hierarchy: 5,
  },
  admin: {
    label: "Admin",
    description: "Full school ERP access for academics, finance, HR, and settings.",
    hierarchy: 4,
  },
  staff_admin: {
    label: "Staff Admin",
    description: "Operations access for admissions, administration, and day-to-day workflows.",
    hierarchy: 3,
  },
  teacher: {
    label: "Teacher",
    description: "Classroom tools for attendance, lessons, exams, and assigned class results.",
    hierarchy: 2,
  },
  parent: {
    label: "Parent",
    description: "Child-focused view of attendance, results, fees, and school updates.",
    hierarchy: 1,
  },
};

export const DEMO_USERS: DemoUser[] = [
  {
    role: "super_admin",
    name: "Aisha Kapoor",
    email: "superadmin@educore.school",
    initials: "AK",
    title: "Platform Super Admin",
  },
  {
    role: "admin",
    name: "Maya Singh",
    email: "admin@educore.school",
    initials: "MS",
    title: "School Admin",
  },
  {
    role: "staff_admin",
    name: "Rohan Mehta",
    email: "staff@educore.school",
    initials: "RM",
    title: "Operations Staff Admin",
  },
  {
    role: "teacher",
    name: "Priya Nair",
    email: "teacher@educore.school",
    initials: "PN",
    title: "Class Teacher",
  },
  {
    role: "parent",
    name: "Vikram Joshi",
    email: "parent@educore.school",
    initials: "VJ",
    title: "Parent Guardian",
  },
];

export type DemoSession = {
  role: AppRole;
  name: string;
  email: string;
  initials: string;
  title: string;
};

export function getRoleLabel(role: AppRole): string {
  return ROLE_DEFINITIONS[role].label;
}

export function getDemoUserByRole(role: AppRole): DemoUser {
  const user = DEMO_USERS.find((item) => item.role === role);
  return user ?? DEMO_USERS[1]!;
}

export function getDemoUserByEmail(email: string): DemoUser | undefined {
  const normalized = email.trim().toLowerCase();
  return DEMO_USERS.find((user) => user.email === normalized);
}

export function saveDemoSession(user: DemoUser): void {
  if (typeof window === "undefined") return;
  const session: DemoSession = {
    role: user.role,
    name: user.name,
    email: user.email,
    initials: user.initials,
    title: user.title,
  };
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearDemoSession(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(SESSION_KEY);
}

export function getDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as DemoSession;
    if (!APP_ROLES.includes(parsed.role)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function canAccessRoute(role: AppRole, path: EduRoutePath): boolean {
  const access = ROLE_ROUTE_ACCESS[role];
  if (access === "all") return true;
  return access.includes(path);
}

export function getNavigationForRole(role: AppRole): NavSection[] {
  const access = ROLE_ROUTE_ACCESS[role];
  if (access === "all") return navigationSections;

  return navigationSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => access.includes(item.path)),
    }))
    .filter((section) => section.items.length > 0);
}

export function getDefaultRouteForRole(role: AppRole): EduRoutePath {
  const sections = getNavigationForRole(role);
  return sections[0]?.items[0]?.path ?? "/dashboard";
}
