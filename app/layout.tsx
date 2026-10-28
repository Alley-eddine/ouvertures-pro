import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://ouverture-pro.fr'),
}

/**
 * Layout racine — volontairement minimal.
 *
 * L'admin Payload rend son propre `<html><body>`. Si ce layout en rendait
 * aussi, on aurait des balises imbriquées et une erreur d'hydratation.
 * Chaque groupe de routes gère donc son enveloppe :
 *  - (frontend)/layout.tsx → le site, avec ses polices et ses styles
 *  - (payload)/layout.tsx  → l'admin, géré par @payloadcms/next
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
