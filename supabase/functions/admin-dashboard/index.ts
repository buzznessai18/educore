import { handleOptions, jsonResponse } from "../_shared/http.ts";
import { createAdminClient } from "../_shared/admissions.ts";

export default {
  async fetch(req: Request) {
    const preflight = handleOptions(req);
    if (preflight) return preflight;

    if (req.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    try {
      const supabase = createAdminClient();
      const url = new URL(req.url);
      const academicYear = url.searchParams.get("academicYear") ?? "2026-27";

      const [{ data: metrics, error: metricsError }, { data: monthly, error: monthlyError }] =
        await Promise.all([
          supabase
            .from("dashboard_metrics")
            .select("*")
            .eq("academic_year", academicYear)
            .maybeSingle(),
          supabase
            .from("financial_monthly_stats")
            .select("month_label, income, expenses, month_order")
            .eq("academic_year", academicYear)
            .order("month_order", { ascending: true }),
        ]);

      if (metricsError) throw metricsError;
      if (monthlyError) throw monthlyError;

      const studentCount = await supabase
        .from("student_admissions")
        .select("id", { count: "exact", head: true });

      return jsonResponse({
        academicYear,
        metrics: {
          totalStudents: studentCount.count ?? metrics?.total_students ?? 0,
          totalFeeReceivable: Number(metrics?.total_fee_receivable ?? 0),
          totalBillsPayable: Number(metrics?.total_bills_payable ?? 0),
          totalBillsPaid: Number(metrics?.total_bills_paid ?? 0),
        },
        incomeVsExpenses: (monthly ?? []).map((row) => ({
          month: row.month_label,
          income: Number(row.income),
          expenses: Number(row.expenses),
        })),
      });
    } catch (error) {
      console.error("admin-dashboard error", error);
      return jsonResponse(
        { error: error instanceof Error ? error.message : "Failed to load dashboard" },
        500,
      );
    }
  },
};
