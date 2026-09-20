import { useEffect, useMemo, useState } from 'react'
import { sx } from '../../lib/style'
import { supabase } from '../../lib/supabase'
import { generateSlotsForDate, toDateOnly } from '../../lib/availability'
import { STATUS_BADGE } from '../../lib/adminBadges'
import type {
  AppointmentRow,
  BlockedDateRow,
  BusinessHoursRow,
  ClinicSettingsRow,
  ServiceRow,
} from '../../lib/database.types'
import { Link } from 'react-router-dom'

const DAY_LETTERS_NN = ['S', 'M', 'T', 'O', 'T', 'F', 'L']

export function Overview() {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([])
  const [services, setServices] = useState<ServiceRow[]>([])
  const [businessHours, setBusinessHours] = useState<BusinessHoursRow[]>([])
  const [clinicSettings, setClinicSettings] = useState<ClinicSettingsRow | null>(null)
  const [blockedDates, setBlockedDates] = useState<BlockedDateRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [a, s, h, cs, b] = await Promise.all([
        supabase.from('appointments').select('*').order('appointment_date', { ascending: true }),
        supabase.from('services').select('*').order('sort_order', { ascending: true }),
        supabase.from('business_hours').select('*'),
        supabase.from('clinic_settings').select('*').limit(1).maybeSingle(),
        supabase.from('blocked_dates').select('*'),
      ])
      setAppointments((a.data ?? []) as AppointmentRow[])
      setServices((s.data ?? []) as ServiceRow[])
      setBusinessHours((h.data ?? []) as BusinessHoursRow[])
      setClinicSettings((cs.data ?? null) as ClinicSettingsRow | null)
      setBlockedDates((b.data ?? []) as BlockedDateRow[])
      setLoading(false)
    }
    load()
  }, [])

  const serviceById = useMemo(() => new Map(services.map((s) => [s.id, s])), [services])
  const today = new Date()
  const todayIso = toDateOnly(today)

  const todayBookings = appointments
    .filter((a) => a.appointment_date === todayIso && a.status !== 'cancelled')
    .sort((a, b) => a.start_time.localeCompare(b.start_time))

  const monthPrefix = todayIso.slice(0, 7)
  const revenue = appointments
    .filter((a) => a.payment_status === 'paid' && a.appointment_date.slice(0, 7) === monthPrefix)
    .reduce((sum, a) => sum + (serviceById.get(a.service_id)?.price ?? 0), 0)

  const upcomingConfirmed = appointments.filter((a) => a.appointment_date >= todayIso && a.status === 'confirmed').length
  const pendingCount = appointments.filter((a) => a.status === 'pending').length

  const stats = [
    { k: 'Bookingar i dag', v: String(todayBookings.length), sub: `${todayBookings.reduce((s, b) => s + b.guests, 0)} gjester` },
    { k: 'Kommande stadfesta', v: String(upcomingConfirmed), sub: 'neste 30 dagar' },
    { k: 'Inntekt denne månaden', v: `${Math.round(revenue).toLocaleString('nb-NO')} kr`, sub: 'betalte bookingar' },
    { k: 'Ventar på betaling', v: String(pendingCount), sub: pendingCount ? 'treng oppfølging' : 'alt i orden' },
  ]

  const referenceService = services.find((s) => s.is_active) ?? services[0]
  const occupancy = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const dIso = toDateOnly(d)
    const bookedCount = appointments.filter((a) => a.appointment_date === dIso && a.status !== 'cancelled').length
    const capacity =
      referenceService && clinicSettings
        ? generateSlotsForDate({ date: d, service: referenceService, businessHours, clinicSettings, blockedDates, appointments: [] }).length
        : 0
    const pct = capacity > 0 ? Math.min(100, (bookedCount / capacity) * 100) : 0
    return { day: DAY_LETTERS_NN[d.getDay()], h: `${Math.max(6, pct)}%`, color: pct >= 100 ? '#B5602A' : pct > 0 ? '#3C5A5E' : 'rgba(18,32,29,0.08)' }
  })

  if (loading) return <div style={sx('color:#8A8073;')}>…</div>

  return (
    <div style={sx('animation:fadein .3s ease;')}>
      <div style={sx('display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;margin-bottom:28px;')}>
        <div>
          <h1 style={sx('margin:0;font-size:28px;font-weight:600;letter-spacing:-0.01em;')}>Oversikt</h1>
          <div style={sx('color:#8A8073;font-size:14px;margin-top:4px;')}>
            {today.toLocaleDateString('nn-NO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <Link to="/admin/bookingar" style={sx('background:#B5602A;color:#FFFFFF;padding:10px 20px;border-radius:20px;font-size:14px;font-weight:500;')}>
          Sjå alle bookingar
        </Link>
      </div>

      <div style={sx('display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;margin-bottom:28px;')}>
        {stats.map((s) => (
          <div key={s.k} style={sx('background:#FFFFFF;border:1px solid rgba(18,32,29,0.1);border-radius:16px;padding:22px 24px;')}>
            <div style={sx('font-size:13px;color:#8A8073;')}>{s.k}</div>
            <div style={sx('font-size:30px;font-weight:600;letter-spacing:-0.02em;margin-top:8px;')}>{s.v}</div>
            <div style={sx('font-size:12px;color:#B5602A;margin-top:6px;')}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={sx('display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:14px;')}>
        <div style={sx('background:#FFFFFF;border:1px solid rgba(18,32,29,0.1);border-radius:16px;padding:24px;')}>
          <div style={sx('font-size:15px;font-weight:600;margin-bottom:16px;')}>I dag</div>
          <div style={sx('display:flex;flex-direction:column;')}>
            {todayBookings.map((b) => {
              const st = STATUS_BADGE[b.status]
              const svc = serviceById.get(b.service_id)
              return (
                <div key={b.id} style={sx('display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 0;border-top:1px solid rgba(18,32,29,0.08);')}>
                  <div>
                    <div style={sx('font-size:14px;font-weight:500;')}>
                      {b.start_time.slice(0, 5)} · {b.full_name}
                    </div>
                    <div style={sx('font-size:12px;color:#8A8073;margin-top:2px;')}>
                      {b.guests} personar · {svc?.name ?? '—'}
                    </div>
                  </div>
                  <span style={sx(`font-size:12px;font-weight:600;padding:4px 10px;border-radius:10px;background:${st[1]};color:${st[2]};`)}>{st[0]}</span>
                </div>
              )
            })}
            {todayBookings.length === 0 && <div style={sx('color:#8A8073;font-size:14px;padding:8px 0;')}>Ingen bookingar i dag.</div>}
          </div>
        </div>
        <div style={sx('background:#FFFFFF;border:1px solid rgba(18,32,29,0.1);border-radius:16px;padding:24px;')}>
          <div style={sx('font-size:15px;font-weight:600;margin-bottom:16px;')}>Belegg denne veka</div>
          <div style={sx('display:grid;grid-template-columns:repeat(7, minmax(0,1fr));gap:8px;align-items:end;height:140px;')}>
            {occupancy.map((o, i) => (
              <div key={i} style={sx('display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;justify-content:flex-end;')}>
                <div style={sx(`width:100%;border-radius:6px 6px 2px 2px;background:${o.color};height:${o.h};transition:height .3s;`)} />
                <div style={sx('font-size:11px;color:#8A8073;')}>{o.day}</div>
              </div>
            ))}
          </div>
          <div style={sx('font-size:12px;color:#8A8073;margin-top:14px;')}>Oransje = fullt.</div>
        </div>
      </div>
    </div>
  )
}
