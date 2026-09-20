import { useLanguage } from '../../context/LanguageContext'
import { sx } from '../../lib/style'

export function About() {
  const { t } = useLanguage()
  return (
    <section id="om" style={sx('padding:140px 40px 120px;text-align:center;')}>
      <div style={sx('max-width:1120px;margin:0 auto;')}>
        <div style={sx('color:#B5602A;font-size:15px;font-weight:500;margin-bottom:16px;')}>{t.navAbout}</div>
        <h2 style={sx('margin:0 auto;font-size:clamp(30px, 4vw, 48px);font-weight:600;letter-spacing:-0.01em;line-height:1.12;max-width:780px;text-wrap:balance;')}>
          {t.aboutTitle}
        </h2>
        <p style={sx('font-size:18px;color:#8A8073;max-width:600px;margin:22px auto 0;line-height:1.6;font-weight:300;text-wrap:pretty;')}>
          {t.aboutBody}
        </p>
      </div>
    </section>
  )
}
