import type {
  AdminDashboardOverview,
  AdmissionListRow,
  StudentAdmissionRecord,
} from "./types";
import { createEmptyAdmissionForm } from "./schemas";

function fullName(first: string, middle: string, last: string) {
  return [first, middle, last].filter(Boolean).join(" ");
}

function classLabel(classId: string, sectionId: string) {
  const classMap: Record<string, string> = {
    nursery: "NURSERY",
    lkg: "LKG",
    ukg: "UKG",
    "class-8": "Class 8",
    "class-9": "Class 9",
    "class-10": "Class 10",
    "class-11": "Class 11",
    "class-12": "Class 12",
  };
  const sectionMap: Record<string, string> = {
    a: "A Section",
    b: "B Section",
    c: "C Section",
    nursery_a: "NURSERY A Section",
    lkg_a: "LKG A Section",
    ukg_a: "UKG A Section",
  };
  const className = classMap[classId] ?? classId;
  const section = sectionMap[sectionId] ?? (sectionId ? `${sectionId.toUpperCase()} Section` : "—");
  return { className, section, combined: `${className} / ${section}` };
}

function formatDisplayDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const seedForms = [
  {
    ...createEmptyAdmissionForm(),
    listStatus: "applied" as const,
    applicationDate: "2026-08-12",
    child: {
      ...createEmptyAdmissionForm().child,
      firstName: "Ananya",
      middleName: "",
      lastName: "Sharma",
      classId: "class-10",
      sectionId: "a",
      admissionNo: "APP-2026-0142",
      quota: "general",
      uidNumber: "UID-88421",
      studentStatus: "draft" as const,
      registrationDate: "2026-08-12",
      admissionStartDate: "2026-09-01",
      state: "karnataka",
      boardUniversity: "cbse",
      studentCategory: "general",
      feesCategory: "full",
      gender: "female" as const,
      dateOfBirth: "2011-04-18",
    },
    family: {
      ...createEmptyAdmissionForm().family,
      father: {
        ...createEmptyAdmissionForm().family.father,
        firstName: "Rajesh",
        lastName: "Sharma",
        mobileNo: "9876543210",
        email: "rajesh.sharma@email.com",
      },
      smsNumber: "9876543210",
      homeAddress: "12 Residency Road, Bengaluru",
    },
  },
  {
    ...createEmptyAdmissionForm(),
    listStatus: "applied" as const,
    applicationDate: "2026-08-18",
    child: {
      ...createEmptyAdmissionForm().child,
      firstName: "Kabir",
      lastName: "Patel",
      classId: "class-9",
      sectionId: "b",
      admissionNo: "APP-2026-0158",
      quota: "management",
      uidNumber: "UID-88502",
      studentStatus: "draft" as const,
      registrationDate: "2026-08-18",
      admissionStartDate: "2026-09-01",
      state: "maharashtra",
      boardUniversity: "cbse",
      studentCategory: "general",
      feesCategory: "full",
      gender: "male" as const,
      dateOfBirth: "2012-01-09",
    },
    family: {
      ...createEmptyAdmissionForm().family,
      father: {
        ...createEmptyAdmissionForm().family.father,
        firstName: "Amit",
        lastName: "Patel",
        mobileNo: "9988776655",
      },
      smsNumber: "9988776655",
      homeAddress: "44 Lake View, Pune",
    },
  },
  {
    ...createEmptyAdmissionForm(),
    listStatus: "admitted" as const,
    applicationDate: "2026-07-02",
    child: {
      ...createEmptyAdmissionForm().child,
      firstName: "Umme Ariba",
      lastName: "Dharwadkar",
      classId: "nursery",
      sectionId: "nursery_a",
      admissionNo: "468",
      rollNo: "N-01",
      quota: "general",
      uidNumber: "260726468",
      studentStatus: "regular" as const,
      registrationDate: "2026-07-02",
      admissionStartDate: "2026-07-02",
      state: "karnataka",
      boardUniversity: "cbse",
      studentCategory: "general",
      feesCategory: "full",
      gender: "female" as const,
      dateOfBirth: "2022-03-12",
    },
    family: {
      ...createEmptyAdmissionForm().family,
      father: {
        ...createEmptyAdmissionForm().family.father,
        firstName: "Fida Hussain",
        lastName: "Dharwadkar",
        mobileNo: "9739672909",
      },
      smsNumber: "9739672909",
      homeAddress: "Dharwad",
    },
  },
  {
    ...createEmptyAdmissionForm(),
    listStatus: "admitted" as const,
    applicationDate: "2026-07-02",
    child: {
      ...createEmptyAdmissionForm().child,
      firstName: "Meera",
      lastName: "Iyer",
      classId: "lkg",
      sectionId: "lkg_a",
      admissionNo: "466",
      rollNo: "L-02",
      quota: "general",
      uidNumber: "260726466",
      studentStatus: "regular" as const,
      registrationDate: "2026-07-02",
      admissionStartDate: "2026-07-02",
      state: "karnataka",
      boardUniversity: "cbse",
      studentCategory: "general",
      feesCategory: "scholarship",
      gender: "female" as const,
      dateOfBirth: "2021-11-22",
    },
    family: {
      ...createEmptyAdmissionForm().family,
      father: {
        ...createEmptyAdmissionForm().family.father,
        firstName: "Suresh",
        lastName: "Iyer",
        mobileNo: "9123456780",
        email: "suresh.iyer@email.com",
      },
      mother: {
        ...createEmptyAdmissionForm().family.mother,
        firstName: "Lakshmi",
        lastName: "Iyer",
        mobileNo: "9123456781",
      },
      smsNumber: "9123456780",
      homeAddress: "8 Temple Street, Mysuru",
    },
  },
  {
    ...createEmptyAdmissionForm(),
    listStatus: "admitted" as const,
    applicationDate: "2026-06-21",
    child: {
      ...createEmptyAdmissionForm().child,
      firstName: "Arjun",
      lastName: "Reddy",
      classId: "ukg",
      sectionId: "ukg_a",
      admissionNo: "455",
      rollNo: "U-05",
      quota: "general",
      uidNumber: "260621455",
      studentStatus: "regular" as const,
      registrationDate: "2026-06-21",
      admissionStartDate: "2026-07-01",
      state: "karnataka",
      boardUniversity: "state",
      studentCategory: "obc",
      feesCategory: "concession",
      gender: "male" as const,
      dateOfBirth: "2020-03-14",
    },
    family: {
      ...createEmptyAdmissionForm().family,
      father: {
        ...createEmptyAdmissionForm().family.father,
        firstName: "Venkat",
        lastName: "Reddy",
        mobileNo: "9001122334",
      },
      smsNumber: "9001122334",
      homeAddress: "21 Ring Road, Hubballi",
    },
  },
  {
    ...createEmptyAdmissionForm(),
    listStatus: "admitted" as const,
    applicationDate: "2026-06-10",
    child: {
      ...createEmptyAdmissionForm().child,
      firstName: "Sara",
      lastName: "Khan",
      classId: "class-12",
      sectionId: "b",
      admissionNo: "441",
      rollNo: "12B-03",
      quota: "general",
      uidNumber: "260610441",
      studentStatus: "regular" as const,
      registrationDate: "2026-06-10",
      admissionStartDate: "2026-06-20",
      state: "delhi",
      boardUniversity: "cbse",
      studentCategory: "general",
      feesCategory: "full",
      gender: "female" as const,
      dateOfBirth: "2009-09-05",
    },
    family: {
      ...createEmptyAdmissionForm().family,
      father: {
        ...createEmptyAdmissionForm().family.father,
        firstName: "Imran",
        lastName: "Khan",
        mobileNo: "9811122233",
      },
      smsNumber: "9811122233",
      homeAddress: "5 Green Park, New Delhi",
    },
  },
];

export const mockAdmissionRecords: StudentAdmissionRecord[] = seedForms.map((form, index) => {
  const now = new Date().toISOString();
  return {
    id: `stu-${index + 1}`,
    listStatus: form.listStatus,
    applicationDate: form.applicationDate,
    child: form.child,
    family: form.family,
    emergencyContacts: form.emergencyContacts,
    referralSources: form.referralSources,
    transport: form.transport,
    hostel: form.hostel,
    createdAt: now,
    updatedAt: now,
  };
});

export function toAdmissionListRow(
  record: StudentAdmissionRecord,
  slNo: number,
): AdmissionListRow {
  const labels = classLabel(record.child.classId, record.child.sectionId);
  const admissionDate = record.child.admissionStartDate || record.applicationDate;
  return {
    id: record.id,
    slNo,
    studentName: fullName(record.child.firstName, record.child.middleName, record.child.lastName).toUpperCase(),
    semesterClass: labels.className,
    section: labels.section,
    semesterClassSection: labels.combined,
    admissionNo: record.child.admissionNo,
    quota: (record.child.quota || "general").toUpperCase(),
    fatherNo: record.family.father.mobileNo || "—",
    fatherName: fullName(
      record.family.father.firstName,
      record.family.father.middleName,
      record.family.father.lastName,
    ).toUpperCase(),
    uid: record.child.uidNumber || "—",
    admissionDate: formatDisplayDate(admissionDate),
    applicationNo: record.child.admissionNo,
    applicationDate: formatDisplayDate(record.applicationDate),
    listStatus: record.listStatus,
  };
}

export const mockDashboardOverview: AdminDashboardOverview = {
  academicYear: "2026-27",
  metrics: {
    totalStudents: 307,
    totalFeeReceivable: 4021000,
    totalFeeReceived: 1415000,
    totalBalanceFee: 2599000,
    totalBillsPayable: 0,
    totalBillsPaid: 0,
    pendingBills: 0,
    bankBalance: 0,
  },
  incomeVsExpenses: [
    { month: "Jan", income: 0, expenses: 0 },
    { month: "Feb", income: 0, expenses: 0 },
    { month: "Mar", income: 0, expenses: 0 },
    { month: "Apr", income: 80000, expenses: 45000 },
    { month: "May", income: 320000, expenses: 120000 },
    { month: "Jun", income: 1350000, expenses: 280000 },
    { month: "Jul", income: 150000, expenses: 95000 },
    { month: "Aug", income: 20000, expenses: 40000 },
    { month: "Sep", income: 0, expenses: 0 },
    { month: "Oct", income: 0, expenses: 0 },
    { month: "Nov", income: 0, expenses: 0 },
    { month: "Dec", income: 0, expenses: 0 },
  ],
};
