/** Domain models for the Admin Portal / Student Admission module. */

export type AdmissionListStatus = "applied" | "admitted";

export type StudentStatus =
  | "regular"
  | "tc"
  | "withhold"
  | "left"
  | "alumni"
  | "draft";

export type Gender = "male" | "female" | "other";

export type ProgramTrack = "school" | "ug" | "pg";

export type ReferralSource =
  | "friend"
  | "radio"
  | "web"
  | "newspaper_magazine"
  | "others";

export type TransportMonth =
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december"
  | "january"
  | "february"
  | "march";

export type AdmissionModuleTab =
  | "registration"
  | "medical"
  | "documents"
  | "fees"
  | "attendance"
  | "marks"
  | "lesson_update"
  | "assignment"
  | "feedback"
  | "observations";

export type ParentDetails = {
  firstName: string;
  middleName: string;
  lastName: string;
  occupation: string;
  employer: string;
  mobileNo: string;
  workPhone: string;
  otherPhone: string;
  email: string;
};

export type SiblingDetail = {
  id: string;
  name: string;
  className: string;
  dateOfBirth: string;
};

export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  relationship: string;
};

export type TransportDetails = {
  routeId: string;
  months: TransportMonth[];
};

export type HostelDetails = {
  hostelId: string;
  roomType: string;
  roomSharing: string;
};

export type ChildInformation = {
  registrationDate: string;
  admissionStartDate: string;
  programTrack: ProgramTrack;
  state: string;
  boardUniversity: string;
  syllabusBranch: string;
  levelCombination: string;
  classId: string;
  sectionId: string;
  admissionNo: string;
  rollNo: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  studentCategory: string;
  feesCategory: string;
  quota: string;
  uidNumber: string;
  satsNumber: string;
  penNumber: string;
  email: string;
  religion: string;
  caste: string;
  subCaste: string;
  bloodGroup: string;
  deviceId: string;
  studentStatus: StudentStatus;
  motherTongue: string;
  placeOfBirth: string;
  languageI: string;
  languageII: string;
  previousSchool: string;
  password: string;
  photoUrl: string | null;
};

export type FamilyInformation = {
  father: ParentDetails;
  mother: ParentDetails;
  homeAddress: string;
  postalAddress: string;
  smsNumber: string;
  siblings: SiblingDetail[];
};

export type StudentAdmissionRecord = {
  id: string;
  listStatus: AdmissionListStatus;
  applicationDate: string;
  child: ChildInformation;
  family: FamilyInformation;
  emergencyContacts: EmergencyContact[];
  referralSources: ReferralSource[];
  transport: TransportDetails;
  hostel: HostelDetails;
  createdAt: string;
  updatedAt: string;
};

/** Row shape for Applied / Admitted data tables. */
export type AdmissionListRow = {
  id: string;
  slNo: number;
  studentName: string;
  semesterClassSection: string;
  admissionNo: string;
  quota: string;
  fatherName: string;
  uid: string;
  applicationDate: string;
  listStatus: AdmissionListStatus;
};

export type AdminDashboardMetrics = {
  totalStudents: number;
  totalFeeReceivable: number;
  totalBillsPayable: number;
  totalBillsPaid: number;
};

export type IncomeExpensePoint = {
  month: string;
  income: number;
  expenses: number;
};

export type AdminDashboardOverview = {
  metrics: AdminDashboardMetrics;
  incomeVsExpenses: IncomeExpensePoint[];
  academicYear: string;
};

export type AdmissionListFilters = {
  classId?: string | undefined;
  academicYear?: string | undefined;
  search?: string | undefined;
  listStatus: AdmissionListStatus;
};

export type FeePaymentPayload = {
  studentId: string;
  amount: number;
  method: "cash" | "upi" | "card" | "bank_transfer";
  remarks?: string | undefined;
};

export type UpsertAdmissionPayload = Omit<
  StudentAdmissionRecord,
  "id" | "createdAt" | "updatedAt" | "listStatus"
> & {
  id?: string | undefined;
  listStatus?: AdmissionListStatus | undefined;
};

export type LookupOption = {
  value: string;
  label: string;
};
