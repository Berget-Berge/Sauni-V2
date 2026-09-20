import { useLanguage } from '../../context/LanguageContext'
import { sx } from '../../lib/style'
import { BookingCard } from './BookingCard'
import type { BlockedDateRow, BusinessHoursRow, PublicClinicSettingsRow, ServiceRow } from '../../lib/database.types'

interface Props {
  services: ServiceRow[]
  businessHours: BusinessHoursRow[]
  blockedDates: BlockedDateRow[]
  clinicSettings: PublicClinicSettingsRow | null
  selectedServiceId: string | null
}

export function BookingSection(props: Props) {
  const { t } = useLanguage()
  return (
    <section id="booking" style={sx('padding:120px 40px;background:#12201D;color:#F6F3EC;')}>
      <div style={sx('max-width:1120px;margin:0 auto;')}>
        <div style={sx('color:#D97F4B;font-size:15px;font-weight:500;margin-bottom:16px;')}>Booking</div>
        <h2 style={sx('margin:0;font-size:clamp(30px, 4vw, 48px);font-weight:600;letter-spacing:-0.01em;line-height:1.12;max-width:640px;color:#F6F3EC;text-wrap:balance;')}>
          {t.bookingTitle}
        </h2>
        <p style={sx('margin:20px 0 0;font-size:18px;color:rgba(246,243,236,0.65);max-width:520px;line-height:1.6;font-weight:300;')}>{t.bookingBody}</p>
        <BookingCard {...props} />
      </div>
    </section>
  )
}
