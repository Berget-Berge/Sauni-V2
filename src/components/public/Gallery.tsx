import { useLanguage } from '../../context/LanguageContext'
import { sx } from '../../lib/style'

const IMG = sx('width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease;')
const CELL = sx('overflow:hidden;border-radius:16px;display:block;')

export function Gallery() {
  const { t } = useLanguage()
  return (
    <section id="galleri" style={sx('padding:120px 40px;')}>
      <div style={sx('max-width:1120px;margin:0 auto;')}>
        <div style={sx('color:#B5602A;font-size:15px;font-weight:500;margin-bottom:16px;')}>{t.navGallery}</div>
        <h2 style={sx('margin:0;font-size:clamp(30px, 4vw, 48px);font-weight:600;letter-spacing:-0.01em;line-height:1.12;max-width:640px;')}>
          {t.galleryTitle}
        </h2>
        <div style={sx('display:grid;grid-template-columns:repeat(6, minmax(0,1fr));grid-auto-rows:clamp(110px, 16vw, 180px);gap:14px;margin-top:50px;')}>
          <a href="#galleri" style={{ ...CELL, gridColumn: '1/4', gridRow: '1/3' }}>
            <img src="/images/interior.jpg" alt="Interiør med utsikt over fjorden" style={IMG} />
          </a>
          <a href="#galleri" style={{ ...CELL, gridColumn: '4/7', gridRow: '1/2' }}>
            <img src="/images/stup.jpg" alt="Stup i fjorden" style={{ ...IMG, objectPosition: 'center 60%' }} />
          </a>
          <a href="#galleri" style={{ ...CELL, gridColumn: '4/5', gridRow: '2/3' }}>
            <img src="/images/dusj.jpg" alt="Ferskvassdusj" style={IMG} />
          </a>
          <a href="#galleri" style={{ ...CELL, gridColumn: '5/6', gridRow: '2/3' }}>
            <img src="/images/badestige.jpg" alt="Badestige" style={IMG} />
          </a>
          <a href="#galleri" style={{ ...CELL, gridColumn: '6/7', gridRow: '2/3' }}>
            <img src="/images/sauna-skilt.jpg" alt="Fjordbu Sauna" style={{ ...IMG, objectPosition: 'left center' }} />
          </a>
          <a href="#galleri" style={{ ...CELL, gridColumn: '1/3', gridRow: '3/4' }}>
            <img src="/images/sauna-sol.jpg" alt="Saunaen i sol" style={IMG} />
          </a>
          <a href="#galleri" style={{ ...CELL, gridColumn: '3/7', gridRow: '3/4' }}>
            <img src="/images/kveld.jpg" alt="Saunaen om kvelden" style={IMG} />
          </a>
        </div>
      </div>
    </section>
  )
}
