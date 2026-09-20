import { useEffect, useState } from 'react'
import { sx } from '../../lib/style'
import { supabase } from '../../lib/supabase'
import type { ClinicSettingsRow } from '../../lib/database.types'

export function Settings() {
  const [settings, setSettings] = useState<ClinicSettingsRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('clinic_settings').select('*').limit(1).maybeSingle()
      setSettings((data ?? null) as ClinicSettingsRow | null)
      setLoading(false)
    }
    load()
  }, [])

  function patch(p: Partial<ClinicSettingsRow>) {
    setSettings((prev) => (prev ? { ...prev, ...p } : prev))
  }

  async function save() {
    if (!settings) return
    await supabase
      .from('clinic_settings')
      .update({
        clinic_name: settings.clinic_name,
        clinic_email: settings.clinic_email,
        clinic_phone: settings.clinic_phone,
        clinic_address: settings.clinic_address,
        slot_interval_minutes: settings.slot_interval_minutes,
        booking_notice_hours: settings.booking_notice_hours,
        cancellation_hours: settings.cancellation_hours,
        max_guests: settings.max_guests,
        key_box_code: settings.key_box_code,
      })
      .eq('id', settings.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  function newCode() {
    patch({ key_box_code: String(Math.floor(1000 + Math.random() * 9000)) })
  }

  if (loading) return <div style={sx('color:#8A8073;')}>…</div>
  if (!settings) return <div style={sx('color:#8A8073;')}>Ingen innstillingar funne. Køyr supabase/schema.sql først.</div>

  const infoFields: { label: string; key: keyof ClinicSettingsRow }[] = [
    { label: 'Namn', key: 'clinic_name' },
    { label: 'E-post', key: 'clinic_email' },
    { label: 'Telefon', key: 'clinic_phone' },
    { label: 'Adresse', key: 'clinic_address' },
  ]
  const numFields: { label: string; key: keyof ClinicSettingsRow; unit: string }[] = [
    { label: 'Slott-intervall', key: 'slot_interval_minutes', unit: 'min' },
    { label: 'Bookingfrist', key: 'booking_notice_hours', unit: 'timar' },
    { label: 'Avbestillingsfrist', key: 'cancellation_hours', unit: 'timar' },
    { label: 'Maks personar', key: 'max_guests', unit: 'pers.' },
  ]

  return (
    <div style={sx('animation:fadein .3s ease;')}>
      <h1 style={sx('margin:0 0 24px;font-size:28px;font-weight:600;letter-spacing:-0.01em;')}>Innstillingar</h1>
      <div style={sx('display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:14px;max-width:900px;')}>
        <div style={sx('background:#FFFFFF;border:1px solid rgba(18,32,29,0.1);border-radius:16px;padding:24px;display:flex;flex-direction:column;gap:14px;')}>
          <div style={sx('font-size:15px;font-weight:600;')}>Verksemd</div>
          {infoFields.map((f) => (
            <div key={f.key}>
              <label style={sx('display:block;font-size:12px;color:#8A8073;margin-bottom:6px;')}>{f.label}</label>
              <input
                type="text"
                value={String(settings[f.key] ?? '')}
                onChange={(e) => patch({ [f.key]: e.target.value } as Partial<ClinicSettingsRow>)}
                style={sx('width:100%;box-sizing:border-box;border:1px solid rgba(18,32,29,0.15);border-radius:10px;padding:10px 12px;font-size:14px;')}
              />
            </div>
          ))}
        </div>
        <div style={sx('display:flex;flex-direction:column;gap:14px;')}>
          <div style={sx('background:#FFFFFF;border:1px solid rgba(18,32,29,0.1);border-radius:16px;padding:24px;display:flex;flex-direction:column;gap:14px;')}>
            <div style={sx('font-size:15px;font-weight:600;')}>Booking</div>
            {numFields.map((f) => (
              <div key={f.key} style={sx('display:flex;justify-content:space-between;align-items:center;gap:12px;')}>
                <label style={sx('font-size:14px;')}>{f.label}</label>
                <div style={sx('display:flex;align-items:center;gap:6px;')}>
                  <input
                    type="number"
                    value={Number(settings[f.key] ?? 0)}
                    onChange={(e) => patch({ [f.key]: Number(e.target.value) } as Partial<ClinicSettingsRow>)}
                    style={sx('width:80px;border:1px solid rgba(18,32,29,0.15);border-radius:8px;padding:7px 10px;font-size:14px;text-align:right;')}
                  />
                  <span style={sx('font-size:12px;color:#8A8073;min-width:36px;')}>{f.unit}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={sx('background:#12201D;color:#F6F3EC;border-radius:16px;padding:24px;')}>
            <div style={sx('font-size:15px;font-weight:600;margin-bottom:4px;')}>Kode nøkkelboks</div>
            <div style={sx('font-size:12px;color:rgba(246,243,236,0.55);margin-bottom:14px;')}>Sendast til gjesten når bookinga er stadfesta. Byt koden jamleg.</div>
            <div style={sx('display:flex;gap:10px;align-items:center;')}>
              <input
                type="text"
                value={settings.key_box_code}
                maxLength={6}
                onChange={(e) => patch({ key_box_code: e.target.value })}
                style={sx('width:120px;background:rgba(246,243,236,0.08);border:1px solid rgba(246,243,236,0.2);border-radius:10px;padding:10px 12px;font-size:20px;font-weight:600;letter-spacing:0.15em;color:#F6F3EC;text-align:center;')}
              />
              <button onClick={newCode} style={sx('background:rgba(246,243,236,0.1);color:#F6F3EC;padding:10px 16px;border-radius:20px;font-size:13px;font-weight:500;')}>
                Generer ny
              </button>
            </div>
          </div>
        </div>
      </div>
      <button onClick={save} style={sx('margin-top:20px;background:#B5602A;color:#FFFFFF;padding:10px 22px;border-radius:20px;font-size:14px;font-weight:500;')}>
        {saved ? 'Lagra ✓' : 'Lagre endringar'}
      </button>
    </div>
  )
}
