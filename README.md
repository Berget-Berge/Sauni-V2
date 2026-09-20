# Fjordbu Sauna — booking website + admin

React + TypeScript + Vite + Supabase, built from the design in
`Fjordbu Sauna v2.dc.html` / `Fjordbu Sauna Admin.dc.html` and the schema
contract in `PROMPT - Fjordbu Sauna backend.md`.

## 1. Set up Supabase (one-time)

1. Open the Supabase project (`hgwpkduqtbcvnsfaxqaz`) → **SQL Editor** → New query.
2. Paste the contents of `supabase/schema.sql` and run it. This creates all
   tables, row-level-security policies, the `get_booked_slots` /
   `is_admin` functions, the `clinic_settings_public` view, and seeds the
   services / opening hours / FAQ / rules from the approved design.
3. Create your admin login: **Authentication → Users → Add user** (email +
   password).
4. Back in the SQL editor, make that user an admin:
   ```sql
   insert into admin_users (user_id)
   select id from auth.users where email = 'you@example.com';
   ```
5. Log in at `/admin/login` with that email/password.

## 2. Environment variables

`.env` (already filled in with the project's URL + anon/publishable key —
these are meant to be public, RLS is what protects the data):

```
VITE_SUPABASE_URL=https://hgwpkduqtbcvnsfaxqaz.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_ekaN8bHeAlfkhKH2o9tSeQ_U_nbnsxR
```

Add the same two variables in **Vercel → Project → Settings → Environment
Variables** so the deployed build has them (Vercel doesn't read `.env`
from the repo for security reasons).

## 3. Local development

```
npm install
npm run dev
```

Public site: `/`. Admin: `/admin/login`.

## 4. What's real vs. what's stubbed

Real and working:
- Public site content (prices/packages, opening hours, rules, FAQ, footer
  contact) is all live from Supabase — editing it in `/admin` updates the
  site immediately.
- The booking flow computes real availability (business hours, slot
  interval, booking notice, blocked dates, existing bookings) and inserts
  a real row into `appointments` on submit.
- Admin login is real Supabase Auth, gated by the `admin_users` table +
  row-level security (not just a hidden button).
- The full admin dashboard (bookings, packages, hours, blocked dates,
  FAQ/rules, settings) reads and writes Supabase directly.

Intentionally stubbed — these need accounts/API keys nobody has set up yet:
- **Payment (Vipps / Stripe).** The booking flow lets a guest pick Vipps
  or card and submits the booking as `status: 'pending'`,
  `payment_status: 'pending'`. There is no live payment redirect — that
  needs a Vipps merchant agreement and/or a Stripe account, plus a
  Supabase Edge Function to call their APIs (the PROMPT's original spec).
  Until then, an admin confirms bookings by hand from **Bookingar →
  Stadfest**, which sets `status: confirmed`, `payment_status: paid`, and
  assigns the key-box code.
- **Confirmation email/SMS.** Same story — needs an email/SMS provider
  (e.g. Resend/Twilio) wired into a Supabase Edge Function. Not built yet.

Both are the next real step once you have those accounts — happy to wire
them in once the keys exist.
