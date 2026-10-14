import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fr } from '@payloadcms/translations/languages/fr'
import { buildConfig } from 'payload'

import { Leads } from './collections/Leads'
import { Users } from './collections/Users'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// RESEND_FROM_EMAIL peut valoir « Ouvertures Pro <devis@…> » (format utilisé par
// /api/devis) : l'adaptateur Payload veut l'adresse seule, il ajoute le nom.
const fromRaw = process.env.RESEND_FROM_EMAIL ?? ''
const fromAddress = fromRaw.match(/<([^>]+)>/)?.[1] ?? (fromRaw || 'noreply@ouverture-pro.fr')

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Ouvertures Pro',
    },
  },
  collections: [Leads, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL ?? '',
    },
    // Le schéma n'évolue que par migrations, y compris en local : la même base
    // Neon sert à la production, aux aperçus et au développement.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
    // Appliquées au démarrage en production : un déploiement suffit.
    prodMigrations: migrations,
  }),
  // Sert aux emails de l'admin, dont « Mot de passe oublié ».
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        defaultFromAddress: fromAddress,
        defaultFromName: 'Ouvertures Pro',
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined,
  // L'admin est en français : c'est Cédric qui l'utilise au quotidien.
  i18n: {
    supportedLanguages: { fr },
    fallbackLanguage: 'fr',
  },
})
