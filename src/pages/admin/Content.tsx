import { useEffect, useState } from 'react'
import { sx } from '../../lib/style'
import { supabase } from '../../lib/supabase'
import type { FaqRow, RuleRow } from '../../lib/database.types'

type Tab = 'faq' | 'rules'

export function Content() {
  const [tab, setTab] = useState<Tab>('faq')
  const [faq, setFaq] = useState<FaqRow[]>([])
  const [rules, setRules] = useState<RuleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  async function load() {
    const [f, r] = await Promise.all([
      supabase.from('faq').select('*').order('sort_order', { ascending: true }),
      supabase.from('rules').select('*').order('sort_order', { ascending: true }),
    ])
    setFaq((f.data ?? []) as FaqRow[])
    setRules((r.data ?? []) as RuleRow[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function patchFaq(id: string, p: Partial<FaqRow>) {
    setFaq((prev) => prev.map((f) => (f.id === id ? { ...f, ...p } : f)))
  }
  function patchRule(id: string, p: Partial<RuleRow>) {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...p } : r)))
  }

  async function addFaq() {
    const { data, error } = await supabase
      .from('faq')
      .insert({ question_nn: '', question_en: '', answer_nn: '', answer_en: '', sort_order: faq.length + 1, is_active: true })
      .select()
      .single()
    if (!error && data) setFaq((prev) => [...prev, data as FaqRow])
  }
  async function addRule() {
    const { data, error } = await supabase
      .from('rules')
      .insert({ text_nn: '', text_en: '', sort_order: rules.length + 1, is_active: true })
      .select()
      .single()
    if (!error && data) setRules((prev) => [...prev, data as RuleRow])
  }

  async function removeFaq(id: string) {
    setFaq((prev) => prev.filter((f) => f.id !== id))
    await supabase.from('faq').delete().eq('id', id)
  }
  async function removeRule(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id))
    await supabase.from('rules').delete().eq('id', id)
  }

  async function save() {
    await Promise.all([
      ...faq.map((f) =>
        supabase.from('faq').update({ question_nn: f.question_nn, question_en: f.question_en, answer_nn: f.answer_nn, answer_en: f.answer_en }).eq('id', f.id)
      ),
      ...rules.map((r) => supabase.from('rules').update({ text_nn: r.text_nn, text_en: r.text_en }).eq('id', r.id)),
    ])
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  if (loading) return <div style={sx('color:#8A8073;')}>…</div>

  const textareaStyle = sx('width:100%;box-sizing:border-box;border:1px solid rgba(18,32,29,0.15);border-radius:8px;padding:8px 10px;font-size:13px;resize:vertical;line-height:1.45;')

  return (
    <div style={sx('animation:fadein .3s ease;')}>
      <h1 style={sx('margin:0 0 6px;font-size:28px;font-weight:600;letter-spacing:-0.01em;')}>FAQ og reglar</h1>
      <p style={sx('margin:0 0 24px;color:#8A8073;font-size:14px;font-weight:300;')}>Tekst på begge språk. Visest direkte på nettsida.</p>
      <div style={sx('display:flex;gap:8px;margin-bottom:20px;')}>
        <button
          onClick={() => setTab('faq')}
          style={sx(`padding:8px 16px;border-radius:18px;font-size:13px;font-weight:500;background:${tab === 'faq' ? '#12201D' : '#FFFFFF'};color:${tab === 'faq' ? '#F6F3EC' : '#12201D'};`)}
        >
          FAQ
        </button>
        <button
          onClick={() => setTab('rules')}
          style={sx(`padding:8px 16px;border-radius:18px;font-size:13px;font-weight:500;background:${tab === 'rules' ? '#12201D' : '#FFFFFF'};color:${tab === 'rules' ? '#F6F3EC' : '#12201D'};`)}
        >
          Reglar
        </button>
      </div>

      {tab === 'faq' && (
        <div style={sx('display:flex;flex-direction:column;gap:12px;max-width:900px;')}>
          {faq.map((f, i) => (
            <div key={f.id} style={sx('background:#FFFFFF;border:1px solid rgba(18,32,29,0.1);border-radius:16px;padding:18px 22px;display:grid;grid-template-columns:32px minmax(0,1fr) minmax(0,1fr) auto;gap:16px;align-items:start;')}>
              <span style={sx('font-size:12px;font-weight:600;color:#B5602A;padding-top:8px;')}>{String(i + 1).padStart(2, '0')}</span>
              <div style={sx('display:flex;flex-direction:column;gap:8px;')}>
                <div style={sx('font-size:11px;color:#8A8073;')}>Spørsmål (NN)</div>
                <input value={f.question_nn} onChange={(e) => patchFaq(f.id, { question_nn: e.target.value })} style={sx('width:100%;box-sizing:border-box;border:1px solid rgba(18,32,29,0.15);border-radius:8px;padding:8px 10px;font-size:13px;')} />
                <div style={sx('font-size:11px;color:#8A8073;')}>Svar (NN)</div>
                <textarea value={f.answer_nn} onChange={(e) => patchFaq(f.id, { answer_nn: e.target.value })} rows={3} style={textareaStyle} />
              </div>
              <div style={sx('display:flex;flex-direction:column;gap:8px;')}>
                <div style={sx('font-size:11px;color:#8A8073;')}>Question (EN)</div>
                <input value={f.question_en} onChange={(e) => patchFaq(f.id, { question_en: e.target.value })} style={sx('width:100%;box-sizing:border-box;border:1px solid rgba(18,32,29,0.15);border-radius:8px;padding:8px 10px;font-size:13px;')} />
                <div style={sx('font-size:11px;color:#8A8073;')}>Answer (EN)</div>
                <textarea value={f.answer_en} onChange={(e) => patchFaq(f.id, { answer_en: e.target.value })} rows={3} style={textareaStyle} />
              </div>
              <button onClick={() => removeFaq(f.id)} style={sx('background:none;color:#8A8073;font-size:13px;padding-top:8px;')}>
                Slett
              </button>
            </div>
          ))}
          <button onClick={addFaq} style={sx('align-self:flex-start;background:#FFFFFF;color:#12201D;padding:10px 18px;border-radius:20px;font-size:14px;font-weight:500;border:1px dashed rgba(18,32,29,0.3);')}>
            + Legg til
          </button>
        </div>
      )}

      {tab === 'rules' && (
        <div style={sx('display:flex;flex-direction:column;gap:12px;max-width:900px;')}>
          {rules.map((r, i) => (
            <div key={r.id} style={sx('background:#FFFFFF;border:1px solid rgba(18,32,29,0.1);border-radius:16px;padding:18px 22px;display:grid;grid-template-columns:32px minmax(0,1fr) minmax(0,1fr) auto;gap:16px;align-items:start;')}>
              <span style={sx('font-size:12px;font-weight:600;color:#B5602A;padding-top:8px;')}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div style={sx('font-size:11px;color:#8A8073;margin-bottom:4px;')}>Nynorsk</div>
                <textarea value={r.text_nn} onChange={(e) => patchRule(r.id, { text_nn: e.target.value })} rows={3} style={textareaStyle} />
              </div>
              <div>
                <div style={sx('font-size:11px;color:#8A8073;margin-bottom:4px;')}>English</div>
                <textarea value={r.text_en} onChange={(e) => patchRule(r.id, { text_en: e.target.value })} rows={3} style={textareaStyle} />
              </div>
              <button onClick={() => removeRule(r.id)} style={sx('background:none;color:#8A8073;font-size:13px;padding-top:8px;')}>
                Slett
              </button>
            </div>
          ))}
          <button onClick={addRule} style={sx('align-self:flex-start;background:#FFFFFF;color:#12201D;padding:10px 18px;border-radius:20px;font-size:14px;font-weight:500;border:1px dashed rgba(18,32,29,0.3);')}>
            + Legg til
          </button>
        </div>
      )}

      <button onClick={save} style={sx('margin-top:20px;background:#B5602A;color:#FFFFFF;padding:10px 22px;border-radius:20px;font-size:14px;font-weight:500;')}>
        {saved ? 'Lagra ✓' : 'Lagre endringar'}
      </button>
    </div>
  )
}
