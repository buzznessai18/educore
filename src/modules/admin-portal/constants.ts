import type {
  AdmissionModuleTab,
  LookupOption,
  ReferralSource,
  StudentStatus,
  TransportMonth,
} from "./types";

export const ADMISSION_MODULE_TABS: { id: AdmissionModuleTab; label: string }[] = [
  { id: "registration", label: "Registration" },
  { id: "medical", label: "Medical Form" },
  { id: "documents", label: "Documents" },
  { id: "fees", label: "Fees" },
  { id: "attendance", label: "Attendance" },
  { id: "marks", label: "Marks" },
  { id: "lesson_update", label: "Lesson Update" },
  { id: "assignment", label: "Assignment" },
  { id: "feedback", label: "Feedback" },
  { id: "observations", label: "Student Observations" },
];

export const STUDENT_STATUS_OPTIONS: { value: StudentStatus; label: string }[] = [
  { value: "regular", label: "Regular" },
  { value: "tc", label: "TC" },
  { value: "withhold", label: "Withhold" },
  { value: "left", label: "Left" },
  { value: "alumni", label: "Alumni" },
  { value: "draft", label: "Draft" },
];

export const TRANSPORT_MONTHS: { value: TransportMonth; label: string }[] = [
  { value: "july", label: "July Fee" },
  { value: "august", label: "August Fee" },
  { value: "september", label: "September Fee" },
  { value: "october", label: "October Fee" },
  { value: "november", label: "November Fee" },
  { value: "december", label: "December Fee" },
  { value: "january", label: "January Fee" },
  { value: "february", label: "February Fee" },
  { value: "march", label: "March Fee" },
];

export const REFERRAL_OPTIONS: { value: ReferralSource; label: string }[] = [
  { value: "friend", label: "Friend" },
  { value: "radio", label: "Radio" },
  { value: "web", label: "Web" },
  { value: "newspaper_magazine", label: "Newspaper/Magazine" },
  { value: "others", label: "Others" },
];

export const CLASS_OPTIONS: LookupOption[] = [
  { value: "class-8", label: "Class 8" },
  { value: "class-9", label: "Class 9" },
  { value: "class-10", label: "Class 10" },
  { value: "class-11", label: "Class 11" },
  { value: "class-12", label: "Class 12" },
];

export const SECTION_OPTIONS: LookupOption[] = [
  { value: "a", label: "Section A" },
  { value: "b", label: "Section B" },
  { value: "c", label: "Section C" },
];

export const ACADEMIC_YEAR_OPTIONS: LookupOption[] = [
  { value: "2024-25", label: "2024-25" },
  { value: "2025-26", label: "2025-26" },
  { value: "2026-27", label: "2026-27" },
];

export const QUOTA_OPTIONS: LookupOption[] = [
  { value: "general", label: "General" },
  { value: "management", label: "Management" },
  { value: "rte", label: "RTE" },
  { value: "staff", label: "Staff" },
  { value: "sports", label: "Sports" },
];

export const STATE_OPTIONS: LookupOption[] = [
  { value: "karnataka", label: "Karnataka" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "tamil-nadu", label: "Tamil Nadu" },
  { value: "delhi", label: "Delhi" },
];

export const BOARD_OPTIONS: LookupOption[] = [
  { value: "cbse", label: "CBSE" },
  { value: "icse", label: "ICSE" },
  { value: "state", label: "State Board" },
  { value: "ib", label: "IB" },
];

export const BLOOD_GROUP_OPTIONS: LookupOption[] = [
  { value: "a+", label: "A+" },
  { value: "a-", label: "A-" },
  { value: "b+", label: "B+" },
  { value: "b-", label: "B-" },
  { value: "ab+", label: "AB+" },
  { value: "ab-", label: "AB-" },
  { value: "o+", label: "O+" },
  { value: "o-", label: "O-" },
];

export const TRANSPORT_ROUTE_OPTIONS: LookupOption[] = [
  { value: "route-1", label: "Route 1 — North Campus" },
  { value: "route-2", label: "Route 2 — City Center" },
  { value: "route-3", label: "Route 3 — East Corridor" },
  { value: "none", label: "No Transport" },
];

export const HOSTEL_OPTIONS: LookupOption[] = [
  { value: "none", label: "Day Scholar" },
  { value: "boys-a", label: "Boys Hostel Block A" },
  { value: "girls-b", label: "Girls Hostel Block B" },
];

export const ROOM_TYPE_OPTIONS: LookupOption[] = [
  { value: "ac", label: "AC" },
  { value: "non-ac", label: "Non-AC" },
];

export const ROOM_SHARING_OPTIONS: LookupOption[] = [
  { value: "single", label: "Single" },
  { value: "double", label: "Double" },
  { value: "triple", label: "Triple" },
];

export const CATEGORY_OPTIONS: LookupOption[] = [
  { value: "general", label: "General" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
];

export const FEES_CATEGORY_OPTIONS: LookupOption[] = [
  { value: "full", label: "Full Fee" },
  { value: "concession", label: "Concession" },
  { value: "scholarship", label: "Scholarship" },
];

export const EXPORT_ACTIONS = ["Copy", "CSV", "Excel", "PDF", "Print"] as const;

export type ExportAction = (typeof EXPORT_ACTIONS)[number];
