# Fjordbu Sauna — nettside med ekte booking og admin

Build a production-ready booking website and admin dashboard for **Fjordbu Sauna**, a self-service floating sauna in Urke, Hjørundfjorden (Norway).

Tech stack:
- React
- TypeScript
- Vite
- Supabase (database + backend + auth)

================================================
DESIGN (STRICT — DO NOT CHANGE)
================================================

The complete public website design is provided as HTML (`Fjordbu Sauna v2.dc.html` + `/images`). Recreate it **exactly** in React:

- Same sections, same order: Nav → Hero → Om saunaen → Prisar/opningstider → Booking → Slik fungerer det → Galleri → Reglar → FAQ (accordion) → Finn oss (embedded Google Map) → Om oss → Footer
- Same colors: background `#F6F3EC`, dark `#12201D`, card dark `#1B2E28`, accent `#B5602A`, accent hover `#D97F4B`, blue-green `#3C5A5E`, muted text `#8A8073`, white `#FFFFFF`
- Same typography (system sans-serif stack), sizes, weights, spacing, radii, shadows and hover states
- Same booking card layout (max-width 760px, 5-segment progress bar, step titles, day grid, slot grid, form fields, payment cards, summary rows, success state)
- Same language toggle NN / EN in the navbar — all UI copy exists in both languages in the HTML; reuse those strings
- Use the images in `/images` as-is

Do NOT introduce new visual styles, fonts, colors, or sections. The only visible change allowed is that data now comes from Supabase instead of hardcoded values.

================================================
SUPABASE CONNECTION (REQUIRED)
================================================

VITE_SUPABASE_URL=https://hgwpkduqtbcvnsfaxqaz.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_ekaN8bHeAlfkhKH2o9tSeQ_U_nbnsxR

Rules:
- Use these as environment variables — never hardcode inside components
- Create the client in `src/lib/supabase.ts`
- Read via `import.meta.env.VITE_SUPABASE_URL` / `import.meta.env.VITE_SUPABASE_ANON_KEY`

================================================
DATABASE SCHEMA (STRICT CONTRACT)
================================================

Use this EXACT schema. Do NOT rename or invent fields.

Table: services  (sauna packages — shown in "Prisar" and used in booking)
- id
- name
- description
- duration_minutes
- price
- max_guests
- is_active
- sort_order
- created_at

Table: appointments  (bookings)
- id
- full_name
- email
- phone
- service_id
- appointment_date
- start_time
- end_time
- guests
- payment_method        ('vipps' | 'card')
- payment_status        ('pending' | 'paid' | 'refunded' | 'failed')
- payment_reference
- access_code           (key-box code, sent to guest before start)
- language              ('nn' | 'en')
- status                ('pending' | 'confirmed' | 'cancelled' | 'completed')
- notes
- created_at

Table: business_hours
- id
- weekday
- is_open
- start_time
- end_time
- last_checkin_time

Table: blocked_dates
- id
- blocked_date
- reason
- created_at

Table: clinic_settings  (keep table name; it holds sauna settings — one row)
- id
- clinic_name
- clinic_email
- clinic_phone
- clinic_address
- slot_interval_minutes
- booking_notice_hours
- cancellation_hours
- max_guests
- key_box_code
- created_at

Table: faq
- id
- question_nn
- question_en
- answer_nn
- answer_en
- sort_order
- is_active

Table: rules
- id
- text_nn
- text_en
- sort_order
- is_active

Seed data (from the HTML):
- services: "2 timar privat leige" 120 min / 450 kr / 6 guests; "4 timar utvida" 240 min / 800 kr / 6; "Klippekort 5 × 2 timar" 120 min / 2000 kr / 6
- business_hours: all weekdays open 08:00–22:00, last_checkin_time 20:00
- clinic_settings: Fjordbu Sauna, post@fjordbusauna.no, 90 77 87 12, Urke småbåthamn 6196 Norangsfjorden, slot_interval 120, booking_notice 2, cancellation 24, max_guests 6
- faq + rules: the six FAQ items and six rules from the HTML, both languages

================================================
CRITICAL RULES (DO NOT BREAK)
================================================

Do NOT use:
- day_of_week
- open_time / close_time
- date (for blocked_dates)
- customer_name / customer_email / customer_phone

Only use the exact schema above.

================================================
PUBLIC SITE — DATA BINDING
================================================

- "Prisar" cards ← `services` where is_active, ordered by sort_order
- Opening hours block ← `business_hours` + `clinic_settings`
- Reglar ← `rules`; FAQ ← `faq` (pick _nn or _en by current language)
- Footer contact ← `clinic_settings`
- Everything else (hero, om, slik fungerer det, galleri, om oss) stays static as in the HTML
- New or edited services must appear on the public site automatically

================================================
BOOKING FLOW (MATCH THE HTML EXACTLY)
================================================

Step 1 — Vel dato: 7-day grid starting today (skip blocked dates and fully booked days by dimming them)
Step 2 — Vel tidspunkt: available slots for the selected date and the default service (2 hours). If a package other than the default was chosen from the "Prisar" section CTA, use its duration. Booked / unavailable slots shown dimmed with line-through and disabled.
Step 3 — Dine opplysningar: full name, phone, email, guests (− / + / typed input, 1..max_guests)
Step 4 — Vel betaling: Vipps or Kort (card). Selected card gets accent border.
Step 5 — Oppsummering: date, time range, name, guests, phone, payment method, price. CTA "Betal med {method} · {price} kr"
Step 6 — Booking stadfesta: date, time, "stadfesting sendt til" email, CTA "Bestill ei ny tid"

On confirm:
- Insert into `appointments` with status 'pending', payment_status 'pending'
- Start payment (see below); on success set payment_status 'paid', status 'confirmed', generate/assign `access_code`
- Send confirmation email + SMS (Supabase Edge Function) with date, time and access code

Validation: name, phone, email required (show the existing error text). Guests clamped to 1..max_guests.

================================================
PAYMENT
================================================

- Vipps: use Vipps ePayment API via a Supabase Edge Function; redirect and handle callback
- Card: use Stripe Checkout via a Supabase Edge Function
- Store the provider reference in `payment_reference`
- If payment fails or is abandoned, keep the appointment as 'pending' and release the slot after 15 minutes
- Refund on cancellation ≥ `cancellation_hours` before start

Keep secret keys server-side only (Edge Function env), never in the client.

================================================
AVAILABILITY LOGIC (VERY IMPORTANT)
================================================

Generate slots using:
- business_hours (weekday, is_open, start_time, end_time, last_checkin_time)
- services.duration_minutes
- clinic_settings.slot_interval_minutes
- clinic_settings.booking_notice_hours
- blocked_dates
- existing appointments

Rules:
- Only generate slots inside working hours; slot start ≤ last_checkin_time
- Skip blocked dates
- Skip overlapping appointments (ignore status 'cancelled' and expired unpaid pending)
- Respect booking notice time
- Slot end must not exceed business_hours.end_time

Overlap rule:
new_start < existing_end AND new_end > existing_start

Slot structure:
{ start: Date, end: Date, label: string }   // label "HH:mm" in Europe/Oslo

================================================
TIME SAFETY RULES
================================================

- Only format REAL Date objects
- NEVER pass invalid strings to format()
- NEVER build strings like "yyyy-MM-ddT10:30:00"
- Always combine real selected date + time; use Europe/Oslo timezone
- Weekday names and date labels follow the active language (nn-NO / en-GB)

================================================
ADMIN AUTH + SECURITY
================================================

- Supabase Auth email/password login at `/admin/login`
- All `/admin/*` routes protected; unauthenticated → redirect to login
- Only users with role `admin` (in `app_metadata` or an `admin_users` table) can access
- Row Level Security:
  - public (anon): read `services`, `business_hours`, `blocked_dates`, `faq`, `rules`, `clinic_settings` (except `key_box_code`); insert into `appointments`
  - admin: full access to all tables
- Real route protection, not hidden buttons

================================================
ADMIN DASHBOARD
================================================

Pages:
1. Oversikt — today's and upcoming bookings, revenue this month, occupancy
2. Bookingar — list + filter (date, status, payment_status) + status update + view/copy access code + cancel/refund
3. Pakkar (services) — CRUD
4. Opningstider — weekday editor incl. last check-in
5. Sperra datoar — add/remove with reason
6. FAQ og reglar — CRUD, both languages
7. Innstillingar — clinic_settings form incl. key-box code, notice, cancellation hours, max guests

Dashboard style: clean, structured, sans-serif, same palette as the site (`#F6F3EC` background, `#12201D` text, `#B5602A` accent, `#3C5A5E` secondary). Norwegian (nynorsk) UI.

================================================
OUTPUT
================================================

- Full working app, clean structure, production-style code
- Supabase fully connected with migrations + seed
- Public site pixel-matched to the provided HTML
- Booking + payment + email/SMS working
- Admin login + protected dashboard working
- No placeholder fake data
