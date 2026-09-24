-- EduCore Admin Portal schema: roles, admissions, fees, dashboard metrics

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.app_role as enum (
  'super_admin',
  'admin',
  'staff_admin',
  'teacher',
  'parent'
);

create type public.admission_list_status as enum ('applied', 'admitted');

create type public.student_status as enum (
  'regular',
  'tc',
  'withhold',
  'left',
  'alumni',
  'draft'
);

create type public.gender as enum ('male', 'female', 'other');

create type public.program_track as enum ('school', 'ug', 'pg');

create type public.payment_method as enum ('cash', 'upi', 'card', 'bank_transfer');

-- ---------------------------------------------------------------------------
-- Profiles & roles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create index user_roles_user_id_idx on public.user_roles (user_id);
create index user_roles_role_idx on public.user_roles (role);

-- ---------------------------------------------------------------------------
-- Student admissions (searchable columns + jsonb nested sections)
-- ---------------------------------------------------------------------------
create table public.student_admissions (
  id uuid primary key default gen_random_uuid(),
  list_status public.admission_list_status not null default 'applied',
  application_date date not null default current_date,
  academic_year text not null default '2026-27',

  registration_date date,
  admission_start_date date,
  program_track public.program_track not null default 'school',
  state text not null default '',
  board_university text not null default '',
  syllabus_branch text not null default '',
  level_combination text not null default '',
  class_id text not null default '',
  section_id text not null default '',
  admission_no text not null,
  roll_no text not null default '',
  first_name text not null,
  middle_name text not null default '',
  last_name text not null,
  date_of_birth date,
  gender public.gender not null default 'male',
  student_category text not null default '',
  fees_category text not null default '',
  quota text not null default '',
  uid_number text not null default '',
  sats_number text not null default '',
  pen_number text not null default '',
  student_email text not null default '',
  religion text not null default '',
  caste text not null default '',
  sub_caste text not null default '',
  blood_group text not null default '',
  device_id text not null default '',
  student_status public.student_status not null default 'draft',
  mother_tongue text not null default '',
  place_of_birth text not null default '',
  language_i text not null default '',
  language_ii text not null default '',
  previous_school text not null default '',
  password_hash text not null default '',
  photo_url text,

  father jsonb not null default '{}'::jsonb,
  mother jsonb not null default '{}'::jsonb,
  home_address text not null default '',
  postal_address text not null default '',
  sms_number text not null default '',
  siblings jsonb not null default '[]'::jsonb,
  emergency_contacts jsonb not null default '[]'::jsonb,
  referral_sources text[] not null default '{}',
  transport jsonb not null default '{"routeId":"none","months":[]}'::jsonb,
  hostel jsonb not null default '{"hostelId":"none","roomType":"","roomSharing":""}'::jsonb,

  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint student_admissions_admission_no_key unique (admission_no)
);

create index student_admissions_list_status_idx on public.student_admissions (list_status);
create index student_admissions_class_id_idx on public.student_admissions (class_id);
create index student_admissions_academic_year_idx on public.student_admissions (academic_year);
create index student_admissions_uid_number_idx on public.student_admissions (uid_number);
create index student_admissions_name_idx on public.student_admissions (last_name, first_name);
create index student_admissions_search_idx on public.student_admissions
  using gin (
    to_tsvector(
      'english',
      coalesce(first_name, '') || ' ' ||
      coalesce(middle_name, '') || ' ' ||
      coalesce(last_name, '') || ' ' ||
      coalesce(admission_no, '') || ' ' ||
      coalesce(uid_number, '')
    )
  );

-- ---------------------------------------------------------------------------
-- Fee payments
-- ---------------------------------------------------------------------------
create table public.fee_payments (
  id uuid primary key default gen_random_uuid(),
  receipt_id text not null unique,
  student_id uuid not null references public.student_admissions (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  method public.payment_method not null,
  remarks text not null default '',
  paid_at timestamptz not null default now(),
  recorded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index fee_payments_student_id_idx on public.fee_payments (student_id);
create index fee_payments_paid_at_idx on public.fee_payments (paid_at desc);

-- ---------------------------------------------------------------------------
-- Dashboard financial metrics
-- ---------------------------------------------------------------------------
create table public.dashboard_metrics (
  id uuid primary key default gen_random_uuid(),
  academic_year text not null unique,
  total_students integer not null default 0,
  total_fee_receivable numeric(14, 2) not null default 0,
  total_bills_payable numeric(14, 2) not null default 0,
  total_bills_paid numeric(14, 2) not null default 0,
  updated_at timestamptz not null default now()
);

create table public.financial_monthly_stats (
  id uuid primary key default gen_random_uuid(),
  academic_year text not null,
  month_label text not null,
  month_order smallint not null check (month_order between 1 and 12),
  income numeric(14, 2) not null default 0,
  expenses numeric(14, 2) not null default 0,
  unique (academic_year, month_order)
);

create index financial_monthly_stats_year_idx on public.financial_monthly_stats (academic_year, month_order);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger student_admissions_set_updated_at
before update on public.student_admissions
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1), ''),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role in ('super_admin', 'admin', 'staff_admin')
  );
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.student_admissions enable row level security;
alter table public.fee_payments enable row level security;
alter table public.dashboard_metrics enable row level security;
alter table public.financial_monthly_stats enable row level security;

create policy "Users can view own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Staff can view all profiles"
on public.profiles for select
to authenticated
using (public.is_staff(auth.uid()));

create policy "Users can view own roles"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id);

create policy "Super admin can manage roles"
on public.user_roles for all
to authenticated
using (public.has_role(auth.uid(), 'super_admin'))
with check (public.has_role(auth.uid(), 'super_admin'));

create policy "Staff can read admissions"
on public.student_admissions for select
to authenticated
using (public.is_staff(auth.uid()) or public.has_role(auth.uid(), 'teacher'));

create policy "Staff can insert admissions"
on public.student_admissions for insert
to authenticated
with check (public.is_staff(auth.uid()));

create policy "Staff can update admissions"
on public.student_admissions for update
to authenticated
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "Admin can delete admissions"
on public.student_admissions for delete
to authenticated
using (
  public.has_role(auth.uid(), 'super_admin')
  or public.has_role(auth.uid(), 'admin')
);

create policy "Staff can read fee payments"
on public.fee_payments for select
to authenticated
using (public.is_staff(auth.uid()));

create policy "Staff can insert fee payments"
on public.fee_payments for insert
to authenticated
with check (public.is_staff(auth.uid()));

create policy "Staff can read dashboard metrics"
on public.dashboard_metrics for select
to authenticated
using (public.is_staff(auth.uid()) or public.has_role(auth.uid(), 'teacher'));

create policy "Admins can manage dashboard metrics"
on public.dashboard_metrics for all
to authenticated
using (
  public.has_role(auth.uid(), 'super_admin')
  or public.has_role(auth.uid(), 'admin')
)
with check (
  public.has_role(auth.uid(), 'super_admin')
  or public.has_role(auth.uid(), 'admin')
);

create policy "Staff can read monthly financials"
on public.financial_monthly_stats for select
to authenticated
using (public.is_staff(auth.uid()));

create policy "Admins can manage monthly financials"
on public.financial_monthly_stats for all
to authenticated
using (
  public.has_role(auth.uid(), 'super_admin')
  or public.has_role(auth.uid(), 'admin')
)
with check (
  public.has_role(auth.uid(), 'super_admin')
  or public.has_role(auth.uid(), 'admin')
);

-- ---------------------------------------------------------------------------
-- Seed dashboard + sample admissions (idempotent-ish via fixed admission_no)
-- ---------------------------------------------------------------------------
insert into public.dashboard_metrics (
  academic_year,
  total_students,
  total_fee_receivable,
  total_bills_payable,
  total_bills_paid
) values (
  '2026-27',
  307,
  4021000,
  0,
  0
)
on conflict (academic_year) do update set
  total_students = excluded.total_students,
  total_fee_receivable = excluded.total_fee_receivable,
  total_bills_payable = excluded.total_bills_payable,
  total_bills_paid = excluded.total_bills_paid,
  updated_at = now();

insert into public.financial_monthly_stats (academic_year, month_label, month_order, income, expenses)
values
  ('2026-27', 'Jan', 1, 0, 0),
  ('2026-27', 'Feb', 2, 0, 0),
  ('2026-27', 'Mar', 3, 0, 0),
  ('2026-27', 'Apr', 4, 80000, 45000),
  ('2026-27', 'May', 5, 320000, 120000),
  ('2026-27', 'Jun', 6, 1350000, 280000),
  ('2026-27', 'Jul', 7, 150000, 95000),
  ('2026-27', 'Aug', 8, 20000, 40000),
  ('2026-27', 'Sep', 9, 0, 0),
  ('2026-27', 'Oct', 10, 0, 0),
  ('2026-27', 'Nov', 11, 0, 0),
  ('2026-27', 'Dec', 12, 0, 0)
on conflict (academic_year, month_order) do update set
  income = excluded.income,
  expenses = excluded.expenses,
  month_label = excluded.month_label;

insert into public.student_admissions (
  list_status, application_date, academic_year,
  registration_date, admission_start_date, program_track, state, board_university,
  class_id, section_id, admission_no, roll_no,
  first_name, last_name, date_of_birth, gender,
  student_category, fees_category, quota, uid_number, student_status,
  father, mother, home_address, sms_number, emergency_contacts
) values
(
  'applied', '2026-08-12', '2026-27',
  '2026-08-12', '2026-09-01', 'school', 'karnataka', 'cbse',
  'class-10', 'a', 'APP-2026-0142', '',
  'Ananya', 'Sharma', '2011-04-18', 'female',
  'general', 'full', 'general', 'UID-88421', 'draft',
  '{"firstName":"Rajesh","middleName":"","lastName":"Sharma","occupation":"","employer":"","mobileNo":"9876543210","workPhone":"","otherPhone":"","email":"rajesh.sharma@email.com"}'::jsonb,
  '{}'::jsonb,
  '12 Residency Road, Bengaluru',
  '9876543210',
  '[{"id":"ec-1","name":"Rajesh Sharma","phone":"9876543210","relationship":"Father"}]'::jsonb
),
(
  'applied', '2026-08-18', '2026-27',
  '2026-08-18', '2026-09-01', 'school', 'maharashtra', 'cbse',
  'class-9', 'b', 'APP-2026-0158', '',
  'Kabir', 'Patel', '2012-01-09', 'male',
  'general', 'full', 'management', 'UID-88502', 'draft',
  '{"firstName":"Amit","middleName":"","lastName":"Patel","occupation":"","employer":"","mobileNo":"9988776655","workPhone":"","otherPhone":"","email":""}'::jsonb,
  '{}'::jsonb,
  '44 Lake View, Pune',
  '9988776655',
  '[{"id":"ec-2","name":"Amit Patel","phone":"9988776655","relationship":"Father"}]'::jsonb
),
(
  'admitted', '2026-07-02', '2026-27',
  '2026-07-02', '2026-07-15', 'school', 'karnataka', 'cbse',
  'class-11', 'a', 'ADM-2026-0041', '11A-12',
  'Meera', 'Iyer', '2010-11-22', 'female',
  'general', 'scholarship', 'general', 'UID-87110', 'regular',
  '{"firstName":"Suresh","middleName":"","lastName":"Iyer","occupation":"","employer":"","mobileNo":"9123456780","workPhone":"","otherPhone":"","email":"suresh.iyer@email.com"}'::jsonb,
  '{"firstName":"Lakshmi","middleName":"","lastName":"Iyer","occupation":"","employer":"","mobileNo":"9123456781","workPhone":"","otherPhone":"","email":""}'::jsonb,
  '8 Temple Street, Mysuru',
  '9123456780',
  '[{"id":"ec-3","name":"Suresh Iyer","phone":"9123456780","relationship":"Father"}]'::jsonb
),
(
  'admitted', '2026-06-21', '2026-27',
  '2026-06-21', '2026-07-01', 'school', 'karnataka', 'state',
  'class-8', 'c', 'ADM-2026-0028', '8C-05',
  'Arjun', 'Reddy', '2013-03-14', 'male',
  'obc', 'concession', 'sports', 'UID-86990', 'regular',
  '{"firstName":"Venkat","middleName":"","lastName":"Reddy","occupation":"","employer":"","mobileNo":"9001122334","workPhone":"","otherPhone":"","email":""}'::jsonb,
  '{}'::jsonb,
  '21 Ring Road, Hubballi',
  '9001122334',
  '[{"id":"ec-4","name":"Venkat Reddy","phone":"9001122334","relationship":"Father"}]'::jsonb
),
(
  'admitted', '2026-06-10', '2026-27',
  '2026-06-10', '2026-06-20', 'school', 'delhi', 'cbse',
  'class-12', 'b', 'ADM-2026-0015', '12B-03',
  'Sara', 'Khan', '2009-09-05', 'female',
  'general', 'full', 'rte', 'UID-86001', 'regular',
  '{"firstName":"Imran","middleName":"","lastName":"Khan","occupation":"","employer":"","mobileNo":"9811122233","workPhone":"","otherPhone":"","email":""}'::jsonb,
  '{}'::jsonb,
  '5 Green Park, New Delhi',
  '9811122233',
  '[{"id":"ec-5","name":"Imran Khan","phone":"9811122233","relationship":"Father"}]'::jsonb
)
on conflict (admission_no) do nothing;
