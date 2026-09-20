// Booking-form validation. Kept deliberately simple (this can't detect a
// determined troll typing "Ola Nordmann" and a real-looking throwaway
// email — no client-side check can), but it stops the common case: an
// empty-ish name, a phone number that isn't a real Norwegian number, or
// an email missing an "@" or a domain.
//
// These same rules are enforced again as CHECK constraints in
// supabase/schema.sql, because the Supabase anon key is public — anyone
// could call the insert API directly and skip this form entirely. The
// two must be kept in sync; the DB is the real gate, this is just fast
// feedback for honest guests.

export function isValidName(name: string): boolean {
  const trimmed = name.trim().replace(/\s+/g, ' ')
  if (trimmed.length < 3) return false
  // Require at least two words (first + last name).
  return trimmed.includes(' ')
}

export function normalizePhone(phone: string): string {
  return phone.trim().replace(/[\s()-]/g, '')
}

export function isValidPhone(phone: string): boolean {
  const p = normalizePhone(phone)
  // Norwegian numbers: optional +47 / 0047, then 8 digits, not starting
  // with 0 or 1 (those prefixes aren't issued for subscriber numbers).
  return /^(\+47|0047)?[2-9]\d{7}$/.test(p)
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}
