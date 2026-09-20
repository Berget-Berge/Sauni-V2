import { useLanguage } from '../../context/LanguageContext'
import { sx } from '../../lib/style'

export function MapSection() {
  const { t } = useLanguage()
  return (
    <section id="kart" style={sx('padding:120px 40px;background:#FFFFFF;')}>
      <div style={sx('max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:50px;align-items:center;')}>
        <div>
          <div style={sx('color:#B5602A;font-size:15px;font-weight:500;margin-bottom:16px;')}>{t.navMap}</div>
          <h2 style={sx('margin:0;font-size:clamp(30px, 4vw, 48px);font-weight:600;letter-spacing:-0.01em;line-height:1.12;text-wrap:balance;')}>
            {t.mapTitle}
          </h2>
          <p style={sx('margin:20px 0 0;font-size:18px;color:#8A8073;line-height:1.6;font-weight:300;max-width:460px;')}>{t.mapBody}</p>
          <div style={sx('display:flex;flex-direction:column;gap:0;margin-top:30px;max-width:460px;')}>
            {t.directions.map((d, i) => (
              <div key={i} style={sx('display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-bottom:1px solid rgba(18,32,29,0.12);font-size:15px;')}>
                <span style={sx('color:#8A8073;')}>{d.k}</span>
                <span style={sx('text-align:right;')}>{d.v}</span>
              </div>
            ))}
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Urke+Hj%C3%B8rundfjorden"
            target="_blank"
            rel="noreferrer"
            style={sx('display:inline-block;margin-top:30px;background:#12201D;color:#F6F3EC;padding:13px 24px;border-radius:24px;font-size:15px;font-weight:500;')}
          >
            {t.mapCta}
          </a>
        </div>
        <div style={sx('border-radius:20px;overflow:hidden;border:1px solid rgba(18,32,29,0.12);aspect-ratio:4/3;min-height:320px;background:#E6E1D6;')}>
          <iframe
            src="https://www.google.com/maps?q=Urke,+Hj%C3%B8rundfjorden,+Norway&z=13&output=embed"
            title="Kart til Urke"
            style={sx('width:100%;height:100%;border:0;display:block;filter:saturate(0.85);')}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
