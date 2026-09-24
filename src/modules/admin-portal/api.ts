import { supabase } from "@/lib/supabase";
import {
  mockAdmissionRecords,
  mockDashboardOverview,
  toAdmissionListRow,
} from "./mock-data";
import type { AdmissionFormValues } from "./schemas";
import type {
  AdminDashboardOverview,
  AdmissionListFilters,
  AdmissionListRow,
  FeePaymentPayload,
  StudentAdmissionRecord,
  UpsertAdmissionPayload,
} from "./types";

const delay = (ms = 280) => new Promise((resolve) => setTimeout(resolve, ms));

/** In-memory fallback when Supabase is unavailable. */
let localRecords: StudentAdmissionRecord[] = [...mockAdmissionRecords];

function clone<T>(value: T): T {
  return structuredClone(value);
}

function isSupabaseConfigured() {
  const url = import.meta.env["VITE_SUPABASE_URL"];
  const key = import.meta.env["VITE_SUPABASE_ANON_KEY"];
  return Boolean(url && key && String(url).includes("supabase.co"));
}

async function callEdgeFunction<T>(
  name: string,
  options?: {
    method?: "GET" | "POST";
    query?: Record<string, string | undefined>;
    body?: unknown;
  },
): Promise<T> {
  const method = options?.method ?? "GET";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(options?.query ?? {})) {
    if (value) params.set(key, value);
  }
  const queryString = params.toString();
  const functionPath = queryString ? `${name}?${queryString}` : name;

  const { data, error } = await supabase.functions.invoke(functionPath, {
    method,
    body: method === "GET" ? undefined : (options?.body ?? {}),
  });

  if (error) {
    throw new Error(error.message || `Edge function ${name} failed`);
  }

  if (data && typeof data === "object" && "error" in data && (data as { error?: unknown }).error) {
    throw new Error(String((data as { error: string }).error));
  }

  return data as T;
}

const mockApi = {
  async getDashboardOverview(): Promise<AdminDashboardOverview> {
    await delay();
    return clone(mockDashboardOverview);
  },

  async listAdmissions(filters: AdmissionListFilters): Promise<AdmissionListRow[]> {
    await delay();
    const search = filters.search?.trim().toLowerCase() ?? "";
    const filtered = localRecords.filter((record) => {
      if (record.listStatus !== filters.listStatus) return false;
      if (filters.classId && record.child.classId !== filters.classId) return false;
      if (search) {
        const haystack = [
          record.child.firstName,
          record.child.middleName,
          record.child.lastName,
          record.child.admissionNo,
          record.child.uidNumber,
          record.family.father.firstName,
          record.family.father.lastName,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
    return filtered.map((record, index) => toAdmissionListRow(record, index + 1));
  },

  async getAdmissionById(id: string): Promise<StudentAdmissionRecord | null> {
    await delay();
    const record = localRecords.find((item) => item.id === id);
    return record ? clone(record) : null;
  },

  async upsertAdmission(payload: UpsertAdmissionPayload): Promise<StudentAdmissionRecord> {
    await delay(400);
    const now = new Date().toISOString();

    if (payload.id) {
      const index = localRecords.findIndex((item) => item.id === payload.id);
      if (index === -1) throw new Error("Student record not found");
      const existing = localRecords[index];
      if (!existing) throw new Error("Student record not found");
      const updated: StudentAdmissionRecord = {
        ...existing,
        applicationDate: payload.applicationDate,
        child: payload.child,
        family: payload.family,
        emergencyContacts: payload.emergencyContacts,
        referralSources: payload.referralSources,
        transport: payload.transport,
        hostel: payload.hostel,
        id: payload.id,
        listStatus: payload.listStatus ?? existing.listStatus,
        updatedAt: now,
        createdAt: existing.createdAt,
      };
      localRecords[index] = updated;
      return clone(updated);
    }

    const created: StudentAdmissionRecord = {
      id: `stu-${Date.now()}`,
      listStatus: payload.listStatus ?? "applied",
      applicationDate: payload.applicationDate,
      child: payload.child,
      family: payload.family,
      emergencyContacts: payload.emergencyContacts,
      referralSources: payload.referralSources,
      transport: payload.transport,
      hostel: payload.hostel,
      createdAt: now,
      updatedAt: now,
    };
    localRecords = [created, ...localRecords];
    return clone(created);
  },

  async recordFeePayment(payload: FeePaymentPayload): Promise<{ ok: true; receiptId: string }> {
    await delay(350);
    if (!localRecords.some((item) => item.id === payload.studentId)) {
      throw new Error("Student not found for payment");
    }
    return { ok: true, receiptId: `RCP-${Date.now()}` };
  },
};

const supabaseApi = {
  async getDashboardOverview(): Promise<AdminDashboardOverview> {
    return callEdgeFunction<AdminDashboardOverview>("admin-dashboard", {
      method: "GET",
      query: { academicYear: "2026-27" },
    });
  },

  async listAdmissions(filters: AdmissionListFilters): Promise<AdmissionListRow[]> {
    const response = await callEdgeFunction<{ data: AdmissionListRow[] }>("admissions", {
      method: "GET",
      query: {
        listStatus: filters.listStatus,
        classId: filters.classId,
        academicYear: filters.academicYear,
        search: filters.search,
      },
    });
    return response.data ?? [];
  },

  async getAdmissionById(id: string): Promise<StudentAdmissionRecord | null> {
    const response = await callEdgeFunction<{ data: StudentAdmissionRecord }>("admissions", {
      method: "GET",
      query: { id },
    });
    return response.data ?? null;
  },

  async upsertAdmission(payload: UpsertAdmissionPayload): Promise<StudentAdmissionRecord> {
    const response = await callEdgeFunction<{ data: StudentAdmissionRecord }>("admissions", {
      method: "POST",
      body: payload,
    });
    return response.data;
  },

  async recordFeePayment(payload: FeePaymentPayload): Promise<{ ok: true; receiptId: string }> {
    return callEdgeFunction<{ ok: true; receiptId: string }>("fee-payments", {
      method: "POST",
      body: payload,
    });
  },
};

async function withFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>,
): Promise<T> {
  if (!isSupabaseConfigured()) {
    return fallback();
  }
  try {
    return await primary();
  } catch (error) {
    console.warn("[admin-portal] Supabase unavailable, using local mock", error);
    return fallback();
  }
}

export const adminPortalApi = {
  getDashboardOverview: () =>
    withFallback(
      () => supabaseApi.getDashboardOverview(),
      () => mockApi.getDashboardOverview(),
    ),
  listAdmissions: (filters: AdmissionListFilters) =>
    withFallback(
      () => supabaseApi.listAdmissions(filters),
      () => mockApi.listAdmissions(filters),
    ),
  getAdmissionById: (id: string) =>
    withFallback(
      () => supabaseApi.getAdmissionById(id),
      () => mockApi.getAdmissionById(id),
    ),
  upsertAdmission: (payload: UpsertAdmissionPayload) =>
    withFallback(
      () => supabaseApi.upsertAdmission(payload),
      () => mockApi.upsertAdmission(payload),
    ),
  recordFeePayment: (payload: FeePaymentPayload) =>
    withFallback(
      () => supabaseApi.recordFeePayment(payload),
      () => mockApi.recordFeePayment(payload),
    ),
};

export function recordToFormValues(record: StudentAdmissionRecord): AdmissionFormValues {
  return {
    applicationDate: record.applicationDate,
    listStatus: record.listStatus,
    child: record.child,
    family: record.family,
    emergencyContacts: record.emergencyContacts,
    referralSources: record.referralSources,
    transport: record.transport,
    hostel: record.hostel,
  };
}
