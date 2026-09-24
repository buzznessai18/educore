import {
  Award,
  Banknote,
  BookCopy,
  BriefcaseBusiness,
  Building2,
  BusFront,
  Calculator,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  Database,
  FileBarChart2,
  FileCheck2,
  FilePenLine,
  FileStack,
  FileText,
  GraduationCap,
  Home,
  LibraryBig,
  LogIn,
  MessageSquareText,
  MonitorPlay,
  Package,
  Printer,
  ScrollText,
  ShoppingCart,
  Trophy,
  UserCog,
  UserRoundCheck,
  Users,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

export type EduRoutePath =
  | "/dashboard"
  | "/academic/students"
  | "/academic/teachers"
  | "/academic/classes"
  | "/academic/sections"
  | "/academic/subjects"
  | "/academic/timetable"
  | "/academic/attendance"
  | "/academic/examinations"
  | "/academic/results"
  | "/academic/report-cards"
  | "/academic/feedback-report"
  | "/academic/student-tc"
  | "/academic/withheld-list"
  | "/academic/class-allocation-report"
  | "/academic/sms-report"
  | "/academic/marks-card"
  | "/academic/marks-report"
  | "/academic/summatative-report"
  | "/admissions/portal"
  | "/admissions/applied"
  | "/admissions/admitted"
  | "/admissions/registration"
  | "/admissions/applications"
  | "/admissions/enquiries"
  | "/admissions/process"
  | "/admissions/report"
  | "/finance/fees"
  | "/finance/fee-structure"
  | "/finance/payments"
  | "/finance/expenses"
  | "/finance/reports"
  | "/fms/fee-type-master"
  | "/fms/bank"
  | "/fms/fee-description"
  | "/fms/pickup-point"
  | "/fms/fee-master"
  | "/fms/fee-receipt"
  | "/fms/fee-print-list"
  | "/fms/cancelled-fee-list"
  | "/fms/update-student-fee"
  | "/fms/update-material-fee"
  | "/fms/student-concession"
  | "/fms/change-student-fee"
  | "/fms/rte-report"
  | "/fms/fee-concession-report"
  | "/fms/fee-pending-report"
  | "/fms/fee-description-pending-report"
  | "/fms/fee-due-list-pending-report"
  | "/fms/transport-fee-due-list-pending-report"
  | "/fms/day-book-report"
  | "/fms/cheque-clearence"
  | "/fms/mop-report"
  | "/fms/daily-mop-report"
  | "/learning/courses"
  | "/learning/lessons"
  | "/learning/assignments"
  | "/learning/online-classes"
  | "/administration/library"
  | "/administration/inventory"
  | "/administration/transport"
  | "/administration/communication"
  | "/administration/events"
  | "/administration/documents"
  | "/hr/staff"
  | "/hr/leave-management"
  | "/hr/payroll"
  | "/reports/academic"
  | "/reports/attendance"
  | "/reports/fees"
  | "/reports/students"
  | "/settings";

export type NavItem = {
  title: string;
  path: EduRoutePath;
  icon: LucideIcon;
  pageKey: string;
};

export type NavSection = {
  /** Stable id for expand state / duplicate labels */
  id: string;
  label: string;
  icon: LucideIcon;
  /** When true, row shows a chevron and can expand children */
  expandable: boolean;
  /** Optional direct path when the row itself is a link (e.g. Home) or default landing */
  path?: EduRoutePath;
  pageKey?: string;
  items: NavItem[];
  /** Sidebar group — "extra" renders under EXTRA COMPONENTS */
  group?: "main" | "extra";
};

export const navigationSections: NavSection[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    expandable: false,
    path: "/dashboard",
    pageKey: "dashboard",
    items: [{ title: "Home", path: "/dashboard", icon: Home, pageKey: "dashboard" }],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Database,
    expandable: true,
    path: "/settings",
    pageKey: "settings",
    items: [{ title: "Settings", path: "/settings", icon: Database, pageKey: "settings" }],
  },
  {
    id: "reports",
    label: "Reports",
    icon: UsersRound,
    expandable: true,
    items: [
      { title: "Academic Reports", path: "/reports/academic", icon: Award, pageKey: "academic-reports" },
      { title: "Attendance Reports", path: "/reports/attendance", icon: ClipboardCheck, pageKey: "attendance-reports" },
      { title: "Fee Reports", path: "/reports/fees", icon: WalletCards, pageKey: "fee-reports" },
      { title: "Student Reports", path: "/reports/students", icon: Users, pageKey: "student-reports" },
    ],
  },
  {
    id: "printables",
    label: "Printables",
    icon: Database,
    expandable: true,
    items: [],
  },
  {
    id: "fms",
    label: "FMS",
    icon: Building2,
    expandable: true,
    items: [
      { title: "Fee Type Master", path: "/fms/fee-type-master", icon: WalletCards, pageKey: "fee-type-master" },
      { title: "Bank", path: "/fms/bank", icon: Building2, pageKey: "fms-bank" },
      { title: "Fee Description", path: "/fms/fee-description", icon: FileText, pageKey: "fee-description" },
      { title: "PickUp Point", path: "/fms/pickup-point", icon: BusFront, pageKey: "pickup-point" },
      { title: "Fee Master", path: "/fms/fee-master", icon: Database, pageKey: "fee-master" },
      { title: "Fee Receipt", path: "/fms/fee-receipt", icon: CreditCard, pageKey: "fee-receipt" },
      { title: "Fee Print List", path: "/fms/fee-print-list", icon: Printer, pageKey: "fee-print-list" },
      { title: "Cancelled Fee List", path: "/fms/cancelled-fee-list", icon: ClipboardList, pageKey: "cancelled-fee-list" },
      { title: "Update Student Fee", path: "/fms/update-student-fee", icon: FilePenLine, pageKey: "update-student-fee" },
      { title: "Update Material Fee", path: "/fms/update-material-fee", icon: Package, pageKey: "update-material-fee" },
      { title: "Student Concession", path: "/fms/student-concession", icon: Trophy, pageKey: "student-concession" },
      { title: "Change Student Fee", path: "/fms/change-student-fee", icon: Banknote, pageKey: "change-student-fee" },
      { title: "RTE Report", path: "/fms/rte-report", icon: FileBarChart2, pageKey: "rte-report" },
      { title: "Fee Concession Report", path: "/fms/fee-concession-report", icon: FileBarChart2, pageKey: "fee-concession-report" },
      { title: "Fee Pending Report", path: "/fms/fee-pending-report", icon: FileBarChart2, pageKey: "fee-pending-report" },
      {
        title: "Fee Description Pending Report",
        path: "/fms/fee-description-pending-report",
        icon: FileBarChart2,
        pageKey: "fee-description-pending-report",
      },
      {
        title: "Fee Due list Pending Report",
        path: "/fms/fee-due-list-pending-report",
        icon: FileBarChart2,
        pageKey: "fee-due-list-pending-report",
      },
      {
        title: "Transport Fee due List Pending Report",
        path: "/fms/transport-fee-due-list-pending-report",
        icon: BusFront,
        pageKey: "transport-fee-due-list-pending-report",
      },
      { title: "Day Book Report", path: "/fms/day-book-report", icon: ScrollText, pageKey: "day-book-report" },
      { title: "Cheque Clearence", path: "/fms/cheque-clearence", icon: Banknote, pageKey: "cheque-clearence" },
      { title: "MOP Report", path: "/fms/mop-report", icon: FileBarChart2, pageKey: "mop-report" },
      { title: "Daily MOP Report", path: "/fms/daily-mop-report", icon: CalendarDays, pageKey: "daily-mop-report" },
    ],
  },
  {
    id: "admissions",
    label: "Admissions",
    icon: UserRoundCheck,
    expandable: true,
    items: [
      {
        title: "Student Registration",
        path: "/admissions/registration",
        icon: FilePenLine,
        pageKey: "registration",
      },
      {
        title: "Admission",
        path: "/admissions/applied",
        icon: ClipboardList,
        pageKey: "applied",
      },
      {
        title: "Admission Report",
        path: "/admissions/report",
        icon: FileBarChart2,
        pageKey: "admission-report",
      },
    ],
  },
  {
    id: "academic",
    label: "Academic",
    icon: GraduationCap,
    expandable: true,
    items: [
      {
        title: "Student FeedBack Report",
        path: "/academic/feedback-report",
        icon: MessageSquareText,
        pageKey: "feedback-report",
      },
      {
        title: "Student TC",
        path: "/academic/student-tc",
        icon: FileText,
        pageKey: "student-tc",
      },
      {
        title: "With Held List",
        path: "/academic/withheld-list",
        icon: ClipboardList,
        pageKey: "withheld-list",
      },
      {
        title: "Student Attendance",
        path: "/academic/attendance",
        icon: ClipboardCheck,
        pageKey: "attendance",
      },
      {
        title: "Class Allocation Report",
        path: "/academic/class-allocation-report",
        icon: GraduationCap,
        pageKey: "class-allocation-report",
      },
      {
        title: "SMS Report",
        path: "/academic/sms-report",
        icon: MessageSquareText,
        pageKey: "sms-report",
      },
      {
        title: "Student MarksCard",
        path: "/academic/marks-card",
        icon: FileCheck2,
        pageKey: "marks-card",
      },
      {
        title: "Marks Report",
        path: "/academic/marks-report",
        icon: FileBarChart2,
        pageKey: "marks-report",
      },
      {
        title: "Summatative Report",
        path: "/academic/summatative-report",
        icon: Award,
        pageKey: "summatative-report",
      },
    ],
  },
  {
    id: "faculty",
    label: "Faculty",
    icon: Users,
    expandable: true,
    path: "/academic/teachers",
    items: [{ title: "Teachers", path: "/academic/teachers", icon: UserRoundCheck, pageKey: "teachers" }],
  },
  {
    id: "lms",
    label: "LMS",
    icon: Calculator,
    expandable: true,
    items: [
      { title: "Courses", path: "/learning/courses", icon: BookCopy, pageKey: "courses" },
      { title: "Lessons", path: "/learning/lessons", icon: ScrollText, pageKey: "lessons" },
      { title: "Assignments", path: "/learning/assignments", icon: FileStack, pageKey: "assignments" },
      { title: "Online Classes", path: "/learning/online-classes", icon: MonitorPlay, pageKey: "online-classes" },
    ],
  },
  {
    id: "ocm",
    label: "OCM",
    icon: Calculator,
    expandable: true,
    items: [],
  },
  {
    id: "finance",
    label: "Finance",
    icon: Calculator,
    expandable: true,
    items: [
      { title: "Fees", path: "/finance/fees", icon: WalletCards, pageKey: "fees" },
      { title: "Fee Structure", path: "/finance/fee-structure", icon: FileText, pageKey: "fee-structure" },
      { title: "Payments", path: "/finance/payments", icon: CreditCard, pageKey: "payments" },
      { title: "Expenses", path: "/finance/expenses", icon: Banknote, pageKey: "expenses" },
      { title: "Financial Reports", path: "/finance/reports", icon: FileBarChart2, pageKey: "financial-reports" },
    ],
  },
  {
    id: "student",
    label: "Student",
    icon: Calculator,
    expandable: true,
    path: "/academic/students",
    items: [{ title: "Students", path: "/academic/students", icon: Users, pageKey: "students" }],
  },
  {
    id: "timetable",
    label: "TimeTable",
    icon: Calculator,
    expandable: true,
    path: "/academic/timetable",
    items: [{ title: "Timetable", path: "/academic/timetable", icon: CalendarClock, pageKey: "timetable" }],
  },
  {
    id: "exam",
    label: "Exam",
    icon: Calculator,
    expandable: true,
    items: [
      { title: "Examinations", path: "/academic/examinations", icon: FilePenLine, pageKey: "examinations" },
      { title: "Results", path: "/academic/results", icon: Trophy, pageKey: "results" },
      { title: "Report Cards", path: "/academic/report-cards", icon: FileCheck2, pageKey: "report-cards" },
    ],
  },
  {
    id: "library",
    label: "Library",
    icon: Calculator,
    expandable: true,
    path: "/administration/library",
    items: [{ title: "Library", path: "/administration/library", icon: LibraryBig, pageKey: "library" }],
  },
  {
    id: "hrms",
    label: "HRMS",
    icon: UserCog,
    expandable: true,
    items: [
      { title: "Staff", path: "/hr/staff", icon: BriefcaseBusiness, pageKey: "staff" },
      { title: "Leave Management", path: "/hr/leave-management", icon: CalendarCheck, pageKey: "leave-management" },
    ],
  },
  {
    id: "payroll",
    label: "Payroll",
    icon: Calculator,
    expandable: true,
    path: "/hr/payroll",
    items: [{ title: "Payroll", path: "/hr/payroll", icon: WalletCards, pageKey: "payroll" }],
  },
  {
    id: "visitor-management",
    label: "Visitor Management",
    icon: Building2,
    expandable: true,
    items: [],
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: ShoppingCart,
    expandable: true,
    path: "/administration/inventory",
    items: [{ title: "Inventory", path: "/administration/inventory", icon: ShoppingCart, pageKey: "inventory" }],
  },
  {
    id: "product",
    label: "Product",
    icon: Package,
    expandable: true,
    items: [],
  },
  {
    id: "hostel",
    label: "Hostel",
    icon: Building2,
    expandable: true,
    items: [],
  },
  {
    id: "transport",
    label: "Transport",
    icon: Package,
    expandable: true,
    path: "/administration/transport",
    items: [{ title: "Transport", path: "/administration/transport", icon: BusFront, pageKey: "transport" }],
  },
  {
    id: "login",
    label: "Login",
    icon: LogIn,
    expandable: true,
    items: [],
  },
  {
    id: "notification",
    label: "Notification",
    icon: MessageSquareText,
    expandable: true,
    path: "/administration/communication",
    items: [
      {
        title: "Communication",
        path: "/administration/communication",
        icon: MessageSquareText,
        pageKey: "communication",
      },
    ],
  },
  {
    id: "internal-mngment",
    label: "Internal Mngment",
    icon: UsersRound,
    expandable: true,
    path: "/administration/documents",
    items: [
      {
        title: "Documents",
        path: "/administration/documents",
        icon: FileText,
        pageKey: "documents",
      },
    ],
  },
  {
    id: "enquiry-management",
    label: "Enquiry Management",
    icon: UsersRound,
    expandable: true,
    path: "/admissions/enquiries",
    items: [
      {
        title: "Admission Enquiries",
        path: "/admissions/enquiries",
        icon: MessageSquareText,
        pageKey: "admission-enquiries",
      },
    ],
  },
  {
    id: "customer-management",
    label: "Customer Management",
    icon: UsersRound,
    expandable: true,
    items: [],
  },
  {
    id: "scheduler",
    label: "Scheduler",
    icon: UsersRound,
    expandable: true,
    items: [],
  },
  {
    id: "internal-mngment-secondary",
    label: "Internal Mngment",
    icon: UsersRound,
    expandable: true,
    items: [],
  },
  {
    id: "events",
    label: "Events",
    icon: CalendarDays,
    expandable: true,
    path: "/administration/events",
    items: [{ title: "Events", path: "/administration/events", icon: CalendarDays, pageKey: "events" }],
  },
  {
    id: "sms",
    label: "SMS",
    icon: MessageSquareText,
    expandable: true,
    group: "extra",
    items: [],
  },
  {
    id: "notification-extra",
    label: "Notification",
    icon: MessageSquareText,
    expandable: true,
    group: "extra",
    path: "/administration/communication",
    items: [
      {
        title: "Communication",
        path: "/administration/communication",
        icon: MessageSquareText,
        pageKey: "communication",
      },
    ],
  },
  {
    id: "login-extra",
    label: "Login",
    icon: LogIn,
    expandable: true,
    group: "extra",
    items: [],
  },
];

export const flatNavigation = navigationSections.flatMap((section) =>
  section.items.map((item) => ({ ...item, section: section.label })),
);

export function getNavigationItem(pathname: string) {
  const fromItems = flatNavigation.find((item) => item.path === pathname);
  if (fromItems) return fromItems;

  const sectionMatch = navigationSections.find((section) => section.path === pathname);
  if (sectionMatch?.path && sectionMatch.pageKey) {
    return {
      title: sectionMatch.label,
      path: sectionMatch.path,
      icon: sectionMatch.icon,
      pageKey: sectionMatch.pageKey,
      section: sectionMatch.label,
    };
  }

  return flatNavigation[0];
}

export function isSectionActive(section: NavSection, pathname: string) {
  if (section.path === pathname) return true;
  return section.items.some((item) => item.path === pathname);
}

export type MetricTone = "primary" | "success" | "warning" | "danger" | "info" | "neutral";

export type SummaryMetric = {
  label: string;
  value: string;
  helper: string;
  tone: MetricTone;
};

export type DataRow = Record<string, string>;

export type PageConfig = {
  key: string;
  title: string;
  description: string;
  group: string;
  primaryAction: string;
  secondaryActions: string[];
  searchPlaceholder: string;
  filters: string[];
  tabs: string[];
  stats: SummaryMetric[];
  columns: { key: string; label: string }[];
  rows: DataRow[];
  emptyState: {
    title: string;
    description: string;
  };
};

const standardTabs = ["Overview", "Active", "Pending", "Archived"];

export const pageConfigs: Record<string, PageConfig> = {
  students: {
    key: "students",
    title: "Students",
    description: "Manage enrollment records, attendance indicators, and student status across the school.",
    group: "Academic",
    primaryAction: "Add Student",
    secondaryActions: ["Import CSV", "Export List"],
    searchPlaceholder: "Search students, IDs, classes...",
    filters: ["All classes", "Class 8", "Class 9", "Class 10", "Class 11"],
    tabs: standardTabs,
    stats: [
      { label: "Total Students", value: "2,450", helper: "+48 this term", tone: "primary" },
      { label: "Present Today", value: "2,327", helper: "94.9% attendance", tone: "success" },
      { label: "New Admissions", value: "128", helper: "32 in review", tone: "info" },
      { label: "At Risk", value: "12", helper: "Needs follow-up", tone: "warning" },
    ],
    columns: [
      { key: "name", label: "Student name" },
      { key: "id", label: "Student ID" },
      { key: "class", label: "Class" },
      { key: "section", label: "Section" },
      { key: "gender", label: "Gender" },
      { key: "attendance", label: "Attendance" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { name: "Aarav Mehta", id: "EDU-24018", class: "Class 10", section: "A", gender: "Male", attendance: "96%", status: "Active" },
      { name: "Maya Iyer", id: "EDU-24042", class: "Class 9", section: "C", gender: "Female", attendance: "92%", status: "Active" },
      { name: "Rehan Thomas", id: "EDU-23114", class: "Class 11", section: "B", gender: "Male", attendance: "81%", status: "Watchlist" },
      { name: "Sara D'Souza", id: "EDU-22891", class: "Class 8", section: "A", gender: "Female", attendance: "98%", status: "Active" },
    ],
    emptyState: { title: "No students found", description: "Try a different class, section, or student keyword." },
  },
  teachers: {
    key: "teachers",
    title: "Teachers",
    description: "Review faculty profiles, departments, teaching load, and assigned classes.",
    group: "Academic",
    primaryAction: "Add Teacher",
    secondaryActions: ["Assign Classes", "Export Directory"],
    searchPlaceholder: "Search teachers, subjects, departments...",
    filters: ["All departments", "Science", "Mathematics", "Humanities", "Languages"],
    tabs: standardTabs,
    stats: [
      { label: "Total Teachers", value: "68", helper: "63 present today", tone: "primary" },
      { label: "Departments", value: "9", helper: "Core academic units", tone: "info" },
      { label: "Substitutions", value: "6", helper: "For today", tone: "warning" },
      { label: "Open Positions", value: "3", helper: "Hiring pipeline", tone: "neutral" },
    ],
    columns: [
      { key: "name", label: "Teacher" },
      { key: "department", label: "Department" },
      { key: "subjects", label: "Subjects" },
      { key: "classes", label: "Assigned classes" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { name: "Ananya Rao", department: "Science", subjects: "Physics, Lab", classes: "9A, 10B, 11A", status: "Active" },
      { name: "Daniel Fernandes", department: "Mathematics", subjects: "Algebra, Calculus", classes: "10A, 11B", status: "Active" },
      { name: "Meera Kapoor", department: "Humanities", subjects: "History", classes: "8C, 9C", status: "On Leave" },
      { name: "Rohan Sen", department: "Languages", subjects: "English", classes: "7A, 8B, 9A", status: "Active" },
    ],
    emptyState: { title: "No teachers found", description: "Adjust the department or search query to view faculty records." },
  },
  classes: {
    key: "classes",
    title: "Classes",
    description: "Track classes, sections, class teachers, capacity, and daily attendance health.",
    group: "Academic",
    primaryAction: "Create Class",
    secondaryActions: ["Assign Teacher", "Merge Sections"],
    searchPlaceholder: "Search classes or class teachers...",
    filters: ["All grades", "Primary", "Middle School", "High School", "Senior Secondary"],
    tabs: ["Class List", "Capacity", "Attendance", "Promotion"],
    stats: [
      { label: "Total Classes", value: "68", helper: "96 active sections", tone: "primary" },
      { label: "Average Size", value: "36", helper: "Students per section", tone: "info" },
      { label: "Full Sections", value: "14", helper: "Capacity above 95%", tone: "warning" },
      { label: "Attendance Avg.", value: "93%", helper: "Across classes", tone: "success" },
    ],
    columns: [
      { key: "class", label: "Class" },
      { key: "sections", label: "Sections" },
      { key: "teacher", label: "Class teacher" },
      { key: "students", label: "Students" },
      { key: "attendance", label: "Attendance" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { class: "Class 10", sections: "A, B, C", teacher: "Daniel Fernandes", students: "118", attendance: "95%", status: "Active" },
      { class: "Class 9", sections: "A, B, C, D", teacher: "Ananya Rao", students: "142", attendance: "92%", status: "Active" },
      { class: "Class 7", sections: "A, B", teacher: "Rohan Sen", students: "74", attendance: "90%", status: "Active" },
    ],
    emptyState: { title: "No classes match", description: "Try another grade band or class teacher keyword." },
  },
  sections: makeAcademicPage("sections", "Sections", "Section", "Manage section capacity, mentors, classrooms, and student distribution.", "Create Section", ["section", "class", "mentor", "room", "students", "status"], [
    { section: "10-A", class: "Class 10", mentor: "Daniel Fernandes", room: "B-204", students: "39", status: "Active" },
    { section: "9-C", class: "Class 9", mentor: "Maya Nair", room: "A-118", students: "36", status: "Active" },
    { section: "11-B", class: "Class 11", mentor: "Ananya Rao", room: "C-302", students: "33", status: "Review" },
  ]),
  subjects: makeAcademicPage("subjects", "Subjects", "Subject", "Organize subject catalog, credits, assigned teachers, and class mapping.", "Add Subject", ["subject", "code", "classes", "department", "teacher", "status"], [
    { subject: "Physics", code: "SCI-PHY-10", classes: "9-12", department: "Science", teacher: "Ananya Rao", status: "Active" },
    { subject: "Mathematics", code: "MAT-ADV-11", classes: "10-12", department: "Mathematics", teacher: "Daniel Fernandes", status: "Active" },
    { subject: "English Literature", code: "ENG-LIT-09", classes: "8-10", department: "Languages", teacher: "Rohan Sen", status: "Active" },
  ]),
  timetable: makeAcademicPage("timetable", "Timetable", "Schedule", "Review weekly periods, rooms, teachers, and timetable conflicts.", "Create Timetable", ["slot", "class", "subject", "teacher", "room", "status"], [
    { slot: "Mon 09:00", class: "10-A", subject: "Physics", teacher: "Ananya Rao", room: "Lab 2", status: "Scheduled" },
    { slot: "Tue 11:15", class: "9-C", subject: "History", teacher: "Meera Kapoor", room: "A-118", status: "Substitute" },
    { slot: "Wed 13:30", class: "11-B", subject: "Calculus", teacher: "Daniel Fernandes", room: "C-302", status: "Scheduled" },
  ]),
  attendance: {
    key: "attendance",
    title: "Attendance",
    description: "Monitor daily attendance by class, section, and student status.",
    group: "Academic",
    primaryAction: "Mark Attendance",
    secondaryActions: ["Date Selector", "Export Register"],
    searchPlaceholder: "Search class, student, or roll number...",
    filters: ["Today", "Class 10-A", "Class 9-C", "Absent", "Late"],
    tabs: ["Daily Register", "Class Summary", "Absentees", "Late Arrivals"],
    stats: [
      { label: "Today's Attendance", value: "94.9%", helper: "2,327 present", tone: "success" },
      { label: "Absent", value: "84", helper: "Across campus", tone: "danger" },
      { label: "Late Arrivals", value: "39", helper: "Mostly transport delay", tone: "warning" },
      { label: "Unmarked Sections", value: "3", helper: "Needs teacher input", tone: "info" },
    ],
    columns: [
      { key: "student", label: "Student" },
      { key: "class", label: "Class" },
      { key: "roll", label: "Roll no." },
      { key: "status", label: "Status" },
      { key: "markedBy", label: "Marked by" },
      { key: "time", label: "Time" },
    ],
    rows: [
      { student: "Aarav Mehta", class: "10-A", roll: "18", status: "Present", markedBy: "Daniel Fernandes", time: "08:42 AM" },
      { student: "Rehan Thomas", class: "11-B", roll: "07", status: "Late", markedBy: "Ananya Rao", time: "09:16 AM" },
      { student: "Nisha Paul", class: "9-C", roll: "23", status: "Absent", markedBy: "Meera Kapoor", time: "08:49 AM" },
    ],
    emptyState: { title: "No attendance records found", description: "Change the date, class, or attendance status filter." },
  },
  examinations: makeAcademicPage("examinations", "Examinations", "Exam", "Plan upcoming exams, subject schedules, invigilation, and publishing status.", "Schedule Exam", ["exam", "class", "subject", "date", "duration", "status"], [
    { exam: "Mid-Term Assessment", class: "10-A", subject: "Mathematics", date: "24 Sep 2026", duration: "2h 30m", status: "Scheduled" },
    { exam: "Practical Evaluation", class: "11-B", subject: "Physics", date: "28 Sep 2026", duration: "3h", status: "Draft" },
    { exam: "Unit Test 2", class: "8-C", subject: "English", date: "30 Sep 2026", duration: "1h", status: "Published" },
  ]),
  results: makeAcademicPage("results", "Results", "Result", "Analyze exam results, grades, percentages, and performance trends.", "Publish Results", ["student", "exam", "class", "grade", "percentage", "status"], [
    { student: "Aarav Mehta", exam: "Mid-Term", class: "10-A", grade: "A", percentage: "91%", status: "Published" },
    { student: "Maya Iyer", exam: "Unit Test 2", class: "9-C", grade: "B+", percentage: "84%", status: "Published" },
    { student: "Rehan Thomas", exam: "Practical", class: "11-B", grade: "A-", percentage: "88%", status: "Review" },
  ]),
  "report-cards": makeAcademicPage("report-cards", "Report Cards", "Report card", "Prepare term report cards, teacher comments, grades, and parent-ready PDFs.", "Generate Report Cards", ["class", "term", "generated", "pending", "reviewer", "status"], [
    { class: "10-A", term: "Term 1", generated: "38", pending: "1", reviewer: "Daniel Fernandes", status: "Ready" },
    { class: "9-C", term: "Term 1", generated: "34", pending: "2", reviewer: "Meera Kapoor", status: "In Review" },
    { class: "11-B", term: "Term 1", generated: "29", pending: "4", reviewer: "Ananya Rao", status: "Draft" },
  ]),
  "feedback-report": makeAcademicPage(
    "feedback-report",
    "Student FeedBack Report",
    "Feedback",
    "Review student feedback submissions, ratings, and counselor follow-ups.",
    "Export Feedback",
    ["student", "class", "topic", "rating", "submitted", "status"],
    [
      { student: "Aarav Mehta", class: "10-A", topic: "Classroom Experience", rating: "4.5", submitted: "20 Sep", status: "Reviewed" },
      { student: "Maya Iyer", class: "9-C", topic: "Transport", rating: "3.8", submitted: "19 Sep", status: "Open" },
      { student: "Rehan Thomas", class: "11-B", topic: "Lab Facilities", rating: "4.2", submitted: "18 Sep", status: "Follow-up" },
    ],
  ),
  "student-tc": makeAcademicPage(
    "student-tc",
    "Student TC",
    "TC",
    "Track transfer certificate requests, approvals, and issued documents.",
    "Issue TC",
    ["student", "class", "requestDate", "reason", "issuedOn", "status"],
    [
      { student: "Kabir Patel", class: "9-B", requestDate: "12 Sep", reason: "Relocation", issuedOn: "18 Sep", status: "Issued" },
      { student: "Sara Khan", class: "12-B", requestDate: "15 Sep", reason: "Parent Transfer", issuedOn: "—", status: "Pending" },
      { student: "Arjun Reddy", class: "UKG", requestDate: "10 Sep", reason: "School Change", issuedOn: "16 Sep", status: "Issued" },
    ],
  ),
  "withheld-list": makeAcademicPage(
    "withheld-list",
    "With Held List",
    "Record",
    "Monitor withheld students for fees, documents, or disciplinary reasons.",
    "Add Withheld",
    ["student", "class", "reason", "since", "owner", "status"],
    [
      { student: "Nisha Paul", class: "9-C", reason: "Fee Pending", since: "01 Sep", owner: "Accounts", status: "Active" },
      { student: "Rehan Thomas", class: "11-B", reason: "Documents", since: "08 Sep", owner: "Admin Desk", status: "Review" },
      { student: "Zara Khan", class: "8-A", reason: "Library Dues", since: "14 Sep", owner: "Library", status: "Active" },
    ],
  ),
  "class-allocation-report": makeAcademicPage(
    "class-allocation-report",
    "Class Allocation Report",
    "Allocation",
    "View class and section allocation across students and academic year.",
    "Export Allocation",
    ["class", "section", "capacity", "allocated", "vacancy", "status"],
    [
      { class: "NURSERY", section: "A", capacity: "30", allocated: "28", vacancy: "2", status: "On Track" },
      { class: "LKG", section: "A", capacity: "35", allocated: "35", vacancy: "0", status: "Full" },
      { class: "Class 10", section: "A", capacity: "40", allocated: "38", vacancy: "2", status: "On Track" },
    ],
  ),
  "sms-report": makeAcademicPage(
    "sms-report",
    "SMS Report",
    "SMS",
    "Track SMS broadcasts sent to parents, delivery counts, and failures.",
    "Export SMS Report",
    ["campaign", "audience", "sent", "delivered", "failed", "status"],
    [
      { campaign: "Fee Reminder", audience: "Parents", sent: "420", delivered: "401", failed: "19", status: "Completed" },
      { campaign: "PTM Notice", audience: "Class 10", sent: "86", delivered: "86", failed: "0", status: "Completed" },
      { campaign: "Holiday Alert", audience: "All", sent: "1200", delivered: "1184", failed: "16", status: "Completed" },
    ],
  ),
  "marks-card": makeAcademicPage(
    "marks-card",
    "Student MarksCard",
    "Marks card",
    "Generate and distribute student markscards for term assessments.",
    "Generate MarksCard",
    ["student", "class", "term", "percentage", "grade", "status"],
    [
      { student: "Aarav Mehta", class: "10-A", term: "Term 1", percentage: "91%", grade: "A", status: "Ready" },
      { student: "Maya Iyer", class: "9-C", term: "Term 1", percentage: "84%", grade: "B+", status: "Ready" },
      { student: "Rehan Thomas", class: "11-B", term: "Term 1", percentage: "88%", grade: "A-", status: "Draft" },
    ],
  ),
  "marks-report": makeAcademicPage(
    "marks-report",
    "Marks Report",
    "Marks",
    "Analyze subject-wise marks, averages, and class performance.",
    "Export Marks Report",
    ["class", "subject", "average", "highest", "lowest", "status"],
    [
      { class: "10-A", subject: "Mathematics", average: "78%", highest: "98%", lowest: "42%", status: "Published" },
      { class: "9-C", subject: "English", average: "81%", highest: "95%", lowest: "55%", status: "Published" },
      { class: "11-B", subject: "Physics", average: "74%", highest: "92%", lowest: "48%", status: "Review" },
    ],
  ),
  "summatative-report": makeAcademicPage(
    "summatative-report",
    "Summatative Report",
    "Report",
    "Consolidate summative assessment outcomes across terms and classes.",
    "Export Summatative Report",
    ["class", "term", "passPercent", "average", "topper", "status"],
    [
      { class: "10-A", term: "Term 1", passPercent: "96%", average: "79%", topper: "Aarav Mehta", status: "Published" },
      { class: "9-C", term: "Term 1", passPercent: "94%", average: "76%", topper: "Maya Iyer", status: "Published" },
      { class: "11-B", term: "Term 1", passPercent: "91%", average: "73%", topper: "Rehan Thomas", status: "Draft" },
    ],
  ),
  applications: makeAdmissionsPage("applications", "Applications", "Application", "Track candidate applications, interview status, documents, and counselor ownership.", "Add Application", ["candidate", "grade", "parent", "submitted", "counselor", "status"], [
    { candidate: "Ishaan Verma", grade: "Class 6", parent: "Neha Verma", submitted: "16 Sep", counselor: "Priya Menon", status: "Interview" },
    { candidate: "Zara Khan", grade: "Class 9", parent: "Aamir Khan", submitted: "15 Sep", counselor: "Rahul Bose", status: "Documents" },
    { candidate: "Kabir Shah", grade: "Class 3", parent: "Mina Shah", submitted: "14 Sep", counselor: "Priya Menon", status: "Approved" },
  ]),
  "admission-enquiries": makeAdmissionsPage("admission-enquiries", "Admission Enquiries", "Enquiry", "Manage prospect enquiries, source tracking, callbacks, and campus visit bookings.", "Log Enquiry", ["parent", "student", "grade", "source", "nextStep", "status"], [
    { parent: "Ritika Jain", student: "Aanya Jain", grade: "Class 1", source: "Website", nextStep: "Campus tour", status: "Open" },
    { parent: "Mathew George", student: "Evan George", grade: "Class 8", source: "Referral", nextStep: "Counselor call", status: "Warm" },
    { parent: "Farah Ali", student: "Samir Ali", grade: "Class 5", source: "Walk-in", nextStep: "Fee discussion", status: "Follow-up" },
  ]),
  "admission-process": makeAdmissionsPage("admission-process", "Admission Process", "Stage", "Visualize admissions funnel stages, ownership, SLA health, and conversion progress.", "Create Stage", ["stage", "owner", "candidates", "sla", "conversion", "status"], [
    { stage: "Application Review", owner: "Priya Menon", candidates: "54", sla: "1.2 days", conversion: "72%", status: "On Track" },
    { stage: "Assessment", owner: "Rahul Bose", candidates: "31", sla: "2.1 days", conversion: "61%", status: "Watchlist" },
    { stage: "Fee Confirmation", owner: "Finance Desk", candidates: "18", sla: "0.8 days", conversion: "89%", status: "On Track" },
  ]),
  "admission-report": makeAdmissionsPage(
    "admission-report",
    "Admission Report",
    "Report",
    "Track admission conversions, class-wise intake, and counselor performance across the current cycle.",
    "Export Report",
    ["class", "applied", "admitted", "conversion", "counselor", "status"],
    [
      { class: "Class 1", applied: "86", admitted: "62", conversion: "72%", counselor: "Priya Menon", status: "On Track" },
      { class: "Class 5", applied: "54", admitted: "41", conversion: "76%", counselor: "Rahul Bose", status: "On Track" },
      { class: "Class 8", applied: "39", admitted: "24", conversion: "62%", counselor: "Neha Kapoor", status: "Watchlist" },
      { class: "Class 11", applied: "47", admitted: "29", conversion: "62%", counselor: "Finance Desk", status: "Review" },
    ],
  ),
  fees: {
    key: "fees",
    title: "Fees",
    description: "Review collections, pending invoices, overdue dues, and recent fee transactions.",
    group: "Finance",
    primaryAction: "Create Invoice",
    secondaryActions: ["Send Reminders", "Export Ledger"],
    searchPlaceholder: "Search invoice, student, parent...",
    filters: ["All invoices", "Paid", "Pending", "Overdue", "Concession"],
    tabs: ["Collections", "Pending", "Overdue", "Adjustments"],
    stats: [
      { label: "Total Collected", value: "₹82.6L", helper: "This term", tone: "success" },
      { label: "Pending", value: "₹18.4L", helper: "412 invoices", tone: "warning" },
      { label: "Overdue", value: "₹6.8L", helper: "124 families", tone: "danger" },
      { label: "Collection Rate", value: "81%", helper: "+6% vs last term", tone: "primary" },
    ],
    columns: [
      { key: "invoice", label: "Invoice" },
      { key: "student", label: "Student" },
      { key: "class", label: "Class" },
      { key: "amount", label: "Amount" },
      { key: "dueDate", label: "Due date" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { invoice: "FEE-2026-1184", student: "Aarav Mehta", class: "10-A", amount: "₹42,500", dueDate: "20 Sep", status: "Paid" },
      { invoice: "FEE-2026-1196", student: "Maya Iyer", class: "9-C", amount: "₹38,000", dueDate: "22 Sep", status: "Pending" },
      { invoice: "FEE-2026-1208", student: "Rehan Thomas", class: "11-B", amount: "₹51,200", dueDate: "12 Sep", status: "Overdue" },
    ],
    emptyState: { title: "No fee records found", description: "Try another payment status or billing period." },
  },
  "fee-structure": makeFinancePage("fee-structure", "Fee Structure", "Plan", "Configure grade-wise fee plans, terms, discounts, and transport add-ons.", "Add Fee Plan", ["plan", "grade", "tuition", "transport", "billing", "status"], [
    { plan: "Senior Secondary Annual", grade: "11-12", tuition: "₹1,84,000", transport: "Optional", billing: "Term-wise", status: "Active" },
    { plan: "Middle School Core", grade: "6-8", tuition: "₹1,26,000", transport: "Zone based", billing: "Quarterly", status: "Active" },
    { plan: "Primary Foundation", grade: "1-5", tuition: "₹98,000", transport: "Zone based", billing: "Quarterly", status: "Draft" },
  ]),
  payments: makeFinancePage("payments", "Payments", "Payment", "Monitor receipts, online payment status, reconciliation, and failed attempts.", "Record Payment", ["receipt", "student", "method", "amount", "receivedOn", "status"], [
    { receipt: "RCPT-8842", student: "Sara D'Souza", method: "UPI", amount: "₹38,000", receivedOn: "17 Sep", status: "Settled" },
    { receipt: "RCPT-8841", student: "Aarav Mehta", method: "Card", amount: "₹42,500", receivedOn: "16 Sep", status: "Settled" },
    { receipt: "RCPT-8834", student: "Nisha Paul", method: "Bank Transfer", amount: "₹19,000", receivedOn: "15 Sep", status: "Reconcile" },
  ]),
  expenses: makeFinancePage("expenses", "Expenses", "Expense", "Track campus operating expenses, vendors, approvals, and monthly budget variance.", "Add Expense", ["vendor", "category", "amount", "requestedBy", "date", "status"], [
    { vendor: "Scholastic Supplies", category: "Stationery", amount: "₹84,200", requestedBy: "Admin Office", date: "17 Sep", status: "Approved" },
    { vendor: "GreenRoute Transport", category: "Fuel", amount: "₹1,18,000", requestedBy: "Transport", date: "16 Sep", status: "Pending" },
    { vendor: "LabWorks India", category: "Science Lab", amount: "₹62,700", requestedBy: "Science Dept.", date: "12 Sep", status: "Review" },
  ]),
  "financial-reports": makeFinancePage("financial-reports", "Financial Reports", "Report", "Review collection trends, aging reports, concessions, and departmental expenses.", "Generate Report", ["report", "period", "owner", "records", "lastRun", "status"], [
    { report: "Fee Aging", period: "Sep 2026", owner: "Finance Desk", records: "412", lastRun: "Today", status: "Ready" },
    { report: "Expense Variance", period: "Q2", owner: "Operations", records: "128", lastRun: "Yesterday", status: "Ready" },
    { report: "Concession Summary", period: "Term 1", owner: "Accounts", records: "76", lastRun: "15 Sep", status: "Draft" },
  ]),
  "fee-type-master": makeFmsPage("fee-type-master", "Fee Type Master", "Fee type", "Maintain fee type codes used across fee master and receipts.", "Add Fee Type", ["code", "name", "category", "billing", "status"], [
    { code: "TUITION", name: "Tuition Fee", category: "Academic", billing: "Term", status: "Active" },
    { code: "TRANSPORT", name: "Transport Fee", category: "Transport", billing: "Monthly", status: "Active" },
    { code: "MATERIAL", name: "Material Fee", category: "Academic", billing: "Annual", status: "Active" },
  ]),
  "fms-bank": makeFmsPage("fms-bank", "Bank", "Bank", "Manage school bank accounts used for fee collection and cheque clearance.", "Add Bank", ["bank", "accountNo", "branch", "ifsc", "status"], [
    { bank: "State Bank of India", accountNo: "****4521", branch: "Dharwad", ifsc: "SBIN0001234", status: "Active" },
    { bank: "HDFC Bank", accountNo: "****8832", branch: "Hubli", ifsc: "HDFC0009876", status: "Active" },
    { bank: "Canara Bank", accountNo: "****2209", branch: "Dharwad", ifsc: "CNRB0004567", status: "Inactive" },
  ]),
  "fee-description": makeFmsPage("fee-description", "Fee Description", "Description", "Define fee description labels linked to fee types and masters.", "Add Description", ["description", "feeType", "amount", "year", "status"], [
    { description: "Term 1 Tuition", feeType: "Tuition Fee", amount: "₹18,000", year: "2026", status: "Active" },
    { description: "Bus Route North", feeType: "Transport Fee", amount: "₹2,400", year: "2026", status: "Active" },
    { description: "Lab Kit", feeType: "Material Fee", amount: "₹3,500", year: "2026", status: "Draft" },
  ]),
  "pickup-point": makeFmsPage("pickup-point", "PickUp Point", "Pickup", "Maintain transport pickup points mapped to routes and fees.", "Add Pickup Point", ["point", "route", "distance", "fee", "status"], [
    { point: "City Center", route: "Route 1", distance: "4.2 km", fee: "₹2,400", status: "Active" },
    { point: "North Campus Gate", route: "Route 2", distance: "1.1 km", fee: "₹1,200", status: "Active" },
    { point: "Railway Station", route: "Route 3", distance: "6.8 km", fee: "₹3,000", status: "Active" },
  ]),
  "fee-master": makeFmsPage("fee-master", "Fee Master", "Fee plan", "Configure class-wise fee masters for the academic year.", "Add Fee Master", ["class", "feeType", "amount", "year", "status"], [
    { class: "Class 10", feeType: "Tuition Fee", amount: "₹42,500", year: "2026", status: "Active" },
    { class: "NURSERY", feeType: "Tuition Fee", amount: "₹28,000", year: "2026", status: "Active" },
    { class: "Class 11", feeType: "Material Fee", amount: "₹5,500", year: "2026", status: "Draft" },
  ]),
  "fee-receipt": makeFmsPage("fee-receipt", "Fee Receipt", "Receipt", "Collect and issue fee receipts against student dues.", "Create Receipt", ["receipt", "student", "amount", "mode", "status"], [
    { receipt: "RCPT-9101", student: "Aarav Mehta", amount: "₹12,500", mode: "UPI", status: "Paid" },
    { receipt: "RCPT-9102", student: "Maya Iyer", amount: "₹8,000", mode: "Cash", status: "Paid" },
    { receipt: "RCPT-9103", student: "Rehan Thomas", amount: "₹15,200", mode: "Cheque", status: "Pending" },
  ]),
  "fee-print-list": makeFmsPage("fee-print-list", "Fee Print List", "Receipt", "Search and reprint issued fee receipts.", "Print Selected", ["receipt", "student", "class", "amount", "date", "status"], [
    { receipt: "RCPT-9101", student: "Aarav Mehta", class: "10-A", amount: "₹12,500", date: "20 Sep", status: "Printed" },
    { receipt: "RCPT-9102", student: "Maya Iyer", class: "9-C", amount: "₹8,000", date: "21 Sep", status: "Ready" },
    { receipt: "RCPT-9098", student: "Sara D'Souza", class: "8-A", amount: "₹9,400", date: "18 Sep", status: "Printed" },
  ]),
  "cancelled-fee-list": makeFmsPage("cancelled-fee-list", "Cancelled Fee List", "Cancellation", "Review cancelled fee receipts and reversal reasons.", "Export List", ["receipt", "student", "amount", "cancelledOn", "reason", "status"], [
    { receipt: "RCPT-8811", student: "Nisha Paul", amount: "₹6,200", cancelledOn: "12 Sep", reason: "Duplicate", status: "Cancelled" },
    { receipt: "RCPT-8790", student: "Kabir Shah", amount: "₹4,800", cancelledOn: "08 Sep", reason: "Wrong amount", status: "Cancelled" },
    { receipt: "RCPT-8755", student: "Zara Khan", amount: "₹3,100", cancelledOn: "02 Sep", reason: "Cheque bounce", status: "Cancelled" },
  ]),
  "update-student-fee": makeFmsPage("update-student-fee", "Update Student Fee", "Update", "Adjust student-wise fee allocations for the selected year.", "Update Fee", ["student", "class", "feeType", "amount", "status"], [
    { student: "Aarav Mehta", class: "10-A", feeType: "Tuition Fee", amount: "₹42,500", status: "Updated" },
    { student: "Maya Iyer", class: "9-C", feeType: "Transport Fee", amount: "₹2,400", status: "Pending" },
    { student: "Rehan Thomas", class: "11-B", feeType: "Tuition Fee", amount: "₹51,200", status: "Updated" },
  ]),
  "update-material-fee": makeFmsPage("update-material-fee", "Update Material Fee", "Material fee", "Manage material and kit fee updates by class or student.", "Update Material Fee", ["student", "class", "material", "amount", "status"], [
    { student: "Sara D'Souza", class: "8-A", material: "Lab Kit", amount: "₹3,500", status: "Updated" },
    { student: "Aanya Jain", class: "1-A", material: "Books Pack", amount: "₹4,200", status: "Pending" },
    { student: "Evan George", class: "8-B", material: "Uniform Kit", amount: "₹2,800", status: "Updated" },
  ]),
  "student-concession": makeFmsPage("student-concession", "Student Concession", "Concession", "Apply and track student fee concessions and scholarships.", "Add Concession", ["student", "class", "concession", "amount", "status"], [
    { student: "Nisha Paul", class: "9-C", concession: "Sibling", amount: "₹5,000", status: "Approved" },
    { student: "Kabir Shah", class: "3-A", concession: "Staff Child", amount: "₹12,000", status: "Approved" },
    { student: "Zara Khan", class: "9-A", concession: "Merit", amount: "₹8,000", status: "Review" },
  ]),
  "change-student-fee": makeFmsPage("change-student-fee", "Change Student Fee", "Change", "Change assigned fee plans for individual students.", "Change Fee", ["student", "fromPlan", "toPlan", "effective", "status"], [
    { student: "Aarav Mehta", fromPlan: "Standard", toPlan: "With Transport", effective: "01 Oct", status: "Applied" },
    { student: "Maya Iyer", fromPlan: "With Transport", toPlan: "Standard", effective: "01 Oct", status: "Pending" },
    { student: "Rehan Thomas", fromPlan: "Standard", toPlan: "Hostel", effective: "15 Oct", status: "Review" },
  ]),
  "rte-report": makeFmsPage("rte-report", "RTE Report", "RTE", "Generate RTE student fee and reimbursement reports.", "Export RTE Report", ["student", "class", "quota", "amount", "status"], [
    { student: "Ishaan Verma", class: "6-A", quota: "RTE", amount: "₹0", status: "Exempt" },
    { student: "Aanya Jain", class: "1-A", quota: "RTE", amount: "₹0", status: "Exempt" },
    { student: "Samir Ali", class: "5-B", quota: "RTE", amount: "₹0", status: "Pending Docs" },
  ]),
  "fee-concession-report": makeFmsPage("fee-concession-report", "Fee Concession Report", "Report", "Summarize concessions granted across classes and fee types.", "Export Report", ["class", "concession", "students", "amount", "status"], [
    { class: "Class 10", concession: "Merit", students: "12", amount: "₹96,000", status: "Ready" },
    { class: "Class 9", concession: "Sibling", students: "18", amount: "₹90,000", status: "Ready" },
    { class: "Class 3", concession: "Staff Child", students: "6", amount: "₹72,000", status: "Draft" },
  ]),
  "fee-pending-report": makeFmsPage("fee-pending-report", "Fee Pending Report", "Report", "List students with overall pending fee balances.", "Export Report", ["student", "class", "pending", "dueDate", "status"], [
    { student: "Maya Iyer", class: "9-C", pending: "₹18,000", dueDate: "30 Sep", status: "Pending" },
    { student: "Rehan Thomas", class: "11-B", pending: "₹25,400", dueDate: "28 Sep", status: "Overdue" },
    { student: "Nisha Paul", class: "9-C", pending: "₹7,200", dueDate: "05 Oct", status: "Pending" },
  ]),
  "fee-description-pending-report": makeFmsPage("fee-description-pending-report", "Fee Description Pending Report", "Report", "Track pending amounts by fee description.", "Export Report", ["description", "class", "pending", "students", "status"], [
    { description: "Term 1 Tuition", class: "10-A", pending: "₹1,24,000", students: "8", status: "Open" },
    { description: "Bus Route North", class: "All", pending: "₹36,000", students: "15", status: "Open" },
    { description: "Lab Kit", class: "11-B", pending: "₹14,000", students: "4", status: "Review" },
  ]),
  "fee-due-list-pending-report": makeFmsPage("fee-due-list-pending-report", "Fee Due list Pending Report", "Report", "Generate due-list pending fee reports by class and section.", "Export Report", ["student", "admissionNo", "class", "due", "status"], [
    { student: "Maya Iyer", admissionNo: "466", class: "9-C", due: "₹18,000", status: "Due" },
    { student: "Rehan Thomas", admissionNo: "412", class: "11-B", due: "₹25,400", status: "Due" },
    { student: "Nisha Paul", admissionNo: "501", class: "9-C", due: "₹7,200", status: "Due" },
  ]),
  "transport-fee-due-list-pending-report": makeFmsPage(
    "transport-fee-due-list-pending-report",
    "Transport Fee due List Pending Report",
    "Report",
    "Track pending transport fee dues by route and pickup point.",
    "Export Report",
    ["student", "route", "pickup", "due", "status"],
    [
      { student: "Aarav Mehta", route: "Route 1", pickup: "City Center", due: "₹2,400", status: "Due" },
      { student: "Sara D'Souza", route: "Route 2", pickup: "North Campus Gate", due: "₹1,200", status: "Due" },
      { student: "Evan George", route: "Route 3", pickup: "Railway Station", due: "₹3,000", status: "Overdue" },
    ],
  ),
  "day-book-report": makeFmsPage("day-book-report", "Day Book Report", "Report", "View daily fee collection day-book entries.", "Export Day Book", ["date", "receipts", "cash", "bank", "total"], [
    { date: "24 Sep 2026", receipts: "42", cash: "₹38,400", bank: "₹1,12,600", total: "₹1,51,000" },
    { date: "23 Sep 2026", receipts: "36", cash: "₹22,100", bank: "₹98,500", total: "₹1,20,600" },
    { date: "22 Sep 2026", receipts: "51", cash: "₹44,800", bank: "₹1,36,200", total: "₹1,81,000" },
  ]),
  "cheque-clearence": makeFmsPage("cheque-clearence", "Cheque Clearence", "Cheque", "Track cheque deposits and clearance status for fee payments.", "Update Clearance", ["chequeNo", "student", "amount", "bank", "status"], [
    { chequeNo: "CHQ-2291", student: "Rehan Thomas", amount: "₹15,200", bank: "HDFC", status: "Pending" },
    { chequeNo: "CHQ-2284", student: "Kabir Shah", amount: "₹8,500", bank: "SBI", status: "Cleared" },
    { chequeNo: "CHQ-2270", student: "Zara Khan", amount: "₹6,000", bank: "Canara", status: "Bounced" },
  ]),
  "mop-report": makeFmsPage("mop-report", "MOP Report", "Report", "Summarize fee collections by mode of payment.", "Export MOP Report", ["mode", "receipts", "amount", "period", "status"], [
    { mode: "UPI", receipts: "186", amount: "₹6,42,000", period: "Sep 2026", status: "Ready" },
    { mode: "Cash", receipts: "94", amount: "₹2,18,400", period: "Sep 2026", status: "Ready" },
    { mode: "Cheque", receipts: "28", amount: "₹1,05,600", period: "Sep 2026", status: "Review" },
  ]),
  "daily-mop-report": makeFmsPage("daily-mop-report", "Daily MOP Report", "Report", "Daily breakdown of collections by mode of payment.", "Export Daily MOP", ["date", "cash", "upi", "card", "cheque", "total"], [
    { date: "24 Sep 2026", cash: "₹38,400", upi: "₹82,100", card: "₹18,500", cheque: "₹12,000", total: "₹1,51,000" },
    { date: "23 Sep 2026", cash: "₹22,100", upi: "₹71,000", card: "₹15,500", cheque: "₹12,000", total: "₹1,20,600" },
    { date: "22 Sep 2026", cash: "₹44,800", upi: "₹96,200", card: "₹22,000", cheque: "₹18,000", total: "₹1,81,000" },
  ]),
  courses: makeLearningPage("courses", "Courses", "Course", "Manage digital courses, instructors, enrollment, completion, and content progress.", "Create Course", ["course", "instructor", "students", "progress", "updated", "status"], [
    { course: "Physics Lab Foundations", instructor: "Ananya Rao", students: "186", progress: "78%", updated: "Today", status: "Active" },
    { course: "English Grammar Studio", instructor: "Rohan Sen", students: "212", progress: "64%", updated: "Yesterday", status: "Active" },
    { course: "Calculus Practice Track", instructor: "Daniel Fernandes", students: "148", progress: "82%", updated: "15 Sep", status: "Active" },
  ]),
  lessons: makeLearningPage("lessons", "Lessons", "Lesson", "Organize lesson plans, resource readiness, learning outcomes, and teacher ownership.", "Add Lesson", ["lesson", "course", "teacher", "duration", "resources", "status"], [
    { lesson: "Newton's Laws", course: "Physics Lab Foundations", teacher: "Ananya Rao", duration: "45 min", resources: "6", status: "Published" },
    { lesson: "Quadratic Models", course: "Calculus Practice Track", teacher: "Daniel Fernandes", duration: "50 min", resources: "4", status: "Draft" },
    { lesson: "Persuasive Writing", course: "English Grammar Studio", teacher: "Rohan Sen", duration: "40 min", resources: "5", status: "Published" },
  ]),
  assignments: makeLearningPage("assignments", "Assignments", "Assignment", "Track assigned work, submissions, grading progress, and overdue items.", "Create Assignment", ["assignment", "class", "subject", "dueDate", "submitted", "status"], [
    { assignment: "Physics Worksheet 4", class: "10-A", subject: "Physics", dueDate: "21 Sep", submitted: "32/39", status: "Open" },
    { assignment: "History Essay", class: "9-C", subject: "History", dueDate: "19 Sep", submitted: "31/36", status: "Grading" },
    { assignment: "Calculus Drill", class: "11-B", subject: "Mathematics", dueDate: "25 Sep", submitted: "18/33", status: "Open" },
  ]),
  "online-classes": makeLearningPage("online-classes", "Online Classes", "Session", "Coordinate virtual sessions, hosts, attendance, recordings, and access status.", "Schedule Class", ["session", "class", "host", "time", "attendees", "status"], [
    { session: "Doubt Clearing: Algebra", class: "10-A", host: "Daniel Fernandes", time: "Today 04:00 PM", attendees: "38", status: "Scheduled" },
    { session: "Physics Revision", class: "11-B", host: "Ananya Rao", time: "Tomorrow 05:30 PM", attendees: "31", status: "Scheduled" },
    { session: "English Reading Room", class: "8-B", host: "Rohan Sen", time: "16 Sep 06:00 PM", attendees: "44", status: "Recorded" },
  ]),
  library: {
    key: "library",
    title: "Library",
    description: "Manage catalog availability, issued books, overdue items, and student circulation.",
    group: "Administration",
    primaryAction: "Add Book",
    secondaryActions: ["Issue Book", "Export Catalog"],
    searchPlaceholder: "Search title, author, ISBN...",
    filters: ["All books", "Available", "Issued", "Overdue", "Reserved"],
    tabs: ["Catalog", "Issued", "Overdue", "Reservations"],
    stats: [
      { label: "Available Books", value: "8,420", helper: "Across 12 categories", tone: "success" },
      { label: "Issued Books", value: "1,186", helper: "This month", tone: "primary" },
      { label: "Overdue Books", value: "42", helper: "Reminder queue", tone: "warning" },
      { label: "Reservations", value: "96", helper: "Pending pickup", tone: "info" },
    ],
    columns: [
      { key: "title", label: "Title" },
      { key: "author", label: "Author" },
      { key: "category", label: "Category" },
      { key: "copies", label: "Copies" },
      { key: "location", label: "Location" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", copies: "7/10", location: "S-04", status: "Available" },
      { title: "The Blue Umbrella", author: "Ruskin Bond", category: "Literature", copies: "1/8", location: "L-12", status: "Issued" },
      { title: "Mathematics Olympiad Primer", author: "V. Krishnan", category: "Mathematics", copies: "0/5", location: "M-02", status: "Overdue" },
    ],
    emptyState: { title: "No books found", description: "Try a different category, title, or author." },
  },
  inventory: makeAdminPage("inventory", "Inventory", "Item", "Track asset inventory, stock levels, vendors, maintenance, and issue history.", "Add Item", ["item", "category", "stock", "location", "owner", "status"], [
    { item: "Projector Units", category: "Classroom Tech", stock: "42", location: "IT Store", owner: "Operations", status: "Available" },
    { item: "Chemistry Lab Kits", category: "Lab", stock: "18", location: "Science Block", owner: "Science Dept.", status: "Low Stock" },
    { item: "Sports Jerseys", category: "Sports", stock: "120", location: "Gym Store", owner: "PE Office", status: "Available" },
  ]),
  transport: makeAdminPage("transport", "Transport", "Route", "Coordinate buses, routes, drivers, occupancy, and route health.", "Add Route", ["route", "driver", "bus", "students", "eta", "status"], [
    { route: "Route 07 - Indiranagar", driver: "Suresh N.", bus: "KA-07-2284", students: "42/48", eta: "On time", status: "Active" },
    { route: "Route 12 - Whitefield", driver: "Mahesh P.", bus: "KA-07-3318", students: "46/48", eta: "8 min delay", status: "Delayed" },
    { route: "Route 03 - Koramangala", driver: "Faisal K.", bus: "KA-07-1192", students: "34/48", eta: "On time", status: "Active" },
  ]),
  communication: makeAdminPage("communication", "Communication", "Message", "Manage announcements, audience segments, delivery status, and parent communication.", "Compose Message", ["message", "audience", "channel", "sentBy", "sentOn", "status"], [
    { message: "Exam schedule published", audience: "Classes 9-12", channel: "Email + App", sentBy: "Academic Office", sentOn: "Today", status: "Sent" },
    { message: "Transport delay alert", audience: "Route 12 Parents", channel: "SMS", sentBy: "Transport", sentOn: "Today", status: "Sent" },
    { message: "Fee reminder batch", audience: "Pending Fee Parents", channel: "Email", sentBy: "Finance", sentOn: "Tomorrow", status: "Scheduled" },
  ]),
  events: makeAdminPage("events", "Events", "Event", "Plan school events, RSVPs, venues, staff ownership, and publishing status.", "Create Event", ["event", "date", "venue", "owner", "attendees", "status"], [
    { event: "Inter-house Science Fair", date: "25 Sep", venue: "Auditorium", owner: "Science Dept.", attendees: "520", status: "Published" },
    { event: "Parent Teacher Meet", date: "01 Oct", venue: "Campus-wide", owner: "Academic Office", attendees: "1,340", status: "Draft" },
    { event: "Founders Day Rehearsal", date: "05 Oct", venue: "Main Ground", owner: "Cultural Team", attendees: "260", status: "Planning" },
  ]),
  documents: makeAdminPage("documents", "Documents", "Document", "Maintain student, staff, and administrative document workflows with review status.", "Upload Document", ["document", "owner", "type", "updated", "reviewer", "status"], [
    { document: "Class 10 Transfer Certificates", owner: "Registrar", type: "Student Records", updated: "Today", reviewer: "Principal Office", status: "Review" },
    { document: "Staff KYC Batch", owner: "HR Desk", type: "Compliance", updated: "Yesterday", reviewer: "Admin", status: "Approved" },
  ]),
  staff: {
    key: "staff",
    title: "Staff",
    description: "Review staff directory, departments, attendance, leave, and employment status.",
    group: "HR",
    primaryAction: "Add Staff",
    secondaryActions: ["Import Staff", "Export Directory"],
    searchPlaceholder: "Search staff, department, employee ID...",
    filters: ["All staff", "Teaching", "Operations", "Admin", "Support"],
    tabs: ["Directory", "Attendance", "Leave", "Contracts"],
    stats: [
      { label: "Total Staff", value: "146", helper: "68 teaching staff", tone: "primary" },
      { label: "Present Today", value: "132", helper: "90.4% workforce", tone: "success" },
      { label: "On Leave", value: "9", helper: "Approved requests", tone: "warning" },
      { label: "Payroll Ready", value: "94%", helper: "Cycle validation", tone: "info" },
    ],
    columns: [
      { key: "name", label: "Staff member" },
      { key: "employeeId", label: "Employee ID" },
      { key: "department", label: "Department" },
      { key: "role", label: "Role" },
      { key: "attendance", label: "Attendance" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { name: "Priya Menon", employeeId: "EMP-1042", department: "Admissions", role: "Counselor", attendance: "Present", status: "Active" },
      { name: "Suresh N.", employeeId: "EMP-0874", department: "Transport", role: "Driver", attendance: "Present", status: "Active" },
      { name: "Meera Kapoor", employeeId: "EMP-0218", department: "Humanities", role: "Teacher", attendance: "Leave", status: "On Leave" },
    ],
    emptyState: { title: "No staff members found", description: "Try another department, role, or employee keyword." },
  },
  "leave-management": makeHrPage("leave-management", "Leave Management", "Leave", "Approve staff leave requests, coverage plans, balances, and leave trends.", "Request Leave", ["employee", "type", "dates", "coverage", "balance", "status"], [
    { employee: "Meera Kapoor", type: "Medical", dates: "17-19 Sep", coverage: "Rohan Sen", balance: "8 days", status: "Approved" },
    { employee: "Suresh N.", type: "Personal", dates: "22 Sep", coverage: "Route backup", balance: "11 days", status: "Pending" },
    { employee: "Ananya Rao", type: "Workshop", dates: "29 Sep", coverage: "Lab assistant", balance: "5 days", status: "Review" },
  ]),
  payroll: makeHrPage("payroll", "Payroll", "Payroll", "Review payroll cycle readiness, allowances, deductions, and approval status.", "Run Payroll", ["cycle", "department", "employees", "gross", "exceptions", "status"], [
    { cycle: "September 2026", department: "Teaching", employees: "68", gross: "₹48.6L", exceptions: "2", status: "Ready" },
    { cycle: "September 2026", department: "Operations", employees: "42", gross: "₹18.2L", exceptions: "1", status: "Review" },
    { cycle: "September 2026", department: "Admin", employees: "36", gross: "₹22.8L", exceptions: "0", status: "Ready" },
  ]),
  "academic-reports": makeReportsPage("academic-reports", "Academic Reports", "Report", "Track curriculum progress, assessment readiness, grades, and class performance.", "Generate Academic Report", ["report", "scope", "owner", "coverage", "updated", "status"], [
    { report: "Curriculum Completion", scope: "Classes 6-12", owner: "Academic Office", coverage: "87%", updated: "Today", status: "Ready" },
    { report: "Subject Performance", scope: "Term 1", owner: "Exam Cell", coverage: "2,204 students", updated: "Yesterday", status: "Ready" },
    { report: "Teacher Load", scope: "All faculty", owner: "Timetable Team", coverage: "68 teachers", updated: "15 Sep", status: "Draft" },
  ]),
  "attendance-reports": makeReportsPage("attendance-reports", "Attendance Reports", "Report", "Analyze student attendance, absence trends, late arrivals, and class summaries.", "Generate Attendance Report", ["report", "period", "segment", "average", "flagged", "status"], [
    { report: "Monthly Attendance", period: "September", segment: "All classes", average: "94.1%", flagged: "28", status: "Ready" },
    { report: "Chronic Absentees", period: "Term 1", segment: "Classes 8-12", average: "76.5%", flagged: "19", status: "Review" },
    { report: "Late Arrival Trend", period: "Last 14 days", segment: "Transport users", average: "3.2%", flagged: "11", status: "Ready" },
  ]),
  "fee-reports": makeReportsPage("fee-reports", "Fee Reports", "Report", "Review fee collection, overdue aging, discounts, and reconciliation insights.", "Generate Fee Report", ["report", "period", "collection", "pending", "owner", "status"], [
    { report: "Collection Summary", period: "Term 1", collection: "₹82.6L", pending: "₹18.4L", owner: "Finance Desk", status: "Ready" },
    { report: "Overdue Aging", period: "September", collection: "₹12.8L", pending: "₹6.8L", owner: "Accounts", status: "Ready" },
    { report: "Discount Audit", period: "FY 2026", collection: "₹4.2L", pending: "₹82K", owner: "Controller", status: "Draft" },
  ]),
  "student-reports": makeReportsPage("student-reports", "Student Reports", "Report", "Create student lifecycle reports across academics, attendance, conduct, and fees.", "Generate Student Report", ["report", "cohort", "records", "insight", "updated", "status"], [
    { report: "Student 360", cohort: "Class 10", records: "118", insight: "12 interventions", updated: "Today", status: "Ready" },
    { report: "New Admissions", cohort: "2026 intake", records: "128", insight: "82% complete", updated: "Yesterday", status: "Ready" },
    { report: "Transfer Requests", cohort: "All classes", records: "9", insight: "3 pending", updated: "14 Sep", status: "Review" },
  ]),
  settings: {
    key: "settings",
    title: "Settings",
    description: "Control institution profile, academic year, notifications, roles, and platform preferences.",
    group: "System",
    primaryAction: "Save Settings",
    secondaryActions: ["Invite Admin", "Audit Log"],
    searchPlaceholder: "Search settings, roles, preferences...",
    filters: ["All settings", "Institution", "Users", "Notifications", "Security"],
    tabs: ["General", "Users", "Roles", "Notifications"],
    stats: [
      { label: "System Users", value: "86", helper: "5 role types", tone: "primary" },
      { label: "Active Roles", value: "5", helper: "Super Admin, Admin, Staff Admin, Teacher, Parent", tone: "info" },
      { label: "Alerts Enabled", value: "14", helper: "Email, SMS, App", tone: "success" },
      { label: "Policy Reviews", value: "3", helper: "Due this month", tone: "warning" },
    ],
    columns: [
      { key: "setting", label: "Setting" },
      { key: "area", label: "Area" },
      { key: "owner", label: "Owner" },
      { key: "updated", label: "Updated" },
      { key: "status", label: "Status" },
    ],
    rows: [
      { setting: "Academic Year 2026-27", area: "Institution", owner: "Admin Office", updated: "Today", status: "Active" },
      { setting: "Parent Notification Rules", area: "Notifications", owner: "Communication", updated: "Yesterday", status: "Review" },
      { setting: "Role Access Matrix", area: "Security", owner: "Super Admin", updated: "15 Sep", status: "Active" },
      { setting: "Staff Admin Operations Scope", area: "Security", owner: "Admin", updated: "14 Sep", status: "Active" },
      { setting: "Teacher Classroom Access", area: "Security", owner: "Admin", updated: "12 Sep", status: "Active" },
      { setting: "Parent Guardian Portal", area: "Security", owner: "Staff Admin", updated: "10 Sep", status: "Active" },
    ],
    emptyState: { title: "No settings found", description: "Try a different settings area or keyword." },
  },
};

function makeAcademicPage(
  key: string,
  title: string,
  noun: string,
  description: string,
  primaryAction: string,
  columnKeys: string[],
  rows: DataRow[],
): PageConfig {
  return makePage(key, title, "Academic", noun, description, primaryAction, columnKeys, rows, [
    { label: `Active ${pluralize(noun)}`, value: String(rows.length * 18 + 24), helper: "Current academic year", tone: "primary" },
    { label: "Needs Review", value: String(rows.length + 3), helper: "Open admin actions", tone: "warning" },
    { label: "Completion", value: "91%", helper: "On-track items", tone: "success" },
    { label: "Updated", value: "Today", helper: "Latest sync snapshot", tone: "info" },
  ]);
}

function makeAdmissionsPage(
  key: string,
  title: string,
  noun: string,
  description: string,
  primaryAction: string,
  columnKeys: string[],
  rows: DataRow[],
): PageConfig {
  return makePage(key, title, "Admissions", noun, description, primaryAction, columnKeys, rows, [
    { label: `Open ${pluralize(noun)}`, value: String(rows.length * 21), helper: "In admission funnel", tone: "primary" },
    { label: "This Week", value: "37", helper: "New parent interactions", tone: "info" },
    { label: "Converted", value: "68%", helper: "+9% vs last month", tone: "success" },
    { label: "SLA Risk", value: "8", helper: "Needs counselor action", tone: "warning" },
  ]);
}

function makeFinancePage(
  key: string,
  title: string,
  noun: string,
  description: string,
  primaryAction: string,
  columnKeys: string[],
  rows: DataRow[],
): PageConfig {
  return makePage(key, title, "Finance", noun, description, primaryAction, columnKeys, rows, [
    { label: "Current Cycle", value: "₹82.6L", helper: "Processed value", tone: "success" },
    { label: "Pending Review", value: "18", helper: "Finance queue", tone: "warning" },
    { label: "Exceptions", value: "6", helper: "Needs approval", tone: "danger" },
    { label: "Reconciled", value: "96%", helper: "Month to date", tone: "primary" },
  ]);
}

function makeFmsPage(
  key: string,
  title: string,
  noun: string,
  description: string,
  primaryAction: string,
  columnKeys: string[],
  rows: DataRow[],
): PageConfig {
  return makePage(key, title, "FMS", noun, description, primaryAction, columnKeys, rows, [
    { label: "Collections MTD", value: "₹48.2L", helper: "Fee receipts", tone: "success" },
    { label: "Pending Dues", value: "₹12.6L", helper: "Open balances", tone: "warning" },
    { label: "Concessions", value: "86", helper: "Active this term", tone: "info" },
    { label: "Reconciled", value: "94%", helper: "Bank + MOP", tone: "primary" },
  ]);
}

function makeLearningPage(
  key: string,
  title: string,
  noun: string,
  description: string,
  primaryAction: string,
  columnKeys: string[],
  rows: DataRow[],
): PageConfig {
  return makePage(key, title, "Learning", noun, description, primaryAction, columnKeys, rows, [
    { label: `Active ${pluralize(noun)}`, value: String(rows.length * 34), helper: "Published for learners", tone: "primary" },
    { label: "Engagement", value: "78%", helper: "Average participation", tone: "success" },
    { label: "Pending Grading", value: "142", helper: "Teacher queue", tone: "warning" },
    { label: "Updated", value: "Today", helper: "Fresh content changes", tone: "info" },
  ]);
}

function makeAdminPage(
  key: string,
  title: string,
  noun: string,
  description: string,
  primaryAction: string,
  columnKeys: string[],
  rows: DataRow[],
): PageConfig {
  return makePage(key, title, "Administration", noun, description, primaryAction, columnKeys, rows, [
    { label: `Managed ${pluralize(noun)}`, value: String(rows.length * 42), helper: "Operational records", tone: "primary" },
    { label: "Active", value: "94%", helper: "Available now", tone: "success" },
    { label: "Needs Action", value: "11", helper: "Admin queue", tone: "warning" },
    { label: "Updated", value: "Today", helper: "Latest operational check", tone: "info" },
  ]);
}

function makeHrPage(
  key: string,
  title: string,
  noun: string,
  description: string,
  primaryAction: string,
  columnKeys: string[],
  rows: DataRow[],
): PageConfig {
  return makePage(key, title, "HR", noun, description, primaryAction, columnKeys, rows, [
    { label: "Total Staff", value: "146", helper: "Across departments", tone: "primary" },
    { label: "Ready", value: "94%", helper: "Current cycle", tone: "success" },
    { label: "Pending", value: "9", helper: "Approvals needed", tone: "warning" },
    { label: "Exceptions", value: "2", helper: "Needs HR review", tone: "danger" },
  ]);
}

function makeReportsPage(
  key: string,
  title: string,
  noun: string,
  description: string,
  primaryAction: string,
  columnKeys: string[],
  rows: DataRow[],
): PageConfig {
  return makePage(key, title, "Reports", noun, description, primaryAction, columnKeys, rows, [
    { label: "Reports Ready", value: "18", helper: "Available for export", tone: "primary" },
    { label: "Scheduled", value: "7", helper: "Automated cycles", tone: "info" },
    { label: "Coverage", value: "96%", helper: "Data completeness", tone: "success" },
    { label: "Review Queue", value: "4", helper: "Leadership sign-off", tone: "warning" },
  ]);
}

function makePage(
  key: string,
  title: string,
  group: string,
  noun: string,
  description: string,
  primaryAction: string,
  columnKeys: string[],
  rows: DataRow[],
  stats: SummaryMetric[],
): PageConfig {
  return {
    key,
    title,
    description,
    group,
    primaryAction,
    secondaryActions: ["Export", "Bulk Actions"],
    searchPlaceholder: `Search ${title.toLowerCase()}...`,
    filters: [`All ${pluralize(noun).toLowerCase()}`, "Active", "Pending", "Review"],
    tabs: standardTabs,
    stats,
    columns: columnKeys.map((columnKey) => ({ key: columnKey, label: toLabel(columnKey) })),
    rows,
    emptyState: {
      title: `No ${pluralize(noun).toLowerCase()} found`,
      description: `Try another keyword or status filter to view ${title.toLowerCase()}.`,
    },
  };
}

function pluralize(noun: string) {
  if (noun.endsWith("s")) return noun;
  if (noun.endsWith("y")) return `${noun.slice(0, -1)}ies`;
  return `${noun}s`;
}

function toLabel(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

export const dashboardKpis: SummaryMetric[] = [
  { label: "Total Students", value: "2,450", helper: "+48 this term", tone: "primary" },
  { label: "Total Teachers", value: "68", helper: "63 present today", tone: "success" },
  { label: "Today's Attendance", value: "94.9%", helper: "2,327 present", tone: "info" },
  { label: "Pending Fees", value: "₹18.4L", helper: "412 open invoices", tone: "warning" },
  { label: "New Admissions", value: "128", helper: "32 awaiting review", tone: "primary" },
  { label: "Upcoming Exams", value: "6", helper: "Next 14 days", tone: "danger" },
];

export const enrollmentData = [
  { month: "Apr", students: 2280 },
  { month: "May", students: 2318 },
  { month: "Jun", students: 2364 },
  { month: "Jul", students: 2402 },
  { month: "Aug", students: 2426 },
  { month: "Sep", students: 2450 },
];

export const attendanceData = [
  { className: "6", value: 96 },
  { className: "7", value: 92 },
  { className: "8", value: 95 },
  { className: "9", value: 90 },
  { className: "10", value: 94 },
  { className: "11", value: 91 },
  { className: "12", value: 89 },
];

export const feeCollectionData = [
  { label: "Collected", value: 82.6 },
  { label: "Pending", value: 18.4 },
  { label: "Overdue", value: 6.8 },
];

export const recentActivities = [
  { type: "Student", title: "Aarav Mehta profile updated", owner: "Registrar", time: "10:45 AM", status: "Done" },
  { type: "Finance", title: "Fee invoice FEE-2026-1208 generated", owner: "Finance Desk", time: "11:16 AM", status: "Pending" },
  { type: "Academic", title: "Class 10-A room reassigned", owner: "Timetable Team", time: "12:30 PM", status: "Done" },
  { type: "HR", title: "Medical leave approved for Meera Kapoor", owner: "HR Desk", time: "02:15 PM", status: "Approved" },
];

export const upcomingEvents = [
  { title: "Science Fair Judging", detail: "Auditorium · 25 Sep", tone: "info" },
  { title: "Parent Teacher Meet", detail: "Campus-wide · 01 Oct", tone: "primary" },
  { title: "Mid-Term Assessments", detail: "Classes 8-12 · Starts 24 Sep", tone: "warning" },
];

export const pendingApprovals = [
  { title: "124 unpaid fee reminders", detail: "Due date passed for 3 sections", action: "Remind", tone: "danger" },
  { title: "9 staff leave requests", detail: "Coverage required for next week", action: "Review", tone: "warning" },
  { title: "3 timetable conflicts", detail: "Rooms overlap in senior block", action: "Resolve", tone: "info" },
];
