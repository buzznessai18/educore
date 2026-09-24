import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

export function createAdminClient(): SupabaseClient {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type DbAdmission = {
  id: string;
  list_status: "applied" | "admitted";
  application_date: string;
  academic_year: string;
  registration_date: string | null;
  admission_start_date: string | null;
  program_track: "school" | "ug" | "pg";
  state: string;
  board_university: string;
  syllabus_branch: string;
  level_combination: string;
  class_id: string;
  section_id: string;
  admission_no: string;
  roll_no: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string | null;
  gender: "male" | "female" | "other";
  student_category: string;
  fees_category: string;
  quota: string;
  uid_number: string;
  sats_number: string;
  pen_number: string;
  student_email: string;
  religion: string;
  caste: string;
  sub_caste: string;
  blood_group: string;
  device_id: string;
  student_status: string;
  mother_tongue: string;
  place_of_birth: string;
  language_i: string;
  language_ii: string;
  previous_school: string;
  password_hash: string;
  photo_url: string | null;
  father: Record<string, string>;
  mother: Record<string, string>;
  home_address: string;
  postal_address: string;
  sms_number: string;
  siblings: unknown[];
  emergency_contacts: unknown[];
  referral_sources: string[];
  transport: { routeId?: string; months?: string[] };
  hostel: { hostelId?: string; roomType?: string; roomSharing?: string };
  created_at: string;
  updated_at: string;
};

function emptyParent() {
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

export function dbToApiRecord(row: DbAdmission) {
  const father = { ...emptyParent(), ...(row.father ?? {}) };
  const mother = { ...emptyParent(), ...(row.mother ?? {}) };

  return {
    id: row.id,
    listStatus: row.list_status,
    applicationDate: row.application_date,
    child: {
      registrationDate: row.registration_date ?? "",
      admissionStartDate: row.admission_start_date ?? "",
      programTrack: row.program_track,
      state: row.state,
      boardUniversity: row.board_university,
      syllabusBranch: row.syllabus_branch,
      levelCombination: row.level_combination,
      classId: row.class_id,
      sectionId: row.section_id,
      admissionNo: row.admission_no,
      rollNo: row.roll_no,
      firstName: row.first_name,
      middleName: row.middle_name,
      lastName: row.last_name,
      dateOfBirth: row.date_of_birth ?? "",
      gender: row.gender,
      studentCategory: row.student_category,
      feesCategory: row.fees_category,
      quota: row.quota,
      uidNumber: row.uid_number,
      satsNumber: row.sats_number,
      penNumber: row.pen_number,
      email: row.student_email,
      religion: row.religion,
      caste: row.caste,
      subCaste: row.sub_caste,
      bloodGroup: row.blood_group,
      deviceId: row.device_id,
      studentStatus: row.student_status,
      motherTongue: row.mother_tongue,
      placeOfBirth: row.place_of_birth,
      languageI: row.language_i,
      languageII: row.language_ii,
      previousSchool: row.previous_school,
      password: "",
      photoUrl: row.photo_url,
    },
    family: {
      father,
      mother,
      homeAddress: row.home_address,
      postalAddress: row.postal_address,
      smsNumber: row.sms_number,
      siblings: Array.isArray(row.siblings) ? row.siblings : [],
    },
    emergencyContacts: Array.isArray(row.emergency_contacts) ? row.emergency_contacts : [],
    referralSources: row.referral_sources ?? [],
    transport: {
      routeId: row.transport?.routeId ?? "none",
      months: row.transport?.months ?? [],
    },
    hostel: {
      hostelId: row.hostel?.hostelId ?? "none",
      roomType: row.hostel?.roomType ?? "",
      roomSharing: row.hostel?.roomSharing ?? "",
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function apiPayloadToDb(payload: Record<string, unknown>) {
  const child = (payload.child ?? {}) as Record<string, unknown>;
  const family = (payload.family ?? {}) as Record<string, unknown>;
  const transport = (payload.transport ?? {}) as Record<string, unknown>;
  const hostel = (payload.hostel ?? {}) as Record<string, unknown>;

  return {
    list_status: (payload.listStatus as string) ?? "applied",
    application_date: (payload.applicationDate as string) ?? new Date().toISOString().slice(0, 10),
    academic_year: (payload.academicYear as string) ?? "2026-27",
    registration_date: (child.registrationDate as string) || null,
    admission_start_date: (child.admissionStartDate as string) || null,
    program_track: (child.programTrack as string) ?? "school",
    state: (child.state as string) ?? "",
    board_university: (child.boardUniversity as string) ?? "",
    syllabus_branch: (child.syllabusBranch as string) ?? "",
    level_combination: (child.levelCombination as string) ?? "",
    class_id: (child.classId as string) ?? "",
    section_id: (child.sectionId as string) ?? "",
    admission_no: (child.admissionNo as string) ?? "",
    roll_no: (child.rollNo as string) ?? "",
    first_name: (child.firstName as string) ?? "",
    middle_name: (child.middleName as string) ?? "",
    last_name: (child.lastName as string) ?? "",
    date_of_birth: (child.dateOfBirth as string) || null,
    gender: (child.gender as string) ?? "male",
    student_category: (child.studentCategory as string) ?? "",
    fees_category: (child.feesCategory as string) ?? "",
    quota: (child.quota as string) ?? "",
    uid_number: (child.uidNumber as string) ?? "",
    sats_number: (child.satsNumber as string) ?? "",
    pen_number: (child.penNumber as string) ?? "",
    student_email: (child.email as string) ?? "",
    religion: (child.religion as string) ?? "",
    caste: (child.caste as string) ?? "",
    sub_caste: (child.subCaste as string) ?? "",
    blood_group: (child.bloodGroup as string) ?? "",
    device_id: (child.deviceId as string) ?? "",
    student_status: (child.studentStatus as string) ?? "draft",
    mother_tongue: (child.motherTongue as string) ?? "",
    place_of_birth: (child.placeOfBirth as string) ?? "",
    language_i: (child.languageI as string) ?? "",
    language_ii: (child.languageII as string) ?? "",
    previous_school: (child.previousSchool as string) ?? "",
    password_hash: "",
    photo_url: (child.photoUrl as string | null) ?? null,
    father: family.father ?? {},
    mother: family.mother ?? {},
    home_address: (family.homeAddress as string) ?? "",
    postal_address: (family.postalAddress as string) ?? "",
    sms_number: (family.smsNumber as string) ?? "",
    siblings: family.siblings ?? [],
    emergency_contacts: payload.emergencyContacts ?? [],
    referral_sources: payload.referralSources ?? [],
    transport: {
      routeId: (transport.routeId as string) ?? "none",
      months: (transport.months as string[]) ?? [],
    },
    hostel: {
      hostelId: (hostel.hostelId as string) ?? "none",
      roomType: (hostel.roomType as string) ?? "",
      roomSharing: (hostel.roomSharing as string) ?? "",
    },
  };
}

const classMap: Record<string, string> = {
  "class-8": "Class 8",
  "class-9": "Class 9",
  "class-10": "Class 10",
  "class-11": "Class 11",
  "class-12": "Class 12",
};

export function toListRow(row: DbAdmission, slNo: number) {
  const father = (row.father ?? {}) as Record<string, string>;
  return {
    id: row.id,
    slNo,
    studentName: [row.first_name, row.middle_name, row.last_name].filter(Boolean).join(" "),
    semesterClassSection: `${classMap[row.class_id] ?? row.class_id} / ${(row.section_id || "-").toUpperCase()}`,
    admissionNo: row.admission_no,
    quota: row.quota,
    fatherName: [father.firstName, father.middleName, father.lastName].filter(Boolean).join(" ") || "—",
    uid: row.uid_number || "—",
    applicationDate: row.application_date,
    listStatus: row.list_status,
  };
}
