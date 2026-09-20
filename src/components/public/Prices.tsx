import { useLanguage } from '../../context/LanguageContext'
import { sx } from '../../lib/style'
import { formatHoursSummary } from '../../lib/hours'
import type { BusinessHoursRow, ServiceRow } from '../../lib/database.types'

interface Props {
  services: ServiceRow[]
  businessHours: BusinessHoursRow[]
  onChoose: (service: ServiceRow) => void
}

function formatPrice(price: number, lang: string): string {
  const n = Math.round(price).toLocaleString(lang === 'nn' ? 'nb-NO' : 'en-GB')
  return lang === 'nn' ? `${n} kr` : `${n} NOK`
}

function formatServiceSubtitle(durationMinutes: number, maxGuests: number, lang: string): string {
  const hours = durationMinutes / 60
  const hoursLabel = Number.isInteger(hours) ? String(hours) : hours.toFixed(1)
  if (lang === 'nn') {
    const timeWord = hours === 1 ? 'time' : 'timar'
    return `${hoursLabel} ${timeWord}, inntil ${maxGuests} personar`
  }
  const timeWord = hours === 1 ? 'hour' : 'hours'
  return `${hoursLabel} ${timeWord}, up to ${maxGuests} people`
}

export function Prices({ services, businessHours, onChoose }: Props) {
  const { lang, t } = useLanguage()
  const hoursRows = formatHoursSummary(businessHours, lang, t)

  return (
    <section id="prisar" style={sx('padding:120px 40px;background:#FFFFFF;')}>
      <div style={sx('max-width:1120px;margin:0 auto;')}>
        <div style={sx('color:#B5602A;font-size:15px;font-weight:500;margin-bottom:16px;')}>{t.navPrices}</div>
        <h2 style={sx('margin:0;font-size:clamp(30px, 4vw, 48px);font-weight:600;letter-spacing:-0.01em;line-height:1.12;max-width:640px;text-wrap:balance;')}>
          {t.pricesTitle}
        </h2>
        <div
          style={sx(
            'display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:1px;margin-top:60px;background:rgba(18,32,29,0.12);border:1px solid rgba(18,32,29,0.12);border-radius:20px;overflow:hidden;'
          )}
        >
          {services.map((p) => (
            <button
              key={p.id}
              onClick={() => onChoose(p)}
              style={sx('background:#FFFFFF;padding:40px 34px;display:flex;flex-direction:column;gap:10px;text-align:left;width:100%;box-sizing:border-box;')}
            >
              <div style={sx('font-size:13px;color:#B5602A;font-weight:600;letter-spacing:0.02em;')}>{p.name}</div>
              <div style={sx('font-size:40px;font-weight:600;letter-spacing:-0.02em;line-height:1;')}>{formatPrice(p.price, lang)}</div>
              <h3 style={sx('margin:6px 0 0;font-size:19px;font-weight:600;')}>
                {formatServiceSubtitle(p.duration_minutes, p.max_guests, lang)}
              </h3>
              <p style={sx('margin:0;font-size:15px;color:#8A8073;line-height:1.55;font-weight:300;')}>{p.description}</p>
            </button>
          ))}
          <div style={sx('background:#12201D;color:#F6F3EC;padding:40px 34px;display:flex;flex-direction:column;gap:14px;')}>
            <div style={sx('font-size:13px;color:#D97F4B;font-weight:600;letter-spacing:0.02em;')}>{t.hoursTag}</div>
            {hoursRows.map((h, i) => (
              <div
                key={i}
                style={sx('display:flex;justify-content:space-between;gap:12px;font-size:15px;padding:8px 0;border-bottom:1px solid rgba(246,243,236,0.1);')}
              >
                <span style={sx('color:rgba(246,243,236,0.6);')}>{h.k}</span>
                <span>{h.v}</span>
              </div>
            ))}
            <p style={sx('margin:6px 0 0;font-size:13px;color:rgba(246,243,236,0.55);line-height:1.5;font-weight:300;')}>{t.hoursNote}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
