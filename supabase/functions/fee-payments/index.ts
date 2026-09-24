import { handleOptions, jsonResponse } from "../_shared/http.ts";
import { createAdminClient } from "../_shared/admissions.ts";

export default {
  async fetch(req: Request) {
    const preflight = handleOptions(req);
    if (preflight) return preflight;

    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    try {
      const supabase = createAdminClient();
      const body = await req.json();
      const studentId = body.studentId as string | undefined;
      const amount = Number(body.amount);
      const method = body.method as string | undefined;
      const remarks = (body.remarks as string | undefined) ?? "";

      if (!studentId || !method || !Number.isFinite(amount) || amount <= 0) {
        return jsonResponse({ error: "Invalid payment payload" }, 400);
      }

      const { data: student, error: studentError } = await supabase
        .from("student_admissions")
        .select("id")
        .eq("id", studentId)
        .maybeSingle();

      if (studentError) throw studentError;
      if (!student) return jsonResponse({ error: "Student not found for payment" }, 404);

      const receiptId = `RCP-${Date.now()}`;
      const { data, error } = await supabase
        .from("fee_payments")
        .insert({
          receipt_id: receiptId,
          student_id: studentId,
          amount,
          method,
          remarks,
        })
        .select("receipt_id")
        .single();

      if (error) throw error;

      // Keep dashboard paid total roughly in sync for the active year.
      const { data: metrics } = await supabase
        .from("dashboard_metrics")
        .select("id, total_bills_paid")
        .eq("academic_year", "2026-27")
        .maybeSingle();

      if (metrics) {
        await supabase
          .from("dashboard_metrics")
          .update({
            total_bills_paid: Number(metrics.total_bills_paid) + amount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", metrics.id);
      }

      return jsonResponse({ ok: true, receiptId: data.receipt_id }, 201);
    } catch (error) {
      console.error("fee-payments error", error);
      return jsonResponse(
        { error: error instanceof Error ? error.message : "Payment failed" },
        500,
      );
    }
  },
};
