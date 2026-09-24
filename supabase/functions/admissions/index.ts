import { handleOptions, jsonResponse } from "../_shared/http.ts";
import {
  apiPayloadToDb,
  createAdminClient,
  dbToApiRecord,
  toListRow,
  type DbAdmission,
} from "../_shared/admissions.ts";

export default {
  async fetch(req: Request) {
    const preflight = handleOptions(req);
    if (preflight) return preflight;

    try {
      const supabase = createAdminClient();
      const url = new URL(req.url);
      const recordId = url.searchParams.get("id");

      if (req.method === "GET" && recordId) {
        const { data, error } = await supabase
          .from("student_admissions")
          .select("*")
          .eq("id", recordId)
          .maybeSingle();
        if (error) throw error;
        if (!data) return jsonResponse({ error: "Not found" }, 404);
        return jsonResponse({ data: dbToApiRecord(data as DbAdmission) });
      }

      if (req.method === "GET") {
        const listStatus = url.searchParams.get("listStatus") ?? "applied";
        const classId = url.searchParams.get("classId");
        const academicYear = url.searchParams.get("academicYear");
        const search = url.searchParams.get("search")?.trim().toLowerCase() ?? "";

        let query = supabase
          .from("student_admissions")
          .select("*")
          .eq("list_status", listStatus)
          .order("application_date", { ascending: false });

        if (classId) query = query.eq("class_id", classId);
        if (academicYear) query = query.eq("academic_year", academicYear);

        const { data, error } = await query;
        if (error) throw error;

        let rows = (data ?? []) as DbAdmission[];
        if (search) {
          rows = rows.filter((row) => {
            const father = (row.father ?? {}) as Record<string, string>;
            const haystack = [
              row.first_name,
              row.middle_name,
              row.last_name,
              row.admission_no,
              row.uid_number,
              father.firstName,
              father.lastName,
            ]
              .join(" ")
              .toLowerCase();
            return haystack.includes(search);
          });
        }

        return jsonResponse({
          data: rows.map((row, index) => toListRow(row, index + 1)),
        });
      }

      if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
        const body = await req.json();
        const payloadId = (body.id as string | undefined) ?? recordId ?? undefined;
        const dbRow = apiPayloadToDb(body);

        if (payloadId) {
          const { data, error } = await supabase
            .from("student_admissions")
            .update(dbRow)
            .eq("id", payloadId)
            .select("*")
            .single();
          if (error) throw error;
          return jsonResponse({ data: dbToApiRecord(data as DbAdmission) });
        }

        const { data, error } = await supabase
          .from("student_admissions")
          .insert(dbRow)
          .select("*")
          .single();
        if (error) throw error;
        return jsonResponse({ data: dbToApiRecord(data as DbAdmission) }, 201);
      }

      return jsonResponse({ error: "Method not allowed" }, 405);
    } catch (error) {
      console.error("admissions error", error);
      return jsonResponse(
        { error: error instanceof Error ? error.message : "Admissions request failed" },
        500,
      );
    }
  },
};
