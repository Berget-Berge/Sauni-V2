import type { CSSProperties } from 'react'

/**
 * Parses a literal CSS declaration string (the same inline `style="..."`
 * strings from the approved design mockup, Fjordbu Sauna v2.dc.html /
 * Fjordbu Sauna Admin.dc.html) into a React CSSProperties object.
 *
 * The design is a STRICT, do-not-change contract (see PROMPT - Fjordbu
 * Sauna backend.md). Porting the original CSS strings verbatim through
 * this helper guarantees pixel fidelity instead of hand-retyping every
 * declaration as camelCase, which is where visual drift usually creeps in.
 */
export function sx(css: string): CSSProperties {
  const out: Record<string, string> = {}
  for (const decl of css.split(';')) {
    const trimmed = decl.trim()
    if (!trimmed) continue
    const idx = trimmed.indexOf(':')
    if (idx === -1) continue
    const prop = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    if (!prop || !value) continue
    const camel = prop
      .replace(/^-webkit-/, 'Webkit')
      .replace(/^-moz-/, 'Moz')
      .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    out[camel] = value
  }
  return out as CSSProperties
}

export const colors = {
  bg: '#F6F3EC',
  dark: '#12201D',
  cardDark: '#1B2E28',
  accent: '#B5602A',
  accentHover: '#D97F4B',
  blueGreen: '#3C5A5E',
  muted: '#8A8073',
  white: '#FFFFFF',
}
