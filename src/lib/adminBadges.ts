import type { AppointmentStatus, PaymentStatus } from './database.types'

export const STATUS_BADGE: Record<AppointmentStatus, [string, string, string]> = {
  pending: ['Ventar', 'rgba(181,96,42,0.15)', '#B5602A'],
  confirmed: ['Stadfesta', 'rgba(60,90,94,0.15)', '#3C5A5E'],
  cancelled: ['Avlyst', 'rgba(18,32,29,0.08)', '#8A8073'],
  completed: ['Fullført', 'rgba(18,32,29,0.9)', '#F6F3EC'],
}

export const PAY_BADGE: Record<PaymentStatus, [string, string, string]> = {
  paid: ['Betalt', 'rgba(60,90,94,0.15)', '#3C5A5E'],
  pending: ['Ventar', 'rgba(181,96,42,0.15)', '#B5602A'],
  refunded: ['Refundert', 'rgba(18,32,29,0.08)', '#8A8073'],
  failed: ['Feila', 'rgba(181,96,42,0.25)', '#B5602A'],
}

export function fmtDateNn(dateOnly: string): string {
  const [y, m, d] = dateOnly.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('nn-NO', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function trimSeconds(t: string): string {
  return t.slice(0, 5)
}
