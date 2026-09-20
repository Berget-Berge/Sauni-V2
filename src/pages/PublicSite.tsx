import { useState } from 'react'
import { Nav } from '../components/public/Nav'
import { Hero } from '../components/public/Hero'
import { About } from '../components/public/About'
import { Prices } from '../components/public/Prices'
import { BookingSection } from '../components/booking/BookingSection'
import { HowItWorks } from '../components/public/HowItWorks'
import { Gallery } from '../components/public/Gallery'
import { Rules } from '../components/public/Rules'
import { Faq } from '../components/public/Faq'
import { MapSection } from '../components/public/MapSection'
import { AboutUs } from '../components/public/AboutUs'
import { Footer } from '../components/public/Footer'
import { usePublicData } from '../hooks/usePublicData'
import type { ServiceRow } from '../lib/database.types'

export function PublicSite() {
  const data = usePublicData()
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)

  function chooseService(service: ServiceRow) {
    setSelectedServiceId(service.id)
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (data.error) {
    return (
      <div style={{ padding: 40, fontFamily: 'sans-serif', color: '#12201D', background: '#F6F3EC', minHeight: '100vh' }}>
        <h1>Fjordbu Sauna</h1>
        <p>Klarte ikkje å hente data frå Supabase: {data.error}</p>
        <p style={{ color: '#8A8073', fontSize: 14 }}>
          Sjekk at VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY er sett, og at supabase/schema.sql er køyrd i prosjektet.
        </p>
      </div>
    )
  }

  return (
    <div style={{ background: '#F6F3EC' }}>
      <Nav />
      <Hero />
      <About />
      <Prices services={data.services} businessHours={data.businessHours} onChoose={chooseService} />
      <BookingSection
        services={data.services}
        businessHours={data.businessHours}
        blockedDates={data.blockedDates}
        clinicSettings={data.clinicSettings}
        selectedServiceId={selectedServiceId}
      />
      <HowItWorks />
      <Gallery />
      <Rules rules={data.rules} />
      <Faq faq={data.faq} />
      <MapSection />
      <AboutUs />
      <Footer clinicSettings={data.clinicSettings} />
    </div>
  )
}
