import { useEffect, useMemo, useState } from 'react'
import { sx } from '../../lib/style'
import { supabase } from '../../lib/supabase'
import { STATUS_BADGE, PAY_BADGE, fmtDateNn } from '../../lib/adminBadges'
import { useIsMobile } from '../../hooks/useIsMobile'
import type { AppointmentRow, AppointmentStatus, ClinicSettingsRow, ServiceRow } from '../../lib/database.types'

type FilterKey = 'all' | 'today' | 'pending' | 'confirmed' | 'cancelled'
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Alle' },
  { key: 'today', label: 'I dag' },
  { key: 'pending', label: 'Ventar' },
  { key: 'confirmed', label: 'Stadfesta' },
  { key: 'cancelled', label: 'Avlyst' },
]

export function Bookings() {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([])
  const [services, setServices] = useState<ServiceRow[]>([])
  const [clinicSettings, setClinicSettings] = useState<ClinicSettingsRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterKey>('all')
  const [search, setSearch] = useState('')
  const [openRow, setOpenRow] = useState<string | null>(null)
  const isMobile = useIsMobile()

  async function load() {
    const [a, s, cs] = await Promise.all([
      supabase.from('appointments').select('*').order('appointment_date', { ascending: false }),
      supabase.from('services').select('*'),
      supabase.from('clinic_settings').select('*').limit(1).maybeSingle(),
    ])
    setAppointments((a.data ?? []) as AppointmentRow[])
    setServices((s.data ?? []) as ServiceRow[])
    setClinicSettings((cs.data ?? null) as ClinicSettingsRow | null)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const serviceById = useMemo(() => new Map(services.map((s) => [s.id, s])), [services])
  const todayIso = new Date().toISOString().slice(0, 10)

  async function updateStatus(id: string, patch: Partial<AppointmentRow>) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))
    const { error } = await supabase.from('appointments').update(patch).eq('id', id)
    if (error) load() // resync on failure
  }

  const confirm = (a: AppointmentRow) =>
    updateStatus(a.id, { status: 'confirmed', payment_status: 'paid', access_code: clinicSettings?.key_box_code ?? a.access_code })
  const complete = (a: AppointmentRow) => updateStatus(a.id, { status: 'completed' })
  const cancel = (a: AppointmentRow) => updateStatus(a.id, { status: 'cancelled', payment_status: 'refunded', access_code: null })

  const q = search.toLowerCase()
  const filtered = appointments
    .filter((a) => (filter === 'all' ? true : filter === 'today' ? a.appointment_date === todayIso : a.status === (filter as AppointmentStatus)))
    .filter((a) => !q || a.full_name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q))
    .sort((a, b) => (a.appointment_date + a.start_time).localeCompare(b.appointment_date + b.start_time))

  const actionButtons = (b: AppointmentRow) => (
    <div style={sx('display:flex;gap:8px;flex-wrap:wrap;')}>
      <button onClick={() => confirm(b)} style={sx('background:#12201D;color:#F6F3EC;padding:8px 14px;border-radius:16px;font-size:13px;font-weight:500;')}>
        Stadfest
      </button>
      <button
        onClick={() => complete(b)}
        style={sx('background:#FFFFFF;color:#12201D;padding:8px 14px;border-radius:16px;font-size:13px;font-weight:500;border:1px solid rgba(18,32,29,0.15);')}
      >
        Fullført
      </button>
      <button
        onClick={() => cancel(b)}
        style={sx('background:#FFFFFF;color:#B5602A;padding:8px 14px;border-radius:16px;font-size:13px;font-weight:500;border:1px solid rgba(181,96,42,0.4);')}
      >
        Avlys og refunder
      </button>
    </div>
  )

  if (loading) return <div style={sx('color:#8A8073;')}>…</div>

  const filterBar = (
    <div style={sx('display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px;align-items:center;')}>
      {FILTERS.map((f) => {
        const active = filter === f.key
        return (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={sx(`padding:8px 14px;border-radius:18px;font-size:13px;font-weight:500;background:${active ? '#12201D' : '#FFFFFF'};color:${active ? '#F6F3EC' : '#12201D'};border:1px solid ${active ? '#12201D' : 'rgba(18,32,29,0.15)'};`)}
          >
            {f.label}
          </button>
        )
      })}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Søk namn eller e-post"
        style={sx(
          `background:#FFFFFF;border:1px solid rgba(18,32,29,0.15);border-radius:18px;padding:8px 14px;font-size:13px;box-sizing:border-box;${isMobile ? 'width:100%;' : 'margin-left:auto;min-width:220px;'}`
        )}
      />
    </div>
  )

  if (isMobile) {
    return (
      <div style={sx('animation:fadein .3s ease;')}>
        <h1 style={sx('margin:0 0 20px;font-size:24px;font-weight:600;letter-spacing:-0.01em;')}>Bookingar</h1>
        {filterBar}
        <div style={sx('display:flex;flex-direction:column;gap:12px;')}>
          {filtered.map((b) => {
            const open = openRow === b.id
            const st = STATUS_BADGE[b.status]
            const py = PAY_BADGE[b.payment_status]
            const svc = serviceById.get(b.service_id)
            return (
              <div key={b.id} style={sx('background:#FFFFFF;border:1px solid rgba(18,32,29,0.1);border-radius:16px;overflow:hidden;')}>
                <div onClick={() => setOpenRow(open ? null : b.id)} style={sx('padding:16px 18px;display:flex;flex-direction:column;gap:8px;cursor:pointer;')}>
                  <div style={sx('display:flex;justify-content:space-between;align-items:flex-start;gap:10px;')}>
                    <div style={sx('min-width:0;')}>
                      <div style={sx('font-weight:600;font-size:15px;')}>{b.full_name}</div>
                      <div style={sx('font-size:12px;color:#8A8073;margin-top:2px;')}>{svc?.name ?? '—'}</div>
                    </div>
                    <span style={sx(`flex-shrink:0;font-size:12px;font-weight:600;padding:4px 10px;border-radius:10px;background:${st[1]};color:${st[2]};`)}>{st[0]}</span>
                  </div>
                  <div style={sx('display:flex;justify-content:space-between;align-items:center;font-size:13px;color:#12201D;')}>
                    <span>
                      {fmtDateNn(b.appointment_date)} · {b.start_time.slice(0, 5)}–{b.end_time.slice(0, 5)}
                    </span>
                    <span style={sx(`font-size:12px;font-weight:600;padding:3px 9px;border-radius:10px;background:${py[1]};color:${py[2]};`)}>{py[0]}</span>
                  </div>
                </div>
                {open && (
                  <div style={sx('padding:4px 18px 18px;display:flex;flex-direction:column;gap:14px;background:rgba(18,32,29,0.02);border-top:1px solid rgba(18,32,29,0.06);animation:fadein .2s ease;')}>
                    <div>
                      <div style={sx('font-size:12px;color:#8A8073;margin-bottom:6px;')}>Kontakt · {b.guests} personar</div>
                      <div style={sx('font-size:14px;')}>{b.phone}</div>
                      <div style={sx('font-size:14px;word-break:break-word;')}>{b.email}</div>
                    </div>
                    <div>
                      <div style={sx('font-size:12px;color:#8A8073;margin-bottom:6px;')}>Kode nøkkelboks</div>
                      <span style={sx('font-size:18px;font-weight:600;letter-spacing:0.1em;')}>{b.access_code ?? '—'}</span>
                      <div style={sx('font-size:12px;color:#8A8073;margin-top:4px;')}>Ref. {b.payment_reference ?? '—'}</div>
                    </div>
                    <div>
                      <div style={sx('font-size:12px;color:#8A8073;margin-bottom:8px;')}>Handlingar</div>
                      {actionButtons(b)}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && <div style={sx('padding:40px 20px;text-align:center;color:#8A8073;font-size:14px;background:#FFFFFF;border-radius:16px;border:1px solid rgba(18,32,29,0.1);')}>Ingen bookingar matchar filteret.</div>}
        </div>
      </div>
    )
  }

  return (
    <div style={sx('animation:fadein .3s ease;')}>
      <h1 style={sx('margin:0 0 24px;font-size:28px;font-weight:600;letter-spacing:-0.01em;')}>Bookingar</h1>
      {filterBar}
      <div style={sx('background:#FFFFFF;border:1px solid rgba(18,32,29,0.1);border-radius:16px;overflow:hidden;')}>
        <div
          style={sx(
            'display:grid;grid-template-columns:1.2fr 1.6fr 0.6fr 1fr 1fr 1fr 40px;gap:12px;padding:12px 20px;font-size:12px;color:#8A8073;font-weight:500;border-bottom:1px solid rgba(18,32,29,0.08);'
          )}
        >
          <span>Dato · tid</span>
          <span>Gjest</span>
          <span>Pers.</span>
          <span>Pakke</span>
          <span>Betaling</span>
          <span>Status</span>
          <span />
        </div>
        {filtered.map((b) => {
          const open = openRow === b.id
          const st = STATUS_BADGE[b.status]
          const py = PAY_BADGE[b.payment_status]
          const svc = serviceById.get(b.service_id)
          return (
            <div key={b.id} style={sx('border-bottom:1px solid rgba(18,32,29,0.06);')}>
              <div
                onClick={() => setOpenRow(open ? null : b.id)}
                style={sx(
                  `display:grid;grid-template-columns:1.2fr 1.6fr 0.6fr 1fr 1fr 1fr 40px;gap:12px;padding:14px 20px;font-size:14px;align-items:center;cursor:pointer;background:${open ? 'rgba(18,32,29,0.03)' : 'transparent'};`
                )}
              >
                <span>
                  <span style={sx('font-weight:500;')}>{fmtDateNn(b.appointment_date)}</span>
                  <span style={sx('display:block;font-size:12px;color:#8A8073;')}>
                    {b.start_time.slice(0, 5)}–{b.end_time.slice(0, 5)}
                  </span>
                </span>
                <span>
                  <span style={sx('font-weight:500;')}>{b.full_name}</span>
                  <span style={sx('display:block;font-size:12px;color:#8A8073;')}>{b.email}</span>
                </span>
                <span>{b.guests}</span>
                <span style={sx('font-size:13px;')}>{svc?.name ?? '—'}</span>
                <span>
                  <span style={sx(`font-size:12px;font-weight:600;padding:4px 10px;border-radius:10px;background:${py[1]};color:${py[2]};`)}>{py[0]}</span>
                </span>
                <span>
                  <span style={sx(`font-size:12px;font-weight:600;padding:4px 10px;border-radius:10px;background:${st[1]};color:${st[2]};`)}>{st[0]}</span>
                </span>
                <span style={sx(`color:#8A8073;text-align:right;transform:${open ? 'rotate(180deg)' : 'rotate(0deg)'};transition:transform .2s;display:inline-block;`)}>⌄</span>
              </div>
              {open && (
                <div
                  style={sx(
                    'padding:6px 20px 20px;display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:20px;background:rgba(18,32,29,0.02);animation:fadein .25s ease;'
                  )}
                >
                  <div>
                    <div style={sx('font-size:12px;color:#8A8073;margin-bottom:6px;')}>Kontakt</div>
                    <div style={sx('font-size:14px;')}>{b.phone}</div>
                    <div style={sx('font-size:14px;')}>{b.email}</div>
                  </div>
                  <div>
                    <div style={sx('font-size:12px;color:#8A8073;margin-bottom:6px;')}>Kode nøkkelboks</div>
                    <div style={sx('display:flex;gap:8px;align-items:center;')}>
                      <span style={sx('font-size:18px;font-weight:600;letter-spacing:0.1em;')}>{b.access_code ?? '—'}</span>
                    </div>
                    <div style={sx('font-size:12px;color:#8A8073;margin-top:4px;')}>Ref. {b.payment_reference ?? '—'}</div>
                  </div>
                  <div>
                    <div style={sx('font-size:12px;color:#8A8073;margin-bottom:6px;')}>Handlingar</div>
                    {actionButtons(b)}
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && <div style={sx('padding:40px;text-align:center;color:#8A8073;font-size:14px;')}>Ingen bookingar matchar filteret.</div>}
      </div>
    </div>
  )
}
