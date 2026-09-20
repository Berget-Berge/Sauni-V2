import { useLanguage } from '../../context/LanguageContext'
import { sx } from '../../lib/style'

export function Hero() {
  const { t } = useLanguage()
  return (
    <header
      id="top"
      style={sx('position:relative;height:100vh;min-height:640px;width:100%;display:flex;align-items:flex-end;overflow:hidden;')}
    >
      <img
        src="/images/sauna-sol.jpg"
        alt="Fjordbu Sauna ved kaien i Urke"
        style={sx('position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 60%;transform:scale(1.03);')}
      />
      <div
        style={sx(
          'position:absolute;inset:0;background:linear-gradient(180deg, rgba(18,32,29,0.35) 0%, rgba(18,32,29,0.15) 40%, rgba(18,32,29,0.85) 100%);'
        )}
      />
      <div style={sx('position:relative;z-index:2;padding:0 40px 90px;width:100%;max-width:1240px;margin:0 auto;box-sizing:border-box;')}>
        <div style={sx('color:rgba(246,243,236,0.75);font-size:15px;margin-bottom:18px;')}>Urke, Hjørundfjorden</div>
        <h1
          style={sx(
            'margin:0;color:#F6F3EC;font-size:clamp(38px, 6.5vw, 84px);font-weight:600;line-height:1.04;letter-spacing:-0.02em;max-width:820px;text-wrap:balance;'
          )}
        >
          {t.heroTitle}
        </h1>
        <p style={sx('margin:22px 0 0;color:rgba(246,243,236,0.82);font-size:19px;max-width:480px;line-height:1.5;font-weight:300;text-wrap:pretty;')}>
          {t.heroBody}
        </p>
        <div style={sx('display:flex;gap:14px;margin-top:34px;flex-wrap:wrap;')}>
          <a
            href="#booking"
            style={sx('background:#B5602A;color:#FFFFFF;padding:14px 28px;border-radius:24px;font-size:16px;font-weight:500;display:inline-block;transition:transform .2s ease, background .2s;')}
          >
            {t.book}
          </a>
          <a
            href="#om"
            style={sx(
              'background:rgba(246,243,236,0.12);color:#F6F3EC;padding:14px 28px;border-radius:24px;font-size:16px;border:1px solid rgba(246,243,236,0.35);display:inline-block;transition:background .2s;'
            )}
          >
            {t.heroSecondary}
          </a>
        </div>
      </div>
    </header>
  )
}
