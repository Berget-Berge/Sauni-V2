import { useLanguage } from '../../context/LanguageContext'
import { sx } from '../../lib/style'

export function HowItWorks() {
  const { t } = useLanguage()
  return (
    <section id="slik" style={sx('padding:120px 40px;background:#FFFFFF;')}>
      <div style={sx('max-width:1120px;margin:0 auto;')}>
        <div style={sx('color:#B5602A;font-size:15px;font-weight:500;margin-bottom:16px;')}>{t.navHow}</div>
        <h2 style={sx('margin:0;font-size:clamp(30px, 4vw, 48px);font-weight:600;letter-spacing:-0.01em;line-height:1.12;max-width:640px;text-wrap:balance;')}>
          {t.howTitle}
        </h2>
        <div
          style={sx(
            'display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1px;margin-top:60px;background:rgba(18,32,29,0.12);border:1px solid rgba(18,32,29,0.12);border-radius:20px;overflow:hidden;'
          )}
        >
          {t.how.map((h, i) => (
            <div key={i} style={sx('background:#FFFFFF;padding:40px 34px;')}>
              <div style={sx('font-size:13px;color:#B5602A;font-weight:600;margin-bottom:14px;letter-spacing:0.02em;')}>{h.tag}</div>
              <h3 style={sx('margin:0 0 10px;font-size:19px;font-weight:600;')}>{h.title}</h3>
              <p style={sx('margin:0;font-size:15px;color:#8A8073;line-height:1.55;font-weight:300;')}>{h.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
