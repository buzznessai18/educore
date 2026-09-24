# Supabase Admin Portal

## Schema

Migration: `migrations/20260918140000_admin_portal_schema.sql`

| Table | Purpose |
|---|---|
| `profiles` | User profile linked to `auth.users` |
| `user_roles` | Roles: super_admin, admin, staff_admin, teacher, parent |
| `student_admissions` | Applied / admitted student registration records |
| `fee_payments` | Fee collection receipts |
| `dashboard_metrics` | KPI totals per academic year |
| `financial_monthly_stats` | Income vs expenses chart series |

RLS is enabled. Staff helpers: `has_role()`, `is_staff()`.

## Edge functions

| Function | Methods | Purpose |
|---|---|---|
| `admin-dashboard` | GET `?academicYear=` | Metrics + monthly financials |
| `admissions` | GET list / GET `?id=` / POST upsert | Admission CRUD |
| `fee-payments` | POST | Record fee payment |

Functions use the service role for DB writes. Callers authenticate with the project anon/user JWT via `supabase.functions.invoke` (default JWT verification stays on).

## Frontend wiring

`src/modules/admin-portal/api.ts` calls these functions and falls back to local mock data if Supabase is unreachable.

## Deploy

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
npx supabase functions deploy admin-dashboard
npx supabase functions deploy admissions
npx supabase functions deploy fee-payments
```

Required app env:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```
