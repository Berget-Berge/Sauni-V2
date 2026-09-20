import { useEffect, useState } from 'react'
import { sx } from '../../lib/style'
import { supabase } from '../../lib/supabase'
import type { ServiceRow } from '../../lib/database.types'

export function Services() {
  const [services, setServices] = useState<ServiceRow[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase.from('services').select('*').order('sort_order', { ascending: true })
    setServices((data ?? []) as ServiceRow[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function patchLocal(id: string, patch: Partial<ServiceRow>) {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  async function save(id: string, patch: Partial<ServiceRow>) {
    await supabase.from('services').update(patch).eq('id', id)
  }

  async function addService() {
    const { data, error } = await supabase
      .from('services')
      .insert({ name: 'Ny pakke', description: 'Beskriving', duration_minutes: 120, price: 450, max_guests: 6, is_active: false, sort_order: services.length + 1 })
      .select()
      .single()
    if (!error && data) setServices((prev) => [...prev, data as ServiceRow])
  }

  async function remove(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id))
    await supabase.from('services').delete().eq('id', id)
  }

  if (loading) return <div style={sx('color:#8A8073;')}>…</div>

  return (
    <div style={sx('animation:fadein .3s ease;')}>
      <div style={sx('display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;margin-bottom:24px;')}>
        <h1 style={sx('margin:0;font-size:28px;font-weight:600;letter-spacing:-0.01em;')}>Pakkar</h1>
        <button onClick={addService} style={sx('background:#B5602A;color:#FFFFFF;padding:10px 20px;border-radius:20px;font-size:14px;font-weight:500;')}>
          + Ny pakke
        </button>
      </div>
      <p style={sx('margin:-10px 0 24px;color:#8A8073;font-size:14px;font-weight:300;')}>
        Endringar her visest automatisk under «Prisar» og i bookinga på nettsida.
      </p>
      <div style={sx('display:flex;flex-direction:column;gap:12px;')}>
        {services.map((s) => (
          <div
            key={s.id}
            style={sx(`background:#FFFFFF;border:1px solid rgba(18,32,29,0.1);border-radius:16px;padding:20px 24px;display:flex;flex-wrap:wrap;gap:16px;align-items:center;opacity:${s.is_active ? 1 : 0.55};`)}
          >
            <div style={sx('min-width:0;flex:1 1 260px;')}>
              <input
                type="text"
                value={s.name}
                onChange={(e) => patchLocal(s.id, { name: e.target.value })}
                onBlur={(e) => save(s.id, { name: e.target.value })}
                style={sx('width:100%;box-sizing:border-box;font-size:16px;font-weight:600;border:none;background:none;padding:4px 0;border-bottom:1px solid transparent;')}
              />
              <input
                type="text"
                value={s.description ?? ''}
                onChange={(e) => patchLocal(s.id, { description: e.target.value })}
                onBlur={(e) => save(s.id, { description: e.target.value })}
                style={sx('width:100%;box-sizing:border-box;font-size:13px;color:#8A8073;border:none;background:none;padding:2px 0;border-bottom:1px solid transparent;')}
              />
            </div>
            <div style={sx('flex:0 0 90px;')}>
              <div style={sx('font-size:11px;color:#8A8073;margin-bottom:4px;')}>Minutt</div>
              <input
                type="number"
                value={s.duration_minutes}
                onChange={(e) => patchLocal(s.id, { duration_minutes: Number(e.target.value) })}
                onBlur={(e) => save(s.id, { duration_minutes: Number(e.target.value) })}
                style={sx('width:100%;box-sizing:border-box;border:1px solid rgba(18,32,29,0.15);border-radius:8px;padding:7px 10px;font-size:14px;')}
              />
            </div>
            <div style={sx('flex:0 0 90px;')}>
              <div style={sx('font-size:11px;color:#8A8073;margin-bottom:4px;')}>Pris (kr)</div>
              <input
                type="number"
                value={s.price}
                onChange={(e) => patchLocal(s.id, { price: Number(e.target.value) })}
                onBlur={(e) => save(s.id, { price: Number(e.target.value) })}
                style={sx('width:100%;box-sizing:border-box;border:1px solid rgba(18,32,29,0.15);border-radius:8px;padding:7px 10px;font-size:14px;')}
              />
            </div>
            <div style={sx('flex:0 0 90px;')}>
              <div style={sx('font-size:11px;color:#8A8073;margin-bottom:4px;')}>Maks pers.</div>
              <input
                type="number"
                value={s.max_guests}
                onChange={(e) => patchLocal(s.id, { max_guests: Number(e.target.value) })}
                onBlur={(e) => save(s.id, { max_guests: Number(e.target.value) })}
                style={sx('width:100%;box-sizing:border-box;border:1px solid rgba(18,32,29,0.15);border-radius:8px;padding:7px 10px;font-size:14px;')}
              />
            </div>
            <div style={sx('display:flex;gap:8px;align-items:center;')}>
              <button
                onClick={() => {
                  patchLocal(s.id, { is_active: !s.is_active })
                  save(s.id, { is_active: !s.is_active })
                }}
                style={sx(`padding:7px 12px;border-radius:14px;font-size:12px;font-weight:600;background:${s.is_active ? 'rgba(60,90,94,0.15)' : 'rgba(18,32,29,0.08)'};color:${s.is_active ? '#3C5A5E' : '#8A8073'};`)}
              >
                {s.is_active ? 'Aktiv' : 'Skjult'}
              </button>
              <button onClick={() => remove(s.id)} style={sx('background:none;color:#8A8073;font-size:13px;padding:6px;')}>
                Slett
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
