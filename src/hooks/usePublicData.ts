import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type {
  BlockedDateRow,
  BusinessHoursRow,
  FaqRow,
  PublicClinicSettingsRow,
  RuleRow,
  ServiceRow,
} from '../lib/database.types'
import type { BookedSlot } from '../lib/availability'
import { toDateOnly } from '../lib/availability'

export interface PublicData {
  services: ServiceRow[]
  businessHours: BusinessHoursRow[]
  clinicSettings: PublicClinicSettingsRow | null
  faq: FaqRow[]
  rules: RuleRow[]
  blockedDates: BlockedDateRow[]
  loading: boolean
  error: string | null
  reload: () => void
}

// Public (anon) read access to the tables the RLS policy allows:
// services, business_hours, blocked_dates, faq, rules, clinic_settings
// (minus key_box_code — that column must be excluded by the RLS/select
// policy on the Supabase side, see supabase/schema.sql).
export function usePublicData(): PublicData {
  const [services, setServices] = useState<ServiceRow[]>([])
  const [businessHours, setBusinessHours] = useState<BusinessHoursRow[]>([])
  const [clinicSettings, setClinicSettings] = useState<PublicClinicSettingsRow | null>(null)
  const [faq, setFaq] = useState<FaqRow[]>([])
  const [rules, setRules] = useState<RuleRow[]>([])
  const [blockedDates, setBlockedDates] = useState<BlockedDateRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      const [svc, hours, faqRes, rulesRes, settingsRes, blockedRes] = await Promise.all([
        supabase.from('services').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
        supabase.from('business_hours').select('*'),
        supabase.from('faq').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
        supabase.from('rules').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
        supabase.from('clinic_settings_public').select('*').limit(1).maybeSingle(),
        supabase.from('blocked_dates').select('*'),
      ])
      if (cancelled) return

      const firstError =
        svc.error || hours.error || faqRes.error || rulesRes.error || settingsRes.error || blockedRes.error
      if (firstError) {
        setError(firstError.message)
        setLoading(false)
        return
      }

      setServices((svc.data ?? []) as ServiceRow[])
      setBusinessHours((hours.data ?? []) as BusinessHoursRow[])
      setFaq((faqRes.data ?? []) as FaqRow[])
      setRules((rulesRes.data ?? []) as RuleRow[])
      setClinicSettings((settingsRes.data ?? null) as PublicClinicSettingsRow | null)
      setBlockedDates((blockedRes.data ?? []) as BlockedDateRow[])
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [tick])

  return {
    services,
    businessHours,
    clinicSettings,
    faq,
    rules,
    blockedDates,
    loading,
    error,
    reload: () => setTick((n) => n + 1),
  }
}

// Booked time ranges for a date range, used to compute live availability.
// This calls the `get_booked_slots` Postgres function (see
// supabase/schema.sql) instead of selecting from `appointments` directly:
// RLS only lets anon users INSERT into appointments, never read guest
// name/email/phone, so the function returns just the fields needed for
// the overlap check.
export async function fetchBookedSlots(fromDate: Date, toDate: Date): Promise<BookedSlot[]> {
  const { data, error } = await supabase.rpc('get_booked_slots', {
    p_from: toDateOnly(fromDate),
    p_to: toDateOnly(toDate),
  })
  if (error) throw error
  return (data ?? []) as BookedSlot[]
}
