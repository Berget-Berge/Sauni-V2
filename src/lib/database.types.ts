// Hand-written to match the EXACT schema contract in
// "PROMPT - Fjordbu Sauna backend.md". Do not rename or invent fields.
//
// NOTE: these row shapes are `type` aliases, not `interface`s, on purpose.
// @supabase/supabase-js's insert()/update() generics fail to narrow
// correctly (silently resolving to `never`) when a Table's `Row` is an
// `interface` reference instead of a `type` — verified empirically against
// the installed postgrest-js version. Keep these as `type`.

export type PaymentMethod = 'vipps' | 'card'
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed'
export type Language = 'nn' | 'en'
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export type ServiceRow = {
  id: string
  name: string
  description: string | null
  duration_minutes: number
  price: number
  max_guests: number
  is_active: boolean
  sort_order: number
  created_at: string
}

export type AppointmentRow = {
  id: string
  full_name: string
  email: string
  phone: string
  service_id: string
  appointment_date: string // date, yyyy-mm-dd
  start_time: string // HH:mm:ss
  end_time: string // HH:mm:ss
  guests: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  payment_reference: string | null
  access_code: string | null
  language: Language
  status: AppointmentStatus
  notes: string | null
  created_at: string
}

export type BusinessHoursRow = {
  id: string
  weekday: number // 0=Sunday .. 6=Saturday
  is_open: boolean
  start_time: string
  end_time: string
  last_checkin_time: string
}

export type BlockedDateRow = {
  id: string
  blocked_date: string
  reason: string | null
  created_at: string
}

export type ClinicSettingsRow = {
  id: string
  clinic_name: string
  clinic_email: string
  clinic_phone: string
  clinic_address: string
  slot_interval_minutes: number
  booking_notice_hours: number
  cancellation_hours: number
  max_guests: number
  key_box_code: string
  created_at: string
}

// What the public site is allowed to see of clinic_settings — the
// `clinic_settings_public` view excludes key_box_code (see schema.sql).
export type PublicClinicSettingsRow = Omit<ClinicSettingsRow, 'key_box_code'>

export type FaqRow = {
  id: string
  question_nn: string
  question_en: string
  answer_nn: string
  answer_en: string
  sort_order: number
  is_active: boolean
}

export type RuleRow = {
  id: string
  text_nn: string
  text_en: string
  sort_order: number
  is_active: boolean
}

export type AdminUserRow = {
  user_id: string
  created_at: string
}

export type BookedSlotRow = {
  appointment_date: string
  start_time: string
  end_time: string
  status: AppointmentStatus
  payment_status: PaymentStatus
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      services: { Row: ServiceRow; Insert: Partial<ServiceRow>; Update: Partial<ServiceRow>; Relationships: [] }
      appointments: { Row: AppointmentRow; Insert: Partial<AppointmentRow>; Update: Partial<AppointmentRow>; Relationships: [] }
      business_hours: { Row: BusinessHoursRow; Insert: Partial<BusinessHoursRow>; Update: Partial<BusinessHoursRow>; Relationships: [] }
      blocked_dates: { Row: BlockedDateRow; Insert: Partial<BlockedDateRow>; Update: Partial<BlockedDateRow>; Relationships: [] }
      clinic_settings: { Row: ClinicSettingsRow; Insert: Partial<ClinicSettingsRow>; Update: Partial<ClinicSettingsRow>; Relationships: [] }
      faq: { Row: FaqRow; Insert: Partial<FaqRow>; Update: Partial<FaqRow>; Relationships: [] }
      rules: { Row: RuleRow; Insert: Partial<RuleRow>; Update: Partial<RuleRow>; Relationships: [] }
      admin_users: { Row: AdminUserRow; Insert: { user_id: string }; Update: { user_id?: string }; Relationships: [] }
    }
    Views: {
      clinic_settings_public: { Row: PublicClinicSettingsRow; Relationships: [] }
    }
    Functions: {
      get_booked_slots: {
        Args: { p_from: string; p_to: string }
        Returns: BookedSlotRow[]
      }
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
  }
}
