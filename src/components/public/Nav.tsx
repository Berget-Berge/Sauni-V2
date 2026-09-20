import { useLanguage } from '../../context/LanguageContext'
import { sx } from '../../lib/style'

export function Nav() {
  const { lang, setLang, t } = useLanguage()
  const on = lang === 'nn'

  return (
    <nav
      style={sx(
        'position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:16px 40px;background:rgba(18,32,29,0.6);backdrop-filter:blur(16px) saturate(150%);-webkit-backdrop-filter:blur(16px) saturate(150%);'
      )}
    >
      <a href="#top" style={sx('color:#F6F3EC;font-size:17px;font-weight:600;letter-spacing:0.2px;')}>
        Fjordbu Sauna
      </a>
      <div style={sx('display:flex;gap:28px;align-items:center;flex-wrap:wrap;justify-content:center;')}>
        <a href="#om" style={sx('color:rgba(246,243,236,0.85);font-size:14px;')}>{t.navAbout}</a>
        <a href="#prisar" style={sx('color:rgba(246,243,236,0.85);font-size:14px;')}>{t.navPrices}</a>
        <a href="#slik" style={sx('color:rgba(246,243,236,0.85);font-size:14px;')}>{t.navHow}</a>
        <a href="#galleri" style={sx('color:rgba(246,243,236,0.85);font-size:14px;')}>{t.navGallery}</a>
        <a href="#faq" style={sx('color:rgba(246,243,236,0.85);font-size:14px;')}>FAQ</a>
        <a href="#kart" style={sx('color:rgba(246,243,236,0.85);font-size:14px;')}>{t.navMap}</a>
      </div>
      <div style={sx('display:flex;align-items:center;gap:12px;')}>
        <div style={sx('display:flex;border:1px solid rgba(246,243,236,0.3);border-radius:20px;overflow:hidden;')}>
          <button
            onClick={() => setLang('nn')}
            style={sx(`padding:7px 12px;font-size:12px;font-weight:600;background:${on ? '#F6F3EC' : 'transparent'};color:${on ? '#12201D' : 'rgba(246,243,236,0.8)'};`)}
          >
            NN
          </button>
          <button
            onClick={() => setLang('en')}
            style={sx(`padding:7px 12px;font-size:12px;font-weight:600;background:${on ? 'transparent' : '#F6F3EC'};color:${on ? 'rgba(246,243,236,0.8)' : '#12201D'};`)}
          >
            EN
          </button>
        </div>
        <a href="#booking" style={sx('background:#B5602A;color:#FFFFFF;padding:9px 20px;border-radius:20px;font-size:14px;font-weight:500;white-space:nowrap;')}>
          {t.book}
        </a>
      </div>
    </nav>
  )
}
