import { useEffect, useState } from 'react'
import { sx } from '../../lib/style'
import { supabase } from '../../lib/supabase'
import { fmtDateNn } from '../../lib/adminBadges'
import type { BlockedDateRow } from '../../lib/database.types'

export function Blocked() {
  const [blocked, setBlocked] = useState<BlockedDateRow[]>([])
  const [loading, setLoading] = useState(true)
  const [newDate, setNewDate] = useState('')
  const [newReason, setNewReason] = useState('')

  async function load() {
    const { data } = await supabase.from('blocked_dates').select('*').order('blocked_date', { ascending: true })
    setBlocked((data ?? []) as BlockedDateRow[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function addBlock() {
    if (!newDate) return
    const { data, error } = await supabase
      .from('blocked_dates')
      .insert({ blocked_date: newDate, reason: newReason || 'Sperra' })
      .select()
      .single()
    if (!error && data) {
      setBlocked((prev) => [...prev, data as BlockedDateRow].sort((a, b) => a.blocked_date.localeCompare(b.blocked_date)))
      setNewDate('')
      setNewReason('')
    }
  }

  async function remove(id: string) {
    setBlocked((prev) => prev.filter((b) => b.id !== id))
    await supabase.from('blocked_dates').delete().eq('id', id)
  }

  if (loading) return <div style={sx('color:#8A8073;')}>…</div>

  return (
    <div style={sx('animation:fadein .3s ease;')}>
      <h1 style={sx('margin:0 0 6px;font-size:28px;font-weight:600;letter-spacing:-0.01em;')}>Sperra datoar</h1>
      <p style={sx('margin:0 0 24px;color:#8A8073;font-size:14px;font-weight:300;')}>
        Dagar som ikkje kan bookast — vedlikehald, privat bruk, vêr.
      </p>
      <div style={sx('display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:14px;max-width:900px;')}>
        <div style={sx('background:#FFFFFF;border:1px solid rgba(18,32,29,0.1);border-radius:16px;padding:24px;')}>
          <div style={sx('font-size:15px;font-weight:600;margin-bottom:16px;')}>Legg til</div>
          <label style={sx('display:block;font-size:12px;color:#8A8073;margin-bottom:6px;')}>Dato</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            style={sx('width:100%;box-sizing:border-box;border:1px solid rgba(18,32,29,0.15);border-radius:10px;padding:10px 12px;font-size:14px;margin-bottom:14px;')}
          />
          <label style={sx('display:block;font-size:12px;color:#8A8073;margin-bottom:6px;')}>Grunn</label>
          <input
            type="text"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            placeholder="t.d. Vedlikehald av omn"
            style={sx('width:100%;box-sizing:border-box;border:1px solid rgba(18,32,29,0.15);border-radius:10px;padding:10px 12px;font-size:14px;margin-bottom:18px;')}
          />
          <button onClick={addBlock} style={sx('background:#12201D;color:#F6F3EC;padding:10px 20px;border-radius:20px;font-size:14px;font-weight:500;')}>
            Sperr dato
          </button>
        </div>
        <div style={sx('background:#FFFFFF;border:1px solid rgba(18,32,29,0.1);border-radius:16px;padding:24px;')}>
          <div style={sx('font-size:15px;font-weight:600;margin-bottom:10px;')}>Kommande</div>
          {blocked.map((b) => (
            <div key={b.id} style={sx('display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 0;border-top:1px solid rgba(18,32,29,0.08);')}>
              <div>
                <div style={sx('font-size:14px;font-weight:500;')}>{fmtDateNn(b.blocked_date)}</div>
                <div style={sx('font-size:12px;color:#8A8073;margin-top:2px;')}>{b.reason}</div>
              </div>
              <button onClick={() => remove(b.id)} style={sx('background:none;color:#8A8073;font-size:13px;')}>
                Fjern
              </button>
            </div>
          ))}
          {blocked.length === 0 && <div style={sx('padding:20px 0;color:#8A8073;font-size:14px;')}>Ingen sperra datoar.</div>}
        </div>
      </div>
    </div>
  )
}
