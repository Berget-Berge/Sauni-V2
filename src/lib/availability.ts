import type { AppointmentStatus, BlockedDateRow, BusinessHoursRow, ClinicSettingsRow, PaymentStatus, ServiceRow } from './database.types'

// Availability math only ever needs these two fields, so it accepts either
// the full (admin) ClinicSettingsRow or the public clinic_settings_public
// view (which omits key_box_code).
type ClinicSettingsForAvailability = Pick<ClinicSettingsRow, 'slot_interval_minutes' | 'booking_notice_hours'>

// Only the fields needed to compute availability. The public site never
// reads full appointment rows (RLS keeps guest name/email/phone private) —
// it calls the `get_booked_slots` RPC, which returns exactly this shape.
export interface BookedSlot {
  appointment_date: string
  start_time: string
  end_time: string
  status: AppointmentStatus
  payment_status: PaymentStatus
  created_at: string
}

export interface Slot {
  start: Date
  end: Date
  label: string // "HH:mm"
}

// ---- time helpers -----------------------------------------------------
// TIME SAFETY: only ever build Date objects from real numeric parts
// (year, month, day, hour, minute). Never parse hand-built strings like
// `${y}-${m}-${d}T${h}:${mm}:00`.

function toMinutes(hms: string): number {
  const [h, m] = hms.split(':').map(Number)
  return h * 60 + m
}

function dateAt(day: Date, minutesSinceMidnight: number): Date {
  const d = new Date(day.getFullYear(), day.getMonth(), day.getDate())
  d.setMinutes(minutesSinceMidnight)
  return d
}

export function formatSlotLabel(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function toDateOnly(d: Date): string {
  // yyyy-mm-dd built from real Date fields, never string-parsed.
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// ---- overlap ------------------------------------------------------------

function overlaps(newStart: Date, newEnd: Date, existingStart: Date, existingEnd: Date): boolean {
  return newStart < existingEnd && newEnd > existingStart
}

// Appointments that still hold a slot: not cancelled, and not an expired
// unpaid pending hold (PROMPT: release the slot after 15 minutes if
// payment is not completed).
export function isBlockingAppointment(a: BookedSlot): boolean {
  if (a.status === 'cancelled') return false
  if (a.status === 'pending' && a.payment_status === 'pending') {
    const createdAt = new Date(a.created_at)
    const ageMinutes = (Date.now() - createdAt.getTime()) / 60000
    if (ageMinutes > 15) return false
  }
  return true
}

// ---- slot generation ------------------------------------------------------

export function generateSlotsForDate(opts: {
  date: Date
  service: ServiceRow
  businessHours: BusinessHoursRow[]
  clinicSettings: ClinicSettingsForAvailability
  blockedDates: BlockedDateRow[]
  appointments: BookedSlot[]
  now?: Date
}): Slot[] {
  const { date, service, businessHours, clinicSettings, blockedDates, appointments } = opts
  const now = opts.now ?? new Date()

  const dateOnly = toDateOnly(date)
  const isBlocked = blockedDates.some((b) => b.blocked_date === dateOnly)
  if (isBlocked) return []

  const weekday = date.getDay() // 0=Sun..6=Sat, matches BusinessHoursRow.weekday
  const hours = businessHours.find((h) => h.weekday === weekday)
  if (!hours || !hours.is_open) return []

  const openMin = toMinutes(hours.start_time)
  const closeMin = toMinutes(hours.end_time)
  const lastCheckinMin = toMinutes(hours.last_checkin_time)
  const interval = clinicSettings.slot_interval_minutes
  const duration = service.duration_minutes
  const noticeMs = clinicSettings.booking_notice_hours * 60 * 60 * 1000

  const relevantAppointments = appointments.filter(
    (a) => a.appointment_date === dateOnly && isBlockingAppointment(a)
  )

  const slots: Slot[] = []
  for (let startMin = openMin; startMin <= lastCheckinMin; startMin += interval) {
    const endMin = startMin + duration
    if (endMin > closeMin) continue

    const start = dateAt(date, startMin)
    const end = dateAt(date, endMin)

    if (start.getTime() - now.getTime() < noticeMs) continue

    const blockedBySomeone = relevantAppointments.some((a) => {
      const exStart = dateAt(date, toMinutes(a.start_time))
      const exEnd = dateAt(date, toMinutes(a.end_time))
      return overlaps(start, end, exStart, exEnd)
    })
    if (blockedBySomeone) continue

    slots.push({ start, end, label: formatSlotLabel(start) })
  }
  return slots
}

export function isDateBookable(opts: {
  date: Date
  service: ServiceRow
  businessHours: BusinessHoursRow[]
  clinicSettings: ClinicSettingsForAvailability
  blockedDates: BlockedDateRow[]
  appointments: BookedSlot[]
  now?: Date
}): boolean {
  return generateSlotsForDate(opts).length > 0
}
