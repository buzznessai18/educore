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
    "class-8": "Class 8",
    "class-9": "Class 9",
    "class-10": "Class 10",
    "class-11": "Class 11",
    "class-12": "Class 12",
  };
  const section = sectionId ? sectionId.toUpperCase() : "-";
  return `${classMap[classId] ?? classId} / ${section}`;
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
      firstName: "Meera",
      lastName: "Iyer",
      classId: "class-11",
      sectionId: "a",
      admissionNo: "ADM-2026-0041",
      rollNo: "11A-12",
      quota: "general",
      uidNumber: "UID-87110",
      studentStatus: "regular" as const,
      registrationDate: "2026-07-02",
      admissionStartDate: "2026-07-15",
      state: "karnataka",
      boardUniversity: "cbse",
      studentCategory: "general",
      feesCategory: "scholarship",
      gender: "female" as const,
      dateOfBirth: "2010-11-22",
      email: "meera.iyer@student.educore.school",
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
      classId: "class-8",
      sectionId: "c",
      admissionNo: "ADM-2026-0028",
      rollNo: "8C-05",
      quota: "sports",
      uidNumber: "UID-86990",
      studentStatus: "regular" as const,
      registrationDate: "2026-06-21",
      admissionStartDate: "2026-07-01",
      state: "karnataka",
      boardUniversity: "state",
      studentCategory: "obc",
      feesCategory: "concession",
      gender: "male" as const,
      dateOfBirth: "2013-03-14",
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
      admissionNo: "ADM-2026-0015",
      rollNo: "12B-03",
      quota: "rte",
      uidNumber: "UID-86001",
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
  return {
    id: record.id,
    slNo,
    studentName: fullName(record.child.firstName, record.child.middleName, record.child.lastName),
    semesterClassSection: classLabel(record.child.classId, record.child.sectionId),
    admissionNo: record.child.admissionNo,
    quota: record.child.quota,
    fatherName: fullName(
      record.family.father.firstName,
      record.family.father.middleName,
      record.family.father.lastName,
    ),
    uid: record.child.uidNumber || "—",
    applicationDate: record.applicationDate,
    listStatus: record.listStatus,
  };
}

export const mockDashboardOverview: AdminDashboardOverview = {
  academicYear: "2026-27",
  metrics: {
    totalStudents: 2450,
    totalFeeReceivable: 18450000,
    totalBillsPayable: 3260000,
    totalBillsPaid: 15190000,
  },
  incomeVsExpenses: [
    { month: "Apr", income: 2100000, expenses: 980000 },
    { month: "May", income: 1850000, expenses: 1020000 },
    { month: "Jun", income: 2400000, expenses: 1100000 },
    { month: "Jul", income: 2650000, expenses: 1250000 },
    { month: "Aug", income: 2280000, expenses: 1180000 },
    { month: "Sep", income: 2520000, expenses: 1210000 },
    { month: "Oct", income: 1980000, expenses: 1050000 },
    { month: "Nov", income: 1750000, expenses: 990000 },
    { month: "Dec", income: 1620000, expenses: 940000 },
    { month: "Jan", income: 2050000, expenses: 1080000 },
    { month: "Feb", income: 1890000, expenses: 1010000 },
    { month: "Mar", income: 2360000, expenses: 1140000 },
  ],
};
