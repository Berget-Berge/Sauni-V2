-- Fjordbu Sauna — Supabase schema, RLS and seed data
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query)
-- against project https://hgwpkduqtbcvnsfaxqaz.supabase.co
--
-- Table/column names follow the exact contract in
-- "PROMPT - Fjordbu Sauna backend.md" — do not rename or add columns
-- without updating src/lib/database.types.ts to match.
--
-- This script is safe to re-run: it drops and recreates its own tables
-- first, so a table left over from an earlier/partial setup (e.g. missing
-- a column like sort_order) can't cause "column ... does not exist"
-- errors later. Only run this on a project with no real bookings yet —
-- re-running it deletes any rows already in these tables.

create extension if not exists pgcrypto; -- for gen_random_uuid()

-- ============================================================
-- RESET — drop anything left over from an earlier setup attempt so the
-- CREATE TABLE statements below always produce the exact contract.
-- ============================================================
drop view if exists clinic_settings_public;
drop function if exists get_booked_slots(date, date);
drop function if exists is_admin();
drop table if exists appointments cascade;
drop table if exists services cascade;
drop table if exists business_hours cascade;
drop table if exists blocked_dates cascade;
drop table if exists clinic_settings cascade;
drop table if exists faq cascade;
drop table if exists rules cascade;
drop table if exists admin_users cascade;

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration_minutes int not null,
  price numeric not null,
  max_guests int not null default 6,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  service_id uuid not null references services(id),
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  guests int not null,
  payment_method text not null check (payment_method in ('vipps','card')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','refunded','failed')),
  payment_reference text,
  access_code text,
  language text not null default 'nn' check (language in ('nn','en')),
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists appointments_date_idx on appointments (appointment_date);

create table if not exists business_hours (
  id uuid primary key default gen_random_uuid(),
  weekday int not null unique check (weekday between 0 and 6), -- 0=Sunday .. 6=Saturday
  is_open boolean not null default true,
  start_time time not null,
  end_time time not null,
  last_checkin_time time not null
);

create table if not exists blocked_dates (
  id uuid primary key default gen_random_uuid(),
  blocked_date date not null,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists clinic_settings (
  id uuid primary key default gen_random_uuid(),
  clinic_name text not null,
  clinic_email text not null,
  clinic_phone text not null,
  clinic_address text not null,
  slot_interval_minutes int not null,
  booking_notice_hours int not null,
  cancellation_hours int not null,
  max_guests int not null,
  key_box_code text not null,
  created_at timestamptz not null default now()
);

create table if not exists faq (
  id uuid primary key default gen_random_uuid(),
  question_nn text not null,
  question_en text not null,
  answer_nn text not null,
  answer_en text not null,
  sort_order int not null default 0,
  is_active boolean not null default true
);

create table if not exists rules (
  id uuid primary key default gen_random_uuid(),
  text_nn text not null,
  text_en text not null,
  sort_order int not null default 0,
  is_active boolean not null default true
);

-- Admin role table: a signed-in Supabase Auth user is an admin iff a row
-- exists here for their user id. Simpler and more portable than relying
-- on app_metadata (which needs the Admin API / a dashboard edit to set).
create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ============================================================
-- is_admin() — SECURITY DEFINER so it can read admin_users regardless
-- of the caller's own RLS visibility into that table.
-- ============================================================
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from admin_users where user_id = auth.uid());
$$;
grant execute on function is_admin() to anon, authenticated;

-- ============================================================
-- get_booked_slots(p_from, p_to) — the ONLY way the public site learns
-- about existing bookings. It returns just enough to compute
-- availability (never guest name/email/phone), so it's safe to expose
-- to anon even though anon has no SELECT policy on `appointments` itself.
-- ============================================================
create or replace function get_booked_slots(p_from date, p_to date)
returns table (
  appointment_date date,
  start_time time,
  end_time time,
  status text,
  payment_status text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select a.appointment_date, a.start_time, a.end_time, a.status, a.payment_status, a.created_at
  from appointments a
  where a.appointment_date between p_from and p_to;
$$;
grant execute on function get_booked_slots(date, date) to anon, authenticated;

-- ============================================================
-- Public-safe view of clinic_settings — excludes key_box_code.
-- The base table stays admin-only; the public site reads this view.
-- ============================================================
create or replace view clinic_settings_public as
  select id, clinic_name, clinic_email, clinic_phone, clinic_address,
         slot_interval_minutes, booking_notice_hours, cancellation_hours,
         max_guests, created_at
  from clinic_settings;
grant select on clinic_settings_public to anon, authenticated;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table services enable row level security;
alter table appointments enable row level security;
alter table business_hours enable row level security;
alter table blocked_dates enable row level security;
alter table clinic_settings enable row level security;
alter table faq enable row level security;
alter table rules enable row level security;
alter table admin_users enable row level security;

-- services: public reads only active rows; admin has full access
create policy "services_public_read_active" on services
  for select to anon, authenticated
  using (is_active = true or is_admin());
create policy "services_admin_write" on services
  for insert to authenticated with check (is_admin());
create policy "services_admin_update" on services
  for update to authenticated using (is_admin()) with check (is_admin());
create policy "services_admin_delete" on services
  for delete to authenticated using (is_admin());

-- business_hours: public read, admin write
create policy "business_hours_public_read" on business_hours
  for select to anon, authenticated using (true);
create policy "business_hours_admin_write" on business_hours
  for insert to authenticated with check (is_admin());
create policy "business_hours_admin_update" on business_hours
  for update to authenticated using (is_admin()) with check (is_admin());
create policy "business_hours_admin_delete" on business_hours
  for delete to authenticated using (is_admin());

-- blocked_dates: public read, admin write
create policy "blocked_dates_public_read" on blocked_dates
  for select to anon, authenticated using (true);
create policy "blocked_dates_admin_write" on blocked_dates
  for insert to authenticated with check (is_admin());
create policy "blocked_dates_admin_delete" on blocked_dates
  for delete to authenticated using (is_admin());

-- clinic_settings: admin only on the base table (public uses the view above)
create policy "clinic_settings_admin_all_select" on clinic_settings
  for select to authenticated using (is_admin());
create policy "clinic_settings_admin_update" on clinic_settings
  for update to authenticated using (is_admin()) with check (is_admin());
create policy "clinic_settings_admin_insert" on clinic_settings
  for insert to authenticated with check (is_admin());

-- faq: public reads active rows, admin full access
create policy "faq_public_read_active" on faq
  for select to anon, authenticated using (is_active = true or is_admin());
create policy "faq_admin_write" on faq
  for insert to authenticated with check (is_admin());
create policy "faq_admin_update" on faq
  for update to authenticated using (is_admin()) with check (is_admin());
create policy "faq_admin_delete" on faq
  for delete to authenticated using (is_admin());

-- rules: public reads active rows, admin full access
create policy "rules_public_read_active" on rules
  for select to anon, authenticated using (is_active = true or is_admin());
create policy "rules_admin_write" on rules
  for insert to authenticated with check (is_admin());
create policy "rules_admin_update" on rules
  for update to authenticated using (is_admin()) with check (is_admin());
create policy "rules_admin_delete" on rules
  for delete to authenticated using (is_admin());

-- appointments: anon (and authenticated guests) may only INSERT a fresh,
-- unconfirmed booking request; only admins may read/update/delete.
create policy "appointments_public_insert" on appointments
  for insert to anon, authenticated
  with check (status = 'pending' and payment_status = 'pending' and access_code is null);
create policy "appointments_admin_select" on appointments
  for select to authenticated using (is_admin());
create policy "appointments_admin_update" on appointments
  for update to authenticated using (is_admin()) with check (is_admin());
create policy "appointments_admin_delete" on appointments
  for delete to authenticated using (is_admin());

-- admin_users: no anon/authenticated policies — only is_admin() (SECURITY
-- DEFINER) and the Supabase service role can read/write this table.
-- (Add yourself as an admin from the SQL editor — see bottom of this file.)

-- ============================================================
-- SEED DATA (from the approved design / PROMPT)
-- ============================================================

insert into services (name, description, duration_minutes, price, max_guests, is_active, sort_order) values
  ('2 timar privat leige', 'Heile badstova for deg og dine. Ved, handklehengarar, dusj og omkledningsrom er inkludert.', 120, 450, 6, true, 1),
  ('4 timar utvida', 'For deg som vil ta det med ro. To samanhengande timeslott til redusert pris.', 240, 800, 6, true, 2),
  ('Klippekort 5 × 2 timar', 'Gjeld i 12 månader. Bruk det sjølv eller del med vener og familie.', 120, 2000, 6, true, 3);

insert into business_hours (weekday, is_open, start_time, end_time, last_checkin_time) values
  (0, true, '08:00', '22:00', '20:00'), -- Sunday
  (1, true, '08:00', '22:00', '20:00'), -- Monday
  (2, true, '08:00', '22:00', '20:00'),
  (3, true, '08:00', '22:00', '20:00'),
  (4, true, '08:00', '22:00', '20:00'),
  (5, true, '08:00', '22:00', '20:00'),
  (6, true, '08:00', '22:00', '20:00') -- Saturday
on conflict (weekday) do nothing;

insert into clinic_settings (clinic_name, clinic_email, clinic_phone, clinic_address, slot_interval_minutes, booking_notice_hours, cancellation_hours, max_guests, key_box_code)
values ('Fjordbu Sauna', 'post@fjordbusauna.no', '90 77 87 12', 'Urke småbåthamn 6196 Norangsfjorden', 120, 2, 24, 6, '4821');

insert into faq (question_nn, question_en, answer_nn, answer_en, sort_order, is_active) values
  ('Kor mange kan vi vere?', 'How many people can we be?', 'Inntil 6 personar. Prisen er den same uansett kor mange de er — de leiger heile saunaen.', 'Up to 6. The price is the same however many you are — you hire the whole sauna.', 1, true),
  ('Er saunaen varm når vi kjem?', 'Is the sauna hot when we arrive?', 'Ja. Omnen blir fyrt opp før avtalt tid, så saunaen er klar når du låser deg inn. Legg gjerne på eit par vedkubbar undervegs.', 'Yes. The stove is lit before your slot, so the sauna is ready when you let yourself in. Add a log or two along the way.', 2, true),
  ('Kva om eg må avbestille?', 'What if I need to cancel?', 'Avbestilling inntil 24 timar før gjev full refusjon. Ved kortare frist kan du flytte bookinga éin gong.', 'Cancel up to 24 hours before for a full refund. With shorter notice you can move the booking once.', 3, true),
  ('Kan vi bade i fjorden?', 'Can we swim in the fjord?', 'Sjølvsagt — det er halve poenget. Badestige rett frå flåten, og ferskvassdusj etterpå. Bading skjer på eige ansvar.', 'Of course — that is half the point. Ladder straight off the raft and a fresh-water shower afterwards. Swimming is at your own risk.', 4, true),
  ('Er det parkering?', 'Is there parking?', 'Ja, gratis parkering ved kaien i Urke, om lag 50 meter frå saunaen.', 'Yes, free parking at the quay in Urke, about 50 metres from the sauna.', 5, true),
  ('Kan vi booke for firma eller grupper?', 'Can we book for a company or group?', 'Ta kontakt på post@fjordbusauna.no, så finn vi ei løysing med fleire slott etter kvarandre.', 'Contact us at post@fjordbusauna.no and we will arrange consecutive slots.', 6, true);

insert into rules (text_nn, text_en, sort_order, is_active) values
  ('Maks 6 personar i saunaen samtidig.', 'Maximum 6 people in the sauna at once.', 1, true),
  ('Born under 16 år berre saman med vaksen. Bading skjer på eige ansvar.', 'Children under 16 only with an adult. Swimming is at your own risk.', 2, true),
  ('Bruk berre ferskvatn på omnen — aldri sjøvatn.', 'Use only fresh water on the stove — never seawater.', 3, true),
  ('Alkohol og glas er ikkje tillate på flåten.', 'No alcohol or glass on the raft.', 4, true),
  ('Sit alltid på handduk. Dusj før du går inn.', 'Always sit on a towel. Shower before entering.', 5, true),
  ('Lås døra, legg nøkkelen tilbake og ta med søppelet ditt når tida er ute.', 'Lock the door, return the key and take your rubbish when your time is up.', 6, true);

-- ============================================================
-- MAKE YOURSELF ADMIN
-- ============================================================
-- 1) Create your admin login: Authentication → Users → Add user, in the
--    Supabase dashboard (email + password you'll use at /admin/login).
-- 2) Then run, with that user's email:
--
--   insert into admin_users (user_id)
--   select id from auth.users where email = 'post@fjordbusauna.no';
