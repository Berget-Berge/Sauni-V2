import { useLanguage } from '../../context/LanguageContext'
import { sx } from '../../lib/style'
import type { PublicClinicSettingsRow } from '../../lib/database.types'

export function Footer({ clinicSettings }: { clinicSettings: PublicClinicSettingsRow | null }) {
  const { t } = useLanguage()
  const phone = clinicSettings?.clinic_phone ?? '90 77 87 12'
  const email = clinicSettings?.clinic_email ?? 'post@fjordbusauna.no'
  const address = clinicSettings?.clinic_address ?? 'Urke småbåthamn, 6196 Norangsfjorden'
  const telHref = `tel:${phone.replace(/\s+/g, '')}`

  return (
    <footer
      id="kontakt"
      style={sx('background:#12201D;color:rgba(246,243,236,0.6);padding:70px 40px 40px;border-top:1px solid rgba(246,243,236,0.08);')}
    >
      <div style={sx('max-width:1120px;margin:0 auto;display:flex;justify-content:space-between;flex-wrap:wrap;gap:40px;')}>
        <div>
          <h3 style={sx('margin:0 0 12px;color:#F6F3EC;font-size:20px;font-weight:600;')}>Fjordbu Sauna</h3>
          <p style={sx('margin:0;max-width:280px;font-size:14px;line-height:1.6;font-weight:300;')}>{t.footerBody}</p>
        </div>
        <div style={sx('display:flex;flex-direction:column;gap:8px;')}>
          <h4 style={sx('margin:0 0 6px;color:#F6F3EC;font-size:13px;font-weight:500;')}>{t.contact}</h4>
          <a href={telHref} style={sx('font-size:14px;font-weight:300;')}>{phone}</a>
          <a href={`mailto:${email}`} style={sx('font-size:14px;font-weight:300;')}>{email}</a>
          <span style={sx('font-size:14px;font-weight:300;')}>{address}</span>
        </div>
        <div style={sx('display:flex;flex-direction:column;gap:8px;')}>
          <h4 style={sx('margin:0 0 6px;color:#F6F3EC;font-size:13px;font-weight:500;')}>{t.links}</h4>
          <a href="#om" style={sx('font-size:14px;font-weight:300;')}>{t.navAbout}</a>
          <a href="#prisar" style={sx('font-size:14px;font-weight:300;')}>{t.navPrices}</a>
          <a href="#booking" style={sx('font-size:14px;font-weight:300;')}>Booking</a>
          <a href="#reglar" style={sx('font-size:14px;font-weight:300;')}>{t.rulesTag}</a>
        </div>
        <div style={sx('display:flex;flex-direction:column;gap:8px;')}>
          <h4 style={sx('margin:0 0 6px;color:#F6F3EC;font-size:13px;font-weight:500;')}>{t.social}</h4>
          <a href="#kontakt" style={sx('font-size:14px;font-weight:300;')}>Facebook</a>
          <a href="#kontakt" style={sx('font-size:14px;font-weight:300;')}>Instagram</a>
        </div>
      </div>
      <div
        style={sx(
          'max-width:1120px;margin:60px auto 0;padding-top:24px;border-top:1px solid rgba(246,243,236,0.08);font-size:13px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;'
        )}
      >
        <span>© {new Date().getFullYear()} Fjordbu Sauna</span>
        <span>{t.footerNote}</span>
      </div>
    </footer>
  )
}
