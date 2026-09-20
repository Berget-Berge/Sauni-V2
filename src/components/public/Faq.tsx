import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { sx } from '../../lib/style'
import type { FaqRow } from '../../lib/database.types'

export function Faq({ faq }: { faq: FaqRow[] }) {
  const { lang, t } = useLanguage()
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section id="faq" style={sx('padding:120px 40px;')}>
      <div style={sx('max-width:800px;margin:0 auto;')}>
        <div style={sx('color:#B5602A;font-size:15px;font-weight:500;margin-bottom:16px;')}>FAQ</div>
        <h2 style={sx('margin:0 0 50px;font-size:clamp(30px, 4vw, 48px);font-weight:600;letter-spacing:-0.01em;line-height:1.12;text-wrap:balance;')}>
          {t.faqTitle}
        </h2>
        <div style={sx('border-top:1px solid rgba(18,32,29,0.12);')}>
          {faq.map((f) => {
            const isOpen = open === f.id
            return (
              <div key={f.id} style={sx('border-bottom:1px solid rgba(18,32,29,0.12);')}>
                <button
                  onClick={() => setOpen(isOpen ? null : f.id)}
                  style={sx(
                    'width:100%;background:none;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:22px 0;text-align:left;color:#12201D;font-size:18px;font-weight:500;'
                  )}
                >
                  <span>{lang === 'nn' ? f.question_nn : f.question_en}</span>
                  <span
                    style={sx(`font-size:22px;color:#B5602A;transition:transform .3s;transform:${isOpen ? 'rotate(45deg)' : 'rotate(0deg)'};line-height:1;flex-shrink:0;`)}
                  >
                    +
                  </span>
                </button>
                <div style={sx(`display:grid;grid-template-rows:${isOpen ? '1fr' : '0fr'};transition:grid-template-rows .3s ease;`)}>
                  <div style={sx('overflow:hidden;')}>
                    <p style={sx('margin:0 0 24px;font-size:16px;color:#8A8073;line-height:1.6;font-weight:300;max-width:640px;')}>
                      {lang === 'nn' ? f.answer_nn : f.answer_en}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
