import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { sx } from '../../lib/style'
import { useIsMobile } from '../../hooks/useIsMobile'

export function Nav() {
  const { lang, setLang, t } = useLanguage()
  const on = lang === 'nn'
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '#om', label: t.navAbout },
    { href: '#prisar', label: t.navPrices },
    { href: '#slik', label: t.navHow },
    { href: '#galleri', label: t.navGallery },
    { href: '#faq', label: 'FAQ' },
    { href: '#kart', label: t.navMap },
  ]

  const langToggle = (
    <div style={sx('display:flex;border:1px solid rgba(246,243,236,0.3);border-radius:20px;overflow:hidden;flex-shrink:0;')}>
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
  )

  // Mobile: a fixed-height bar (logo + language + hamburger) that never
  // wraps, so it can't grow and push the hero content down. Tapping the
  // hamburger opens the link list as an absolutely-positioned panel that
  // overlays the page instead of pushing it.
  if (isMobile) {
    return (
      <nav
        style={sx(
          'position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(18,32,29,0.85);backdrop-filter:blur(16px) saturate(150%);-webkit-backdrop-filter:blur(16px) saturate(150%);'
        )}
      >
        <div style={sx('display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;height:24px;')}>
          <a href="#top" onClick={() => setOpen(false)} style={sx('color:#F6F3EC;font-size:16px;font-weight:600;letter-spacing:0.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;')}>
            Fjordbu Sauna
          </a>
          <div style={sx('display:flex;align-items:center;gap:10px;flex-shrink:0;')}>
            {langToggle}
            <button
              aria-label={open ? 'Lukk meny' : 'Opne meny'}
              onClick={() => setOpen((o) => !o)}
              style={sx('width:36px;height:36px;background:rgba(246,243,236,0.08);border:1px solid rgba(246,243,236,0.25);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;flex-shrink:0;')}
            >
              <span style={sx(`display:block;width:16px;height:2px;background:#F6F3EC;border-radius:2px;transition:transform .2s;transform:${open ? 'translateY(6px) rotate(45deg)' : 'none'};`)} />
              <span style={sx(`display:block;width:16px;height:2px;background:#F6F3EC;border-radius:2px;transition:opacity .2s;opacity:${open ? 0 : 1};`)} />
              <span style={sx(`display:block;width:16px;height:2px;background:#F6F3EC;border-radius:2px;transition:transform .2s;transform:${open ? 'translateY(-6px) rotate(-45deg)' : 'none'};`)} />
            </button>
          </div>
        </div>
        {open && (
          <div
            style={sx(
              'position:absolute;top:100%;left:0;right:0;background:#12201D;border-top:1px solid rgba(246,243,236,0.12);padding:8px 20px 20px;display:flex;flex-direction:column;box-shadow:0 16px 32px rgba(0,0,0,0.35);'
            )}
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={sx('color:rgba(246,243,236,0.85);font-size:15px;padding:14px 4px;border-bottom:1px solid rgba(246,243,236,0.08);')}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              style={sx('margin-top:16px;background:#B5602A;color:#FFFFFF;padding:12px 20px;border-radius:20px;font-size:14px;font-weight:500;text-align:center;')}
            >
              {t.book}
            </a>
          </div>
        )}
      </nav>
    )
  }

  return (
    <nav
      style={sx(
        'position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:16px 40px;background:rgba(18,32,29,0.6);backdrop-filter:blur(16px) saturate(150%);-webkit-backdrop-filter:blur(16px) saturate(150%);'
      )}
    >
      <a href="#top" style={sx('color:#F6F3EC;font-size:17px;font-weight:600;letter-spacing:0.2px;')}>
        Fjordbu Sauna
      </a>
      <div style={sx('display:flex;gap:28px;align-items:center;justify-content:center;')}>
        {links.map((l) => (
          <a key={l.href} href={l.href} style={sx('color:rgba(246,243,236,0.85);font-size:14px;white-space:nowrap;')}>
            {l.label}
          </a>
        ))}
      </div>
      <div style={sx('display:flex;align-items:center;gap:12px;')}>
        {langToggle}
        <a href="#booking" style={sx('background:#B5602A;color:#FFFFFF;padding:9px 20px;border-radius:20px;font-size:14px;font-weight:500;white-space:nowrap;')}>
          {t.book}
        </a>
      </div>
    </nav>
  )
}
