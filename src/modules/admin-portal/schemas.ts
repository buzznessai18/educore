import { z } from "zod";

const parentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string(),
  lastName: z.string().min(1, "Last name is required"),
  occupation: z.string(),
  employer: z.string(),
  mobileNo: z.string().min(10, "Enter a valid mobile number"),
  workPhone: z.string(),
  otherPhone: z.string(),
  email: z.union([z.literal(""), z.string().email("Enter a valid email")]),
});

const siblingSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Sibling name is required"),
  className: z.string(),
  dateOfBirth: z.string(),
});

const emergencyContactSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Contact name is required"),
  phone: z.string().min(10, "Enter a valid phone number"),
  relationship: z.string().min(1, "Relationship is required"),
});

export const childInformationSchema = z.object({
  registrationDate: z.string().min(1, "Registration date is required"),
  admissionStartDate: z.string().min(1, "Admission start date is required"),
  programTrack: z.enum(["school", "ug", "pg"]),
  state: z.string().min(1, "State is required"),
  boardUniversity: z.string().min(1, "Board/University is required"),
  syllabusBranch: z.string(),
  levelCombination: z.string(),
  classId: z.string().min(1, "Class is required"),
  sectionId: z.string().min(1, "Section is required"),
  admissionNo: z.string().min(1, "Admission number is required"),
  rollNo: z.string(),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string(),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  studentCategory: z.string().min(1, "Student category is required"),
  feesCategory: z.string().min(1, "Fees category is required"),
  quota: z.string().min(1, "Quota is required"),
  uidNumber: z.string(),
  satsNumber: z.string(),
  penNumber: z.string(),
  email: z.union([z.literal(""), z.string().email("Enter a valid student email")]),
  religion: z.string(),
  caste: z.string(),
  subCaste: z.string(),
  bloodGroup: z.string(),
  deviceId: z.string(),
  studentStatus: z.enum(["regular", "tc", "withhold", "left", "alumni", "draft"]),
  motherTongue: z.string(),
  placeOfBirth: z.string(),
  languageI: z.string(),
  languageII: z.string(),
  previousSchool: z.string(),
  password: z.union([z.literal(""), z.string().min(6, "Password must be at least 6 characters")]),
  photoUrl: z.string().nullable(),
});

export const familyInformationSchema = z.object({
  father: parentSchema,
  mother: parentSchema,
  homeAddress: z.string().min(1, "Home address is required"),
  postalAddress: z.string(),
  smsNumber: z.string().min(10, "SMS number is required"),
  siblings: z.array(siblingSchema),
});

export const admissionFormSchema = z.object({
  child: childInformationSchema,
  family: familyInformationSchema,
  emergencyContacts: z.array(emergencyContactSchema).min(1, "Add at least one emergency contact"),
  referralSources: z.array(
    z.enum(["friend", "radio", "web", "newspaper_magazine", "others"]),
  ),
  transport: z.object({
    routeId: z.string(),
    months: z.array(
      z.enum([
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
        "january",
        "february",
        "march",
      ]),
    ),
  }),
  hostel: z.object({
    hostelId: z.string(),
    roomType: z.string(),
    roomSharing: z.string(),
  }),
  applicationDate: z.string().min(1),
  listStatus: z.enum(["applied", "admitted"]),
});

export type AdmissionFormValues = z.infer<typeof admissionFormSchema>;

export const feePaymentSchema = z.object({
  studentId: z.string().min(1),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  method: z.enum(["cash", "upi", "card", "bank_transfer"]),
  remarks: z.string(),
});

export type FeePaymentFormValues = z.infer<typeof feePaymentSchema>;

export function createEmptyParent() {
  return {
    firstName: "",
    middleName: "",
    lastName: "",
    occupation: "",
    employer: "",
    mobileNo: "",
    workPhone: "",
    otherPhone: "",
    email: "",
  };
}

export function createEmptyAdmissionForm(): AdmissionFormValues {
  const today = new Date().toISOString().slice(0, 10);
  return {
    applicationDate: today,
    listStatus: "applied",
    child: {
      registrationDate: today,
      admissionStartDate: today,
      programTrack: "school",
      state: "",
      boardUniversity: "",
      syllabusBranch: "",
      levelCombination: "",
      classId: "",
      sectionId: "",
      admissionNo: "",
      rollNo: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "male",
      studentCategory: "",
      feesCategory: "",
      quota: "",
      uidNumber: "",
      satsNumber: "",
      penNumber: "",
      email: "",
      religion: "",
      caste: "",
      subCaste: "",
      bloodGroup: "",
      deviceId: "",
      studentStatus: "draft",
      motherTongue: "",
      placeOfBirth: "",
      languageI: "",
      languageII: "",
      previousSchool: "",
      password: "",
      photoUrl: null,
    },
    family: {
      father: createEmptyParent(),
      mother: createEmptyParent(),
      homeAddress: "",
      postalAddress: "",
      smsNumber: "",
      siblings: [],
    },
    emergencyContacts: [{ id: `ec-${Date.now()}`, name: "", phone: "", relationship: "" }],
    referralSources: [],
    transport: { routeId: "none", months: [] },
    hostel: { hostelId: "none", roomType: "", roomSharing: "" },
  };
}
