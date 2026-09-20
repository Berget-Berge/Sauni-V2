import { useLanguage } from '../../context/LanguageContext'
import { sx } from '../../lib/style'

export function AboutUs() {
  const { t } = useLanguage()
  return (
    <section id="omoss" style={sx('padding:120px 40px;')}>
      <div style={sx('max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:50px;align-items:center;')}>
        <div style={sx('border-radius:20px;overflow:hidden;aspect-ratio:4/3;')}>
          <img src="/images/logo-fjord.jpg" alt="Fjordbu Sauna Urke" style={sx('width:100%;height:100%;object-fit:cover;display:block;')} />
        </div>
        <div>
          <div style={sx('color:#B5602A;font-size:15px;font-weight:500;margin-bottom:16px;')}>{t.aboutUsTag}</div>
          <h2 style={sx('margin:0;font-size:clamp(30px, 4vw, 48px);font-weight:600;letter-spacing:-0.01em;line-height:1.12;text-wrap:balance;')}>
            {t.aboutUsTitle}
          </h2>
          <p style={sx('margin:20px 0 0;font-size:18px;color:#8A8073;line-height:1.6;font-weight:300;max-width:480px;')}>{t.aboutUs1}</p>
          <p style={sx('margin:16px 0 0;font-size:18px;color:#8A8073;line-height:1.6;font-weight:300;max-width:480px;')}>{t.aboutUs2}</p>
        </div>
      </div>
    </section>
  )
}
