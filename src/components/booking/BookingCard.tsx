import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { sx } from '../../lib/style'
import { supabase } from '../../lib/supabase'
import { useBookedSlots } from '../../hooks/useBookedSlots'
import {
  generateSlotsForDate,
  isDateBookable,
  toDateOnly,
  type Slot,
} from '../../lib/availability'
import type { BlockedDateRow, BusinessHoursRow, PublicClinicSettingsRow, ServiceRow } from '../../lib/database.types'

interface Props {
  services: ServiceRow[]
  businessHours: BusinessHoursRow[]
  blockedDates: BlockedDateRow[]
  clinicSettings: PublicClinicSettingsRow | null
  selectedServiceId: string | null
}

function timeToHms(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:00`
}

export function BookingCard({ services, businessHours, blockedDates, clinicSettings, selectedServiceId }: Props) {
  const { lang, t } = useLanguage()
  const { slots: booked, loading: bookedLoading, reload: reloadBooked } = useBookedSlots(7)

  const [step, setStep] = useState(1)
  const [serviceId, setServiceId] = useState<string | null>(selectedServiceId)
  const [date, setDate] = useState<Date | null>(null)
  const [slot, setSlot] = useState<Slot | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [guests, setGuests] = useState('2')
  const [pay, setPay] = useState<'vipps' | 'card' | null>(null)
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedServiceId) {
      setServiceId(selectedServiceId)
      setDate(null)
      setSlot(null)
      setStep(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServiceId])

  const service = useMemo(
    () => services.find((s) => s.id === serviceId) ?? services[0] ?? null,
    [services, serviceId]
  )
  const maxGuests = service?.max_guests ?? 6

  const days = useMemo(() => {
    const today = new Date()
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      return d
    })
  }, [])

  function go(n: number) {
    setStep(n)
    setError(false)
  }

  function clampGuestsValue(v: string): string {
    const n = parseInt(v, 10)
    return String(Math.min(maxGuests, Math.max(1, Number.isFinite(n) ? n : 1)))
  }

  const slotsForSelectedDate =
    date && service && clinicSettings
      ? generateSlotsForDate({ date, service, businessHours, clinicSettings, blockedDates, appointments: booked })
      : []

  async function submitBooking() {
    if (!date || !slot || !service || !pay) return
    setSubmitting(true)
    setSubmitError(null)
    const { error: insertError } = await supabase.from('appointments').insert({
      full_name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      service_id: service.id,
      appointment_date: toDateOnly(date),
      start_time: timeToHms(slot.start),
      end_time: timeToHms(slot.end),
      guests: parseInt(clampGuestsValue(guests), 10),
      payment_method: pay,
      payment_status: 'pending',
      payment_reference: null,
      access_code: null,
      language: lang,
      status: 'pending',
      notes: null,
    })
    setSubmitting(false)
    if (insertError) {
      setSubmitError(insertError.message)
      return
    }
    reloadBooked()
    go(6)
  }

  function reset() {
    setStep(1)
    setDate(null)
    setSlot(null)
    setName('')
    setPhone('')
    setEmail('')
    setGuests('2')
    setPay(null)
    setError(false)
    setSubmitError(null)
  }

  const dots = [1, 2, 3, 4, 5]
  const dur = service ? service.duration_minutes / 60 : 2
  const durationLabel = `${Number.isInteger(dur) ? dur : dur.toFixed(1)} ${t.hours2}`
  const dateLabel = date ? date.toLocaleDateString(t.locale, { weekday: 'long', day: 'numeric', month: 'long' }) : ''
  const gN = Math.min(maxGuests, Math.max(1, parseInt(guests, 10) || 1))
  const guestsLabel = `${gN} ${gN === 1 ? t.persons1 : t.personsN}`
  const payName = pay === 'vipps' ? 'Vipps' : pay === 'card' ? t.cardTitle : ''
  const price = service?.price ?? 0
  const priceLabel = lang === 'nn' ? `${Math.round(price).toLocaleString('nb-NO')} kr` : `${Math.round(price).toLocaleString('en-GB')} NOK`

  const noDate = !date
  const noSlot = !slot
  const noPay = !pay

  function nextButtonStyle(disabled: boolean) {
    return sx(
      `background:${disabled ? 'rgba(246,243,236,0.12)' : '#B5602A'};color:${disabled ? 'rgba(246,243,236,0.35)' : '#FFFFFF'};padding:11px 26px;border-radius:22px;font-size:14px;font-weight:500;cursor:${disabled ? 'not-allowed' : 'pointer'};`
    )
  }

  if (!service) {
    return (
      <div style={sx('margin-top:40px;background:#1B2E28;border-radius:20px;padding:28px;max-width:760px;border:1px solid rgba(246,243,236,0.08);color:#F6F3EC;')}>
        {bookedLoading ? '…' : lang === 'nn' ? 'Ingen pakkar tilgjengeleg for augeblikket.' : 'No packages available right now.'}
      </div>
    )
  }

  return (
    <div style={sx('margin-top:40px;background:#1B2E28;border-radius:20px;padding:28px;max-width:760px;border:1px solid rgba(246,243,236,0.08);')}>
      <div style={sx('display:flex;gap:8px;margin-bottom:24px;')}>
        {dots.map((i) => (
          <div key={i} style={sx('height:4px;flex:1;background:rgba(246,243,236,0.15);border-radius:4px;overflow:hidden;')}>
            <i style={sx(`display:block;height:100%;background:#B5602A;transition:width .4s ease;width:${i <= Math.min(step, 5) ? '100%' : '0%'};`)} />
          </div>
        ))}
      </div>

      {step === 1 && (
        <div style={sx('animation:fadein .35s ease;')}>
          <div style={sx('font-size:18px;font-weight:600;margin-bottom:4px;')}>{t.s1Title}</div>
          <div style={sx('font-size:14px;color:rgba(246,243,236,0.55);margin-bottom:18px;font-weight:300;')}>{t.s1Sub}</div>
          <div style={sx('display:grid;grid-template-columns:repeat(auto-fit, minmax(60px, 1fr));gap:8px;')}>
            {days.map((d) => {
              const sel = date ? d.toDateString() === date.toDateString() : false
              const bookable =
                clinicSettings != null &&
                isDateBookable({ date: d, service, businessHours, clinicSettings, blockedDates, appointments: booked })
              return (
                <button
                  key={d.toISOString()}
                  disabled={!bookable}
                  onClick={() => {
                    setDate(d)
                    setSlot(null)
                  }}
                  style={sx(
                    `background:${sel ? '#B5602A' : 'rgba(246,243,236,0.05)'};border:1px solid ${sel ? '#B5602A' : 'rgba(246,243,236,0.12)'};border-radius:12px;padding:10px 4px;text-align:center;color:#F6F3EC;transition:all .2s;opacity:${bookable ? 1 : 0.35};cursor:${bookable ? 'pointer' : 'not-allowed'};`
                  )}
                >
                  <div style={sx(`font-size:12px;color:${sel ? 'rgba(255,255,255,0.85)' : 'rgba(246,243,236,0.6)'};text-transform:capitalize;`)}>
                    {t.dayNames[d.getDay()]}
                  </div>
                  <div style={sx('font-size:17px;font-weight:600;margin-top:2px;')}>{d.getDate()}</div>
                </button>
              )
            })}
          </div>
          <div style={sx('display:flex;justify-content:flex-end;align-items:center;margin-top:22px;')}>
            <button disabled={noDate} onClick={() => go(2)} style={nextButtonStyle(noDate)}>
              {t.next}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={sx('animation:fadein .35s ease;')}>
          <div style={sx('font-size:18px;font-weight:600;margin-bottom:4px;')}>{t.s2Title}</div>
          <div style={sx('font-size:14px;color:rgba(246,243,236,0.55);margin-bottom:18px;font-weight:300;')}>
            {dateLabel} · {durationLabel}
          </div>
          <div style={sx('display:grid;grid-template-columns:repeat(auto-fit, minmax(110px, 1fr));gap:8px;')}>
            {slotsForSelectedDate.map((s) => {
              const sel = slot?.label === s.label
              return (
                <button
                  key={s.label}
                  onClick={() => setSlot(s)}
                  style={sx(
                    `background:${sel ? '#B5602A' : 'rgba(246,243,236,0.05)'};border:1px solid ${sel ? '#B5602A' : 'rgba(246,243,236,0.12)'};border-radius:12px;padding:10px 8px;color:#F6F3EC;font-size:14px;text-align:center;transition:all .2s;`
                  )}
                >
                  <span style={sx('font-weight:500;')}>{s.label}</span>
                  <span style={sx('display:block;font-size:11px;color:rgba(246,243,236,0.6);margin-top:2px;')}>
                    – {`${String(s.end.getHours()).padStart(2, '0')}:${String(s.end.getMinutes()).padStart(2, '0')}`}
                  </span>
                </button>
              )
            })}
            {slotsForSelectedDate.length === 0 && (
              <div style={sx('color:rgba(246,243,236,0.5);font-size:14px;')}>
                {lang === 'nn' ? 'Ingen ledige tider denne dagen.' : 'No available times this day.'}
              </div>
            )}
          </div>
          <div style={sx('display:flex;justify-content:space-between;align-items:center;margin-top:22px;gap:12px;')}>
            <button onClick={() => go(1)} style={sx('background:none;color:rgba(246,243,236,0.55);font-size:14px;padding:12px 6px;')}>
              ← {t.back}
            </button>
            <button disabled={noSlot} onClick={() => go(3)} style={nextButtonStyle(noSlot)}>
              {t.next}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={sx('animation:fadein .35s ease;')}>
          <div style={sx('font-size:18px;font-weight:600;margin-bottom:4px;')}>{t.s3Title}</div>
          <div style={sx('font-size:14px;color:rgba(246,243,236,0.55);margin-bottom:18px;font-weight:300;')}>{t.s3Sub}</div>
          <div style={sx('display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;')}>
            <div>
              <label style={sx('font-size:13px;color:rgba(246,243,236,0.6);display:block;margin-bottom:6px;')}>{t.fName}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ola Nordmann"
                style={sx(
                  'width:100%;box-sizing:border-box;background:rgba(246,243,236,0.06);border:1px solid rgba(246,243,236,0.15);border-radius:10px;padding:10px 12px;color:#F6F3EC;font-size:14px;'
                )}
              />
            </div>
            <div>
              <label style={sx('font-size:13px;color:rgba(246,243,236,0.6);display:block;margin-bottom:6px;')}>{t.fPhone}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="900 00 000"
                style={sx(
                  'width:100%;box-sizing:border-box;background:rgba(246,243,236,0.06);border:1px solid rgba(246,243,236,0.15);border-radius:10px;padding:10px 12px;color:#F6F3EC;font-size:14px;'
                )}
              />
            </div>
            <div style={sx('grid-column:1/-1;')}>
              <label style={sx('font-size:13px;color:rgba(246,243,236,0.6);display:block;margin-bottom:6px;')}>{t.fEmail}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ola@epost.no"
                style={sx(
                  'width:100%;box-sizing:border-box;background:rgba(246,243,236,0.06);border:1px solid rgba(246,243,236,0.15);border-radius:10px;padding:10px 12px;color:#F6F3EC;font-size:14px;'
                )}
              />
            </div>
            <div style={sx('grid-column:1/-1;')}>
              <label style={sx('font-size:13px;color:rgba(246,243,236,0.6);display:block;margin-bottom:6px;')}>{t.fGuests}</label>
              <div style={sx('display:inline-flex;align-items:stretch;background:rgba(246,243,236,0.06);border:1px solid rgba(246,243,236,0.15);border-radius:10px;overflow:hidden;')}>
                <button
                  disabled={gN <= 1}
                  onClick={() => setGuests(String(Math.max(1, gN - 1)))}
                  style={sx(`width:42px;background:none;color:#F6F3EC;font-size:18px;opacity:${gN <= 1 ? 0.35 : 1};`)}
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={maxGuests}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  onBlur={() => setGuests(clampGuestsValue(guests))}
                  style={sx(
                    'width:56px;box-sizing:border-box;background:none;border:none;border-left:1px solid rgba(246,243,236,0.15);border-right:1px solid rgba(246,243,236,0.15);padding:10px 4px;color:#F6F3EC;font-size:15px;font-weight:600;text-align:center;'
                  )}
                />
                <button
                  disabled={gN >= maxGuests}
                  onClick={() => setGuests(String(Math.min(maxGuests, gN + 1)))}
                  style={sx(`width:42px;background:none;color:#F6F3EC;font-size:18px;opacity:${gN >= maxGuests ? 0.35 : 1};`)}
                >
                  +
                </button>
              </div>
              <div style={sx('font-size:12px;color:rgba(246,243,236,0.5);margin-top:6px;')}>{t.guestsHint.replace('{max}', String(maxGuests))}</div>
            </div>
          </div>
          {error && <div style={sx('margin-top:16px;font-size:14px;color:#D97F4B;')}>{t.formError}</div>}
          <div style={sx('display:flex;justify-content:space-between;align-items:center;margin-top:22px;gap:12px;')}>
            <button onClick={() => go(2)} style={sx('background:none;color:rgba(246,243,236,0.55);font-size:14px;padding:12px 6px;')}>
              ← {t.back}
            </button>
            <button
              onClick={() => {
                if (!name.trim() || !phone.trim() || !email.trim()) {
                  setError(true)
                  return
                }
                go(4)
              }}
              style={sx('background:#B5602A;color:#FFFFFF;padding:11px 26px;border-radius:22px;font-size:14px;font-weight:500;')}
            >
              {t.next}
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div style={sx('animation:fadein .35s ease;')}>
          <div style={sx('font-size:18px;font-weight:600;margin-bottom:4px;')}>{t.s4Title}</div>
          <div style={sx('font-size:14px;color:rgba(246,243,236,0.55);margin-bottom:18px;font-weight:300;')}>{t.s4Sub}</div>
          <div style={sx('display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:12px;')}>
            <button
              onClick={() => setPay('vipps')}
              style={sx(
                `background:${pay === 'vipps' ? 'rgba(181,96,42,0.25)' : 'rgba(246,243,236,0.05)'};border:1px solid ${pay === 'vipps' ? '#B5602A' : 'rgba(246,243,236,0.12)'};border-radius:12px;padding:14px 16px;color:#F6F3EC;text-align:left;display:flex;align-items:center;gap:16px;transition:all .2s;`
              )}
            >
              <span style={sx('width:44px;height:44px;border-radius:12px;background:#FF5B24;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#FFFFFF;flex-shrink:0;')}>
                vipps
              </span>
              <span>
                <span style={sx('display:block;font-weight:600;font-size:16px;')}>Vipps</span>
                <span style={sx('display:block;font-size:13px;color:rgba(246,243,236,0.6);margin-top:2px;')}>{t.vippsSub}</span>
              </span>
            </button>
            <button
              onClick={() => setPay('card')}
              style={sx(
                `background:${pay === 'card' ? 'rgba(181,96,42,0.25)' : 'rgba(246,243,236,0.05)'};border:1px solid ${pay === 'card' ? '#B5602A' : 'rgba(246,243,236,0.12)'};border-radius:12px;padding:14px 16px;color:#F6F3EC;text-align:left;display:flex;align-items:center;gap:16px;transition:all .2s;`
              )}
            >
              <span style={sx('width:44px;height:44px;border-radius:12px;background:#3C5A5E;display:flex;align-items:center;justify-content:center;flex-shrink:0;')}>
                <span style={sx('width:24px;height:16px;border:2px solid #F6F3EC;border-radius:3px;display:block;position:relative;')}>
                  <span style={sx('position:absolute;left:0;right:0;top:4px;height:2px;background:#F6F3EC;display:block;')} />
                </span>
              </span>
              <span>
                <span style={sx('display:block;font-weight:600;font-size:16px;')}>{t.cardTitle}</span>
                <span style={sx('display:block;font-size:13px;color:rgba(246,243,236,0.6);margin-top:2px;')}>{t.cardSub}</span>
              </span>
            </button>
          </div>
          <div style={sx('display:flex;justify-content:space-between;align-items:center;margin-top:22px;gap:12px;')}>
            <button onClick={() => go(3)} style={sx('background:none;color:rgba(246,243,236,0.55);font-size:14px;padding:12px 6px;')}>
              ← {t.back}
            </button>
            <button disabled={noPay} onClick={() => go(5)} style={nextButtonStyle(noPay)}>
              {t.toSummary}
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div style={sx('animation:fadein .35s ease;')}>
          <div style={sx('font-size:18px;font-weight:600;margin-bottom:4px;')}>{t.s5Title}</div>
          <div style={sx('font-size:14px;color:rgba(246,243,236,0.55);margin-bottom:18px;font-weight:300;')}>{t.s5Sub}</div>
          <div style={sx('background:rgba(246,243,236,0.04);border:1px solid rgba(246,243,236,0.1);border-radius:14px;padding:14px 18px;')}>
            {[
              { k: t.date, v: dateLabel },
              { k: t.time, v: slot ? `${slot.label} – ${String(slot.end.getHours()).padStart(2, '0')}:${String(slot.end.getMinutes()).padStart(2, '0')}` : '' },
              { k: t.fName, v: name },
              { k: t.persons, v: guestsLabel },
              { k: t.fPhone, v: phone },
              { k: t.payment, v: payName },
            ].map((r) => (
              <div key={r.k} style={sx('display:flex;justify-content:space-between;gap:16px;font-size:15px;padding:8px 0;border-bottom:1px solid rgba(246,243,236,0.08);')}>
                <span style={sx('color:rgba(246,243,236,0.55);')}>{r.k}</span>
                <span style={sx('text-align:right;')}>{r.v}</span>
              </div>
            ))}
            <div style={sx('display:flex;justify-content:space-between;gap:16px;font-size:17px;font-weight:600;padding:12px 0 4px;')}>
              <span style={sx('color:rgba(246,243,236,0.55);font-weight:400;')}>{t.price}</span>
              <span>{priceLabel}</span>
            </div>
          </div>
          {submitError && <div style={sx('margin-top:16px;font-size:14px;color:#D97F4B;')}>{submitError}</div>}
          <div style={sx('display:flex;justify-content:space-between;align-items:center;margin-top:22px;gap:12px;')}>
            <button onClick={() => go(4)} style={sx('background:none;color:rgba(246,243,236,0.55);font-size:14px;padding:12px 6px;')}>
              ← {t.back}
            </button>
            <button
              disabled={submitting}
              onClick={submitBooking}
              style={sx(`background:#B5602A;color:#FFFFFF;padding:11px 26px;border-radius:22px;font-size:14px;font-weight:500;opacity:${submitting ? 0.6 : 1};`)}
            >
              {submitting ? '…' : `${t.payWith} ${payName} · ${priceLabel}`}
            </button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div style={sx('text-align:center;padding:8px 0;animation:fadein .35s ease;')}>
          <div style={sx('width:64px;height:64px;border-radius:50%;background:#B5602A;margin:0 auto 24px;display:flex;align-items:center;justify-content:center;font-size:28px;color:#FFFFFF;')}>
            ✓
          </div>
          <h3 style={sx('margin:0 0 10px;font-size:26px;font-weight:600;')}>{t.doneTitle}</h3>
          <p style={sx('margin:0 0 30px;color:rgba(246,243,236,0.6);font-size:15px;')}>{t.doneBody}</p>
          <div style={sx('text-align:left;background:rgba(246,243,236,0.04);border:1px solid rgba(246,243,236,0.1);border-radius:16px;padding:24px;max-width:400px;margin:0 auto 30px;')}>
            {[
              { k: t.date, v: dateLabel },
              { k: t.time, v: slot ? slot.label : '' },
              { k: t.sentTo, v: email },
            ].map((r) => (
              <div key={r.k} style={sx('display:flex;justify-content:space-between;gap:16px;font-size:15px;padding:8px 0;border-bottom:1px solid rgba(246,243,236,0.08);')}>
                <span style={sx('color:rgba(246,243,236,0.55);')}>{r.k}</span>
                <span style={sx('text-align:right;')}>{r.v}</span>
              </div>
            ))}
          </div>
          <button onClick={reset} style={sx('background:#B5602A;color:#FFFFFF;padding:11px 26px;border-radius:22px;font-size:14px;font-weight:500;')}>
            {t.bookAgain}
          </button>
        </div>
      )}
    </div>
  )
}
