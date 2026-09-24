import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminPortalApi, recordToFormValues } from "./api";
import type { AdmissionFormValues } from "./schemas";
import type { AdmissionListFilters, FeePaymentPayload, UpsertAdmissionPayload } from "./types";

export const adminPortalKeys = {
  all: ["admin-portal"] as const,
  dashboard: () => [...adminPortalKeys.all, "dashboard"] as const,
  admissions: (filters: AdmissionListFilters) =>
    [...adminPortalKeys.all, "admissions", filters] as const,
  admission: (id: string) => [...adminPortalKeys.all, "admission", id] as const,
};

export function useAdminDashboard() {
  return useQuery({
    queryKey: adminPortalKeys.dashboard(),
    queryFn: () => adminPortalApi.getDashboardOverview(),
  });
}

export function useAdmissionList(filters: AdmissionListFilters) {
  return useQuery({
    queryKey: adminPortalKeys.admissions(filters),
    queryFn: () => adminPortalApi.listAdmissions(filters),
  });
}

export function useAdmissionRecord(id: string | undefined) {
  return useQuery({
    queryKey: adminPortalKeys.admission(id ?? "new"),
    queryFn: async () => {
      if (!id) return null;
      return adminPortalApi.getAdmissionById(id);
    },
    enabled: Boolean(id),
  });
}

export function useUpsertAdmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertAdmissionPayload) => adminPortalApi.upsertAdmission(payload),
    onSuccess: (record) => {
      void queryClient.invalidateQueries({ queryKey: adminPortalKeys.all });
      queryClient.setQueryData(adminPortalKeys.admission(record.id), record);
    },
  });
}

export function useFeePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FeePaymentPayload) => adminPortalApi.recordFeePayment(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminPortalKeys.dashboard() });
    },
  });
}

export function useAdmissionFormDefaults(id: string | undefined) {
  const query = useAdmissionRecord(id);
  const values: AdmissionFormValues | undefined = query.data
    ? recordToFormValues(query.data)
    : undefined;
  return { ...query, formValues: values };
}
