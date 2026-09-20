// Static UI copy, ported verbatim from the approved design
// (Fjordbu Sauna v2.dc.html). Per the design contract, only the sections
// bound to Supabase (prices/services, opening hours, rules, faq, footer
// contact) become dynamic — everything else (hero, om, slik fungerer det,
// galleri, om oss, and all form/step labels) stays exactly as designed.

export type Lang = 'nn' | 'en'

export interface HowItem {
  tag: string
  title: string
  body: string
}

export interface Copy {
  navAbout: string
  navPrices: string
  navHow: string
  navGallery: string
  navMap: string
  book: string
  heroTitle: string
  heroBody: string
  heroSecondary: string
  aboutTitle: string
  aboutBody: string
  pricesTitle: string
  hoursTag: string
  hoursNote: string
  lastCheckin: string
  closed: string
  bookingTitle: string
  bookingBody: string
  s1Title: string
  s1Sub: string
  s2Title: string
  s3Title: string
  s3Sub: string
  s4Title: string
  s4Sub: string
  vippsSub: string
  cardTitle: string
  cardSub: string
  s5Title: string
  s5Sub: string
  fName: string
  fPhone: string
  fEmail: string
  fGuests: string
  guestsHint: string
  formError: string
  fNameError: string
  fPhoneError: string
  fEmailError: string
  fConfirmEmail: string
  fConfirmEmailError: string
  captchaLabel: string
  captchaError: string
  termsPrefix: string
  rulesLinkLabel: string
  termsSuffix: string
  termsError: string
  genericSubmitError: string
  next: string
  back: string
  toSummary: string
  payWith: string
  price: string
  date: string
  time: string
  persons: string
  payment: string
  sentTo: string
  hours2: string
  persons1: string
  personsN: string
  doneTitle: string
  doneBody: string
  bookAgain: string
  howTitle: string
  how: HowItem[]
  galleryTitle: string
  rulesTag: string
  rulesTitle: string
  rulesBody: string
  faqTitle: string
  mapTitle: string
  mapBody: string
  directions: { k: string; v: string }[]
  mapCta: string
  aboutUsTag: string
  aboutUsTitle: string
  aboutUs1: string
  aboutUs2: string
  footerBody: string
  contact: string
  links: string
  social: string
  footerNote: string
  dayNames: string[]
  locale: string
}

export const COPY: Record<Lang, Copy> = {
  nn: {
    navAbout: 'Om saunaen', navPrices: 'Prisar', navHow: 'Slik fungerer det', navGallery: 'Galleri', navMap: 'Finn oss', book: 'Bestill tid',
    heroTitle: 'Varme, ro og fjellutsikt på vatnet.', heroBody: 'Ei flytande badstove der du bookar din eigen time, låser deg inn med kode, og har fjorden for deg sjølv.', heroSecondary: 'Sjå saunaen',
    aboutTitle: 'Ei sjølvbetjent flytebadstove, midt i Hjørundfjorden.', aboutBody: 'Du bookar tida di på nett, får kode til nøkkelboksen når bookinga er stadfesta, og har badstova for deg og dine i to timar. Etter badstova ventar fjorden — kald, klar og rett utanfor døra.',
    pricesTitle: 'Enkle prisar. Heile saunaen er din.',
    hoursTag: 'Opningstider',
    hoursNote: 'Saunaen er open heile året. Vinterstid tilrår vi å booke tidleg — omnen er varm til avtalt tid.',
    lastCheckin: 'Siste innsjekk',
    closed: 'Stengt',
    bookingTitle: 'Vel dato, tid og gjer klar for varmen.', bookingBody: 'Ei booking gjeld to timar privat leige. Du betalar med Vipps eller kort, og får stadfesting og kode til nøkkelboksen med det same.',
    s1Title: 'Vel dato', s1Sub: 'Ledige dagar den neste veka', s2Title: 'Vel tidspunkt', s3Title: 'Dine opplysningar', s3Sub: 'Vi sender kode til nøkkelboksen på e-post og SMS',
    s4Title: 'Vel betaling', s4Sub: 'Du blir send vidare til trygg betaling i neste steg', vippsSub: 'Betal med mobilen', cardTitle: 'Kort', cardSub: 'Visa, Mastercard',
    s5Title: 'Oppsummering', s5Sub: 'Sjekk at alt stemmer før du betalar',
    fName: 'Fullt namn', fPhone: 'Telefon', fEmail: 'E-post', fGuests: 'Tal på personar', guestsHint: 'Maks {max} personar', formError: 'Rett opp felta under for å gå vidare.',
    fNameError: 'Skriv fullt namn (for- og etternamn).', fPhoneError: 'Skriv eit gyldig norsk telefonnummer (8 sifre).', fEmailError: 'Skriv ein gyldig e-postadresse.',
    fConfirmEmail: 'Stadfest e-post', fConfirmEmailError: 'E-postadressene er ikkje like.',
    captchaLabel: 'Kor mykje er {a} + {b}? (for å unngå robotar)', captchaError: 'Feil svar — prøv igjen.',
    termsPrefix: 'Eg har lese og godtek ', rulesLinkLabel: 'reglane', termsSuffix: ' for bruk av saunaen.', termsError: 'Du må godta reglane for å bestille.',
    genericSubmitError: 'Klarte ikkje å senda bookinga. Prøv igjen, eller ta kontakt på post@fjordbusauna.no.',
    next: 'Neste', back: 'Tilbake', toSummary: 'Gå til oppsummering', payWith: 'Betal med', price: 'Pris',
    date: 'Dato', time: 'Tidspunkt', persons: 'Personar', payment: 'Betaling', sentTo: 'Stadfesting sendt til', hours2: 'timar privat leige', persons1: 'person', personsN: 'personar',
    doneTitle: 'Booking mottatt', doneBody: 'Du får kode til nøkkelboksen på e-post og SMS rett før avtalen din startar, så snart bookinga er stadfesta.', bookAgain: 'Bestill ei ny tid',
    howTitle: 'Frå booking til badstovevarme.',
    how: [
      { tag: 'Booking', title: 'Vel dato og tid', body: 'Bookinga gjeld to timar privat leige av saunen. Vel ledig tidspunkt i kalenderen.' },
      { tag: 'Nøkkel', title: 'Kode til nøkkelboks', body: 'Når bookinga er stadfesta får du tilsendt kode. Lås saunen og legg nøkkelen tilbake etter avtalen.' },
      { tag: 'Ta med', title: 'Handduk og badeklede', body: 'Ta gjerne med vassflaske. Byt om heime på førehand, så går du rett inn i varmen.' },
      { tag: 'Fasilitetar', title: 'Omkledning og dusj', body: 'Låsbart omkledningsrom, ferskvassdusj og tilgang til ferskvatn inne i saunen. Toalett ved kaihuset.' },
      { tag: 'Sjølvbetjent', title: 'På eige ansvar', body: 'Vi set pris på at du følgjer retningslinjene. All bruk av sauna og bading i fjorden skjer på eige ansvar.' },
      { tag: 'Nyt', title: 'Rydd etter deg', body: 'Ta med søppel og forlat saunen slik du ønskjer å finne den. Gjerne gi oss tilbakemelding.' },
    ],
    galleryTitle: 'Frå kaien og inn i varmen.',
    rulesTag: 'Reglar', rulesTitle: 'Nokre få reglar, så held vi saunaen fin for alle.', rulesBody: 'Saunaen er sjølvbetjent og ligg på vatnet. Det fungerer berre fordi gjestane tek vare på han.',
    faqTitle: 'Ofte stilte spørsmål',
    mapTitle: 'Ved kaien i Urke, inst i Hjørundfjorden.', mapBody: 'Du finn oss på småbåthamna i Urke. Køyr til kaien, parker, og gå ned på flytebrygga — saunaen ligg ytst.',
    directions: [ { k: 'Frå Ørsta', v: '45 min via Sæbø og ferje' }, { k: 'Frå Ålesund', v: '2 t via Standal–Trandal ferje' }, { k: 'Parkering', v: 'Gratis ved kaien' } ],
    mapCta: 'Opne i Google Maps',
    aboutUsTag: 'Om oss', aboutUsTitle: 'Bygd av folk frå Urke, for alle som kjem hit.', aboutUs1: 'Fjordbu Sauna vart bygd i 2024 av ein liten gjeng lokale eldsjeler som ville dele det beste med bygda: fjorden, fjella og stilla. Saunaen er handbygd i furu på ein flåte, og fyrt med ved frå eigen skog.', aboutUs2: 'Vi driv saunaen sjølvbetjent for å halde prisen låg og døra open for alle — turgåarar, hyttefolk, naboar og tilreisande.',
    footerBody: 'På småbåthamna i vakre Hjørundfjorden ligg Fjordbu Sauna, ei flytande badstove der du kan nyte varme, ro og fjellutsikt — eller ta eit friskt bad i fjorden.',
    contact: 'Kontakt', links: 'Lenker', social: 'Sosiale medium', footerNote: 'Booking krev stadfesting frå oss før betaling er fullført.',
    dayNames: ['søn', 'man', 'tys', 'ons', 'tor', 'fre', 'lau'], locale: 'nn-NO',
  },
  en: {
    navAbout: 'The sauna', navPrices: 'Prices', navHow: 'How it works', navGallery: 'Gallery', navMap: 'Find us', book: 'Book now',
    heroTitle: 'Heat, calm and mountain views on the water.', heroBody: 'A floating sauna where you book your own slot, let yourself in with a code, and have the fjord to yourself.', heroSecondary: 'See the sauna',
    aboutTitle: 'A self-service floating sauna in the heart of Hjørundfjorden.', aboutBody: 'Book your time online, receive a key-box code once confirmed, and enjoy the sauna privately for two hours. Afterwards the fjord awaits — cold, clear and right outside the door.',
    pricesTitle: 'Simple prices. The whole sauna is yours.',
    hoursTag: 'Opening hours',
    hoursNote: 'Open all year. In winter we recommend booking early — the stove is hot at your booked time.',
    lastCheckin: 'Last check-in',
    closed: 'Closed',
    bookingTitle: 'Pick a date, a time, and get ready for the heat.', bookingBody: 'A booking is two hours of private hire. Pay with Vipps or card and receive your confirmation and key-box code straight away.',
    s1Title: 'Choose a date', s1Sub: 'Available days this week', s2Title: 'Choose a time', s3Title: 'Your details', s3Sub: 'We send the key-box code by email and SMS',
    s4Title: 'Payment', s4Sub: 'You will be taken to secure payment in the next step', vippsSub: 'Pay with your phone', cardTitle: 'Card', cardSub: 'Visa, Mastercard',
    s5Title: 'Summary', s5Sub: 'Check that everything is right before paying',
    fName: 'Full name', fPhone: 'Phone', fEmail: 'Email', fGuests: 'Number of people', guestsHint: 'Max {max} people', formError: 'Fix the fields below to continue.',
    fNameError: 'Enter your full name (first and last).', fPhoneError: 'Enter a valid Norwegian phone number (8 digits).', fEmailError: 'Enter a valid email address.',
    fConfirmEmail: 'Confirm email', fConfirmEmailError: 'The email addresses do not match.',
    captchaLabel: 'What is {a} + {b}? (to keep bots out)', captchaError: 'Wrong answer — try again.',
    termsPrefix: 'I have read and accept the ', rulesLinkLabel: 'rules', termsSuffix: ' for using the sauna.', termsError: 'You must accept the rules to book.',
    genericSubmitError: 'Could not send the booking. Please try again, or contact post@fjordbusauna.no.',
    next: 'Next', back: 'Back', toSummary: 'Go to summary', payWith: 'Pay with', price: 'Price',
    date: 'Date', time: 'Time', persons: 'People', payment: 'Payment', sentTo: 'Confirmation sent to', hours2: 'hours private hire', persons1: 'person', personsN: 'people',
    doneTitle: 'Booking received', doneBody: 'You will receive the key-box code by email and SMS just before your slot starts, once your booking is confirmed.', bookAgain: 'Book another time',
    howTitle: 'From booking to sauna heat.',
    how: [
      { tag: 'Booking', title: 'Choose date and time', body: 'A booking is two hours of private hire. Pick an available slot in the calendar.' },
      { tag: 'Key', title: 'Key-box code', body: 'Once confirmed you receive a code. Lock the sauna and return the key after your slot.' },
      { tag: 'Bring', title: 'Towel and swimwear', body: 'Bring a water bottle too. Change at home beforehand and step straight into the heat.' },
      { tag: 'Facilities', title: 'Changing room and shower', body: 'Lockable changing room, fresh-water shower and fresh water inside the sauna. Toilet at the quay house.' },
      { tag: 'Self-service', title: 'At your own risk', body: 'Please follow the guidelines. All use of the sauna and swimming in the fjord is at your own risk.' },
      { tag: 'Enjoy', title: 'Tidy up after yourself', body: 'Take your rubbish and leave the sauna as you would like to find it. Feedback is welcome.' },
    ],
    galleryTitle: 'From the quay into the heat.',
    rulesTag: 'Rules', rulesTitle: 'A few rules keep the sauna nice for everyone.', rulesBody: 'The sauna is self-service and floats on the fjord. It only works because guests look after it.',
    faqTitle: 'Frequently asked questions',
    mapTitle: 'At the quay in Urke, deep in Hjørundfjorden.', mapBody: 'You will find us at the small-boat harbour in Urke. Drive to the quay, park, and walk down onto the floating jetty — the sauna is at the far end.',
    directions: [ { k: 'From Ørsta', v: '45 min via Sæbø and ferry' }, { k: 'From Ålesund', v: '2 h via Standal–Trandal ferry' }, { k: 'Parking', v: 'Free at the quay' } ],
    mapCta: 'Open in Google Maps',
    aboutUsTag: 'About us', aboutUsTitle: 'Built by people from Urke, for everyone who visits.', aboutUs1: 'Fjordbu Sauna was built in 2024 by a small group of locals who wanted to share the best of the village: the fjord, the mountains and the quiet. The sauna is hand-built in pine on a raft and fired with wood from our own forest.', aboutUs2: 'We run it self-service to keep the price low and the door open to everyone — hikers, cabin owners, neighbours and travellers.',
    footerBody: 'At the small-boat harbour in beautiful Hjørundfjorden lies Fjordbu Sauna, a floating sauna where you can enjoy heat, calm and mountain views — or take a refreshing dip in the fjord.',
    contact: 'Contact', links: 'Links', social: 'Social', footerNote: 'Bookings require our confirmation before payment is completed.',
    dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], locale: 'en-GB',
  },
}
