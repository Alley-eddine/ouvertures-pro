import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Devis gratuit fenêtres, portes et volets',
  description:
    'Demandez votre devis gratuit en ligne pour la pose ou la rénovation de vos fenêtres, portes, volets ou portails en Île-de-France. Réponse sous 24h par l\'équipe Ouvertures Pro.',
  alternates: {
    canonical: '/devis',
  },
  openGraph: {
    title: 'Devis gratuit fenêtres, portes et volets | Ouvertures Pro',
    description:
      'Demandez votre devis gratuit en ligne. Étude personnalisée et réponse sous 24h par Cédric Tamoud et son équipe d\'artisans à Lisses (91).',
    url: '/devis',
  },
};

export default function DevisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
