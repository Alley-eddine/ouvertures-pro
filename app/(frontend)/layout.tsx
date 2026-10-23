import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AttributionTracker } from '@/components/attribution-tracker'
import { BandeauCookies } from '@/components/bandeau-cookies'
import { BarreAppelMobile } from '@/components/barre-appel-mobile'
import { GoogleTag } from '@/components/google-tag'
// Les styles du site restent dans (frontend) : l'admin Payload a les siens,
// et le Tailwind du site ne doit pas déborder dessus.
import '../globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const SITE_URL = 'https://ouverture-pro.fr';
const SITE_NAME = 'Ouvertures Pro';
const DESCRIPTION =
  'Ouvertures Pro - SARL spécialisée en menuiserie bois et PVC à Lisses (91). Installation de fenêtres, portes et volets en Essonne et alentours. Devis gratuit dans un rayon de 25 km.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Fenêtres, Portes & Volets`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  keywords: [
    'fenêtres',
    'portes',
    'volets',
    'menuiserie',
    'PVC',
    'aluminium',
    'Lisses',
    'Essonne',
    'devis gratuit',
  ],
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Fenêtres, Portes & Volets`,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Fenêtres, Portes & Volets`,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE_NAME,
  legalName: 'Ouvertures Pro SARL',
  description: DESCRIPTION,
  url: SITE_URL,
  telephone: ['+33 1 60 86 37 54', '+33 7 71 74 20 83'],
  email: 'contact@ouvertures-pro.fr',
  image: `${SITE_URL}/apple-touch-icon.png`,
  logo: `${SITE_URL}/images/logofinal.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '22 bis rue des Malines',
    postalCode: '91090',
    addressLocality: 'Lisses',
    addressRegion: 'Île-de-France',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 48.6018,
    longitude: 2.4256,
  },
  // Zone de déplacement gratuit : 25 km autour de l'atelier (voir lib/zone.ts).
  areaServed: [
    {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: 48.6018, longitude: 2.4256 },
      geoRadius: 25000,
    },
    { '@type': 'AdministrativeArea', name: 'Essonne' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '12:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '14:00',
      closes: '18:00',
    },
  ],
  priceRange: '€€',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    bestRating: '5',
    reviewCount: 24,
  },
  sameAs: ['https://www.facebook.com/ouverturespro'],
  founder: { '@type': 'Person', name: 'Cédric Tamoud' },
  foundingDate: '2018',
  knowsAbout: [
    'Pose de fenêtres',
    'Installation de portes d\'entrée',
    'Pose de volets',
    'Installation de portails',
    'Pose de portes de garage',
    'Installation de stores bannes',
    'Rénovation menuiserie',
    'Dépannage menuiserie',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <AttributionTracker />
        {children}
        <BarreAppelMobile />
        <BandeauCookies />
        <GoogleTag />
        <Analytics />
      </body>
    </html>
  )
}
