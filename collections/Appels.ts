import type { CollectionConfig } from 'payload'

/**
 * Clics d'appel — chaque tap sur un numéro de téléphone ou sur WhatsApp,
 * avec la provenance du visiteur.
 *
 * Un clic n'est pas un appel abouti : la personne peut raccrocher avant la
 * tonalité. On ne connaît pas non plus son nom. Mais compter ces clics par
 * canal dit combien de contacts téléphoniques chaque source génère — la part
 * du trafic qu'aucun formulaire ne voit.
 *
 * Création : uniquement par /api/clic-appel (API locale), jamais en REST public.
 */
export const Appels: CollectionConfig = {
  slug: 'appels',
  labels: { singular: "Clic d'appel", plural: "Clics d'appel" },
  admin: {
    useAsTitle: 'numero',
    defaultColumns: ['type', 'numero', 'sourceKey', 'motCle', 'page', 'cliqueLe'],
    description:
      'Taps sur un numéro ou sur WhatsApp depuis le site. Un clic ne garantit pas que ' +
      "l'appel a abouti : c'est un indicateur de volume par canal, pas une liste de clients.",
  },
  defaultSort: '-cliqueLe',
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          required: true,
          options: [
            { label: 'Téléphone', value: 'telephone' },
            { label: 'WhatsApp', value: 'whatsapp' },
          ],
        },
        { name: 'numero', label: 'Numéro', type: 'text' },
      ],
    },
    {
      name: 'sourceKey',
      label: 'Canal',
      type: 'select',
      index: true,
      options: [
        { label: 'Google Ads', value: 'google-ads' },
        { label: 'Fiche Google', value: 'gbp' },
        { label: 'Référencement naturel', value: 'seo' },
        { label: 'Réseaux sociaux', value: 'social' },
        { label: 'Assistant IA', value: 'ia' },
        { label: 'Site référent', value: 'referent' },
        { label: 'Autre campagne', value: 'campagne' },
        { label: 'Accès direct', value: 'direct' },
      ],
    },
    { name: 'source', label: 'Provenance détaillée', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'campagne', label: 'Campagne', type: 'text' },
        { name: 'motCle', label: 'Mot-clé', type: 'text' },
      ],
    },
    { name: 'gclid', label: 'Identifiant de clic Google Ads (gclid)', type: 'text' },
    { name: 'page', label: 'Page du clic', type: 'text' },
    {
      name: 'cliqueLe',
      label: 'Cliqué le',
      type: 'date',
      required: true,
      index: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' } },
    },
  ],
}

export default Appels
