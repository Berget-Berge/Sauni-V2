import { useEffect, useState } from 'react'
import { fetchBookedSlots } from './usePublicData'
import type { BookedSlot } from '../lib/availability'

// Fetches booked time ranges for a rolling 7-day window starting today.
// Refetch (via `reload`) after a successful booking insert so the newly
// held slot is reflected immediately without a full page reload.
export function useBookedSlots(days = 7) {
  const [slots, setSlots] = useState<BookedSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const today = new Date()
      const to = new Date(today)
      to.setDate(today.getDate() + (days - 1))
      try {
        const rows = await fetchBookedSlots(today, to)
        if (!cancelled) setSlots(rows)
      } catch {
        if (!cancelled) setSlots([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [days, tick])

  return { slots, loading, reload: () => setTick((n) => n + 1) }
}
