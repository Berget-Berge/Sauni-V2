import { useEffect, useState } from 'react'
import { sx } from '../../lib/style'
import { supabase } from '../../lib/supabase'
import type { BusinessHoursRow } from '../../lib/database.types'

const DAY_NAMES = ['Sundag', 'Måndag', 'Tysdag', 'Onsdag', 'Torsdag', 'Fredag', 'Laurdag']
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0]

export function Hours() {
  const [hours, setHours] = useState<BusinessHoursRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('business_hours').select('*')
      setHours((data ?? []) as BusinessHoursRow[])
      setLoading(false)
    }
    load()
  }, [])

  function patch(weekday: number, p: Partial<BusinessHoursRow>) {
    setHours((prev) => prev.map((h) => (h.weekday === weekday ? { ...h, ...p } : h)))
  }

  async function save() {
    await Promise.all(
      hours.map((h) =>
        supabase
          .from('business_hours')
          .update({ is_open: h.is_open, start_time: h.start_time, end_time: h.end_time, last_checkin_time: h.last_checkin_time })
          .eq('id', h.id)
      )
    )
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  if (loading) return <div style={sx('color:#8A8073;')}>…</div>

  return (
    <div style={sx('animation:fadein .3s ease;')}>
      <h1 style={sx('margin:0 0 6px;font-size:28px;font-weight:600;letter-spacing:-0.01em;')}>Opningstider</h1>
      <p style={sx('margin:0 0 24px;color:#8A8073;font-size:14px;font-weight:300;')}>
        Slott blir berre generert innanfor desse tidene. Siste innsjekk avgjer siste moglege start.
      </p>
      <div style={sx('background:#FFFFFF;border:1px solid rgba(18,32,29,0.1);border-radius:16px;overflow:hidden;max-width:760px;')}>
        <div style={sx('display:grid;grid-template-columns:1.2fr 0.8fr 1fr 1fr 1fr;gap:12px;padding:12px 20px;font-size:12px;color:#8A8073;font-weight:500;border-bottom:1px solid rgba(18,32,29,0.08);')}>
          <span>Dag</span>
          <span>Open</span>
          <span>Frå</span>
          <span>Til</span>
          <span>Siste innsjekk</span>
        </div>
        {DISPLAY_ORDER.map((weekday) => {
          const h = hours.find((x) => x.weekday === weekday)
          if (!h) return null
          return (
            <div
              key={weekday}
              style={sx(`display:grid;grid-template-columns:1.2fr 0.8fr 1fr 1fr 1fr;gap:12px;padding:12px 20px;align-items:center;border-bottom:1px solid rgba(18,32,29,0.06);font-size:14px;opacity:${h.is_open ? 1 : 0.5};`)}
            >
              <span style={sx('font-weight:500;')}>{DAY_NAMES[weekday]}</span>
              <button
                onClick={() => patch(weekday, { is_open: !h.is_open })}
                style={sx(`width:40px;height:22px;border-radius:11px;background:${h.is_open ? '#B5602A' : 'rgba(18,32,29,0.2)'};position:relative;transition:background .2s;`)}
              >
                <span style={sx(`position:absolute;top:2px;left:${h.is_open ? '20px' : '2px'};width:18px;height:18px;border-radius:50%;background:#FFFFFF;transition:left .2s;display:block;`)} />
              </button>
              <input
                type="time"
                value={h.start_time.slice(0, 5)}
                onChange={(e) => patch(weekday, { start_time: `${e.target.value}:00` })}
                style={sx('border:1px solid rgba(18,32,29,0.15);border-radius:8px;padding:6px 8px;font-size:13px;')}
              />
              <input
                type="time"
                value={h.end_time.slice(0, 5)}
                onChange={(e) => patch(weekday, { end_time: `${e.target.value}:00` })}
                style={sx('border:1px solid rgba(18,32,29,0.15);border-radius:8px;padding:6px 8px;font-size:13px;')}
              />
              <input
                type="time"
                value={h.last_checkin_time.slice(0, 5)}
                onChange={(e) => patch(weekday, { last_checkin_time: `${e.target.value}:00` })}
                style={sx('border:1px solid rgba(18,32,29,0.15);border-radius:8px;padding:6px 8px;font-size:13px;')}
              />
            </div>
          )
        })}
      </div>
      <button onClick={save} style={sx('margin-top:20px;background:#B5602A;color:#FFFFFF;padding:10px 22px;border-radius:20px;font-size:14px;font-weight:500;')}>
        {saved ? 'Lagra ✓' : 'Lagre endringar'}
      </button>
    </div>
  )
}
