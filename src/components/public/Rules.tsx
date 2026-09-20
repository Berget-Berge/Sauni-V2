import { useLanguage } from '../../context/LanguageContext'
import { sx } from '../../lib/style'
import type { RuleRow } from '../../lib/database.types'

export function Rules({ rules }: { rules: RuleRow[] }) {
  const { lang, t } = useLanguage()
  return (
    <section id="reglar" style={sx('padding:120px 40px;background:#3C5A5E;color:#F6F3EC;')}>
      <div style={sx('max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:60px;align-items:start;')}>
        <div>
          <div style={sx('color:#D97F4B;font-size:15px;font-weight:500;margin-bottom:16px;')}>{t.rulesTag}</div>
          <h2 style={sx('margin:0;font-size:clamp(30px, 4vw, 48px);font-weight:600;letter-spacing:-0.01em;line-height:1.12;text-wrap:balance;')}>
            {t.rulesTitle}
          </h2>
          <p style={sx('margin:20px 0 0;font-size:18px;color:rgba(246,243,236,0.7);line-height:1.6;font-weight:300;max-width:440px;')}>{t.rulesBody}</p>
        </div>
        <div style={sx('display:flex;flex-direction:column;gap:0;')}>
          {rules.map((r, i) => (
            <div key={r.id} style={sx('display:flex;gap:18px;padding:18px 0;border-bottom:1px solid rgba(246,243,236,0.15);align-items:baseline;')}>
              <span style={sx('font-size:13px;font-weight:600;color:#D97F4B;min-width:28px;')}>{String(i + 1).padStart(2, '0')}</span>
              <span style={sx('font-size:16px;line-height:1.5;font-weight:300;')}>{lang === 'nn' ? r.text_nn : r.text_en}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
