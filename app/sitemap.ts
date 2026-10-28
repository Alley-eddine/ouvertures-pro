import type { MetadataRoute } from 'next';
import { PAGES_METIER } from '@/lib/pages-metier';

// URL de prod hardcodee — pas d'env var pour eviter les surprises
// (ex: NEXT_PUBLIC_SITE_URL mal renseignee qui prefixe toutes les URLs).
const SITE_URL = 'https://ouverture-pro.fr';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/devis`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...PAGES_METIER.map((p) => ({
      url: `${SITE_URL}/services/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/mentions-legales`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/politique-confidentialite`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];
}
