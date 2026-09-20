import type { BusinessHoursRow } from './database.types'
import type { Copy, Lang } from './i18n'

const DAY_NAMES: Record<Lang, string[]> = {
  // indexed 0=Sunday..6=Saturday, matching BusinessHoursRow.weekday
  nn: ['Sundag', 'Måndag', 'Tysdag', 'Onsdag', 'Torsdag', 'Fredag', 'Laurdag'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
}

// Norwegian week display order: Monday..Sunday
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0]

function trimSeconds(t: string): string {
  return t.slice(0, 5) // "08:00:00" -> "08:00"
}

function formatRange(start: string, end: string): string {
  const [h1, m1] = trimSeconds(start).split(':')
  const [h2, m2] = trimSeconds(end).split(':')
  if (m1 === '00' && m2 === '00') return `${h1}–${h2}`
  return `${h1}:${m1}–${h2}:${m2}`
}

export function formatHoursSummary(hours: BusinessHoursRow[], lang: Lang, t: Copy): { k: string; v: string }[] {
  const byWeekday = new Map(hours.map((h) => [h.weekday, h]))
  const names = DAY_NAMES[lang]

  const groups: { days: number[]; row: BusinessHoursRow | undefined }[] = []
  for (const weekday of DISPLAY_ORDER) {
    const row = byWeekday.get(weekday)
    const key = row ? `${row.is_open}|${row.start_time}|${row.end_time}` : 'missing'
    const last = groups[groups.length - 1]
    const lastKey = last?.row ? `${last.row.is_open}|${last.row.start_time}|${last.row.end_time}` : 'missing'
    if (last && lastKey === key) {
      last.days.push(weekday)
    } else {
      groups.push({ days: [weekday], row })
    }
  }

  const rows = groups.map((g) => {
    const label =
      g.days.length > 1 ? `${names[g.days[0]]}–${names[g.days[g.days.length - 1]]}` : names[g.days[0]]
    if (!g.row || !g.row.is_open) return { k: label, v: t.closed }
    return { k: label, v: formatRange(g.row.start_time, g.row.end_time) }
  })

  const openRows = hours.filter((h) => h.is_open)
  const lastCheckins = new Set(openRows.map((h) => trimSeconds(h.last_checkin_time)))
  if (lastCheckins.size === 1) {
    rows.push({ k: t.lastCheckin, v: [...lastCheckins][0] })
  }

  return rows
}
