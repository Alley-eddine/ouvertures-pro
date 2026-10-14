import type { CollectionConfig } from 'payload'

/**
 * Leads — chaque demande envoyée depuis le site (page devis ou accueil).
 *
 * Création : uniquement par la route /api/devis, via l'API locale de Payload.
 * L'API REST publique ne permet pas d'en créer (pas de porte ouverte au spam).
 *
 * Le suivi commercial sert aussi au calcul de la rémunération au pourcentage :
 * un lead passé en « Gagné » avec son montant signé, croisé avec sa
 * provenance, dit exactement ce que chaque canal a rapporté.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Lead', plural: 'Leads' },
  admin: {
    useAsTitle: 'nomComplet',
    defaultColumns: ['nomComplet', 'sourceKey', 'budget', 'echeance', 'status', 'submittedAt'],
    listSearchableFields: ['nomComplet', 'email', 'phone', 'city', 'postalCode'],
    description:
      'Toutes les demandes reçues par le site. Mettez à jour le statut au fil des échanges ; ' +
      'un lead « Gagné » doit porter le montant du devis signé.',
  },
  defaultSort: '-submittedAt',
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        const nom = [data?.firstName, data?.lastName].filter(Boolean).join(' ').trim()
        return nom ? { ...data, nomComplet: nom } : data
      },
    ],
  },
  fields: [
    {
      name: 'nomComplet',
      label: 'Nom',
      type: 'text',
      admin: { hidden: true },
      index: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          fields: [
            {
              name: 'origine',
              label: 'Formulaire',
              type: 'select',
              required: true,
              defaultValue: 'devis',
              options: [
                { label: 'Page devis', value: 'devis' },
                { label: "Page d'accueil", value: 'accueil' },
                { label: 'Saisie manuelle (appel, visite…)', value: 'manuel' },
              ],
              admin: {
                description:
                  'Pour un client qui a appelé ou s’est présenté : choisissez « Saisie manuelle » ' +
                  'et renseignez son canal dans l’onglet Provenance.',
              },
            },
            {
              type: 'row',
              fields: [
                { name: 'firstName', label: 'Prénom', type: 'text', required: true },
                { name: 'lastName', label: 'Nom', type: 'text' },
              ],
            },
            {
              type: 'row',
              fields: [
                // Facultatif : au téléphone on n'a souvent que le nom et le numéro.
                // Les formulaires du site, eux, exigent toujours un email.
                { name: 'email', label: 'Email', type: 'email', index: true },
                { name: 'phone', label: 'Téléphone', type: 'text', required: true },
              ],
            },
            { name: 'address', label: 'Adresse', type: 'text' },
            {
              type: 'row',
              fields: [
                { name: 'postalCode', label: 'Code postal', type: 'text' },
                { name: 'city', label: 'Ville', type: 'text' },
              ],
            },
            {
              name: 'preferredContact',
              label: 'Préfère être contacté par',
              type: 'select',
              options: [
                { label: 'Email', value: 'email' },
                { label: 'Téléphone', value: 'phone' },
                { label: 'WhatsApp', value: 'whatsapp' },
              ],
            },
          ],
        },
        {
          label: 'Projet',
          fields: [
            {
              name: 'projectType',
              label: 'Type de projet',
              type: 'select',
              options: [
                { label: 'Construction neuve', value: 'neuf' },
                { label: 'Rénovation', value: 'renovation' },
                { label: "Remplacement à l'identique", value: 'remplacement' },
              ],
            },
            {
              name: 'services',
              label: 'Services souhaités',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Fenêtres', value: 'fenetres' },
                { label: 'Portes', value: 'portes' },
                { label: 'Volets', value: 'volets' },
                { label: 'Réparation', value: 'reparation' },
              ],
            },
            { name: 'description', label: 'Description', type: 'textarea', maxLength: 5000 },
          ],
        },
        {
          label: 'Qualification',
          description: 'Renseignée par le visiteur, facultative.',
          fields: [
            {
              name: 'budget',
              label: 'Budget',
              type: 'select',
              options: [
                { label: 'Moins de 2 000 €', value: 'moins-2000' },
                { label: '2 000 à 5 000 €', value: '2000-5000' },
                { label: '5 000 à 10 000 €', value: '5000-10000' },
                { label: 'Plus de 10 000 €', value: 'plus-10000' },
                { label: 'Ne sait pas encore', value: 'inconnu' },
              ],
            },
            {
              name: 'echeance',
              label: 'Échéance',
              type: 'select',
              options: [
                { label: 'Dès que possible', value: 'des-que-possible' },
                { label: 'Sous 1 à 3 mois', value: '1-3-mois' },
                { label: 'Sous 3 à 6 mois', value: '3-6-mois' },
                { label: 'Se renseigne', value: 'renseignement' },
              ],
            },
            {
              name: 'situation',
              label: 'Situation',
              type: 'select',
              options: [
                { label: 'Propriétaire', value: 'proprietaire' },
                { label: 'Locataire', value: 'locataire' },
                { label: 'Copropriété', value: 'copropriete' },
              ],
            },
            {
              name: 'nbOuvertures',
              label: "Nombre d'ouvertures",
              type: 'select',
              options: [
                { label: '1 à 2', value: '1-2' },
                { label: '3 à 5', value: '3-5' },
                { label: '6 à 10', value: '6-10' },
                { label: 'Plus de 10', value: 'plus-10' },
              ],
            },
          ],
        },
        {
          label: 'Provenance',
          description: "Calculée automatiquement à l'arrivée du visiteur sur le site.",
          fields: [
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
                { label: 'Bouche-à-oreille', value: 'bouche-a-oreille' },
              ],
              admin: {
                description:
                  'Rempli automatiquement pour les demandes du site. Pour une saisie manuelle, ' +
                  'demandez au client comment il vous a connu.',
              },
            },
            {
              name: 'source',
              label: 'Provenance détaillée',
              type: 'text',
              admin: { readOnly: true },
            },
            {
              type: 'row',
              fields: [
                { name: 'campagne', label: 'Campagne', type: 'text', admin: { readOnly: true } },
                { name: 'motCle', label: 'Mot-clé', type: 'text', admin: { readOnly: true } },
              ],
            },
            {
              name: 'gclid',
              label: 'Identifiant de clic Google Ads (gclid)',
              type: 'text',
              admin: {
                readOnly: true,
                description:
                  'Relie ce lead au clic publicitaire exact : sert à remonter un devis signé jusqu’à l’annonce.',
              },
            },
            { name: 'referent', label: 'Site référent', type: 'text', admin: { readOnly: true } },
            { name: 'pageArrivee', label: "Page d'arrivée", type: 'text', admin: { readOnly: true } },
          ],
        },
        {
          label: 'Suivi commercial',
          fields: [
            {
              name: 'status',
              label: 'Statut',
              type: 'select',
              required: true,
              defaultValue: 'new',
              index: true,
              options: [
                { label: 'Nouveau', value: 'new' },
                { label: 'Contacté', value: 'contacted' },
                { label: 'Devis envoyé', value: 'quoted' },
                { label: 'Gagné', value: 'won' },
                { label: 'Perdu', value: 'lost' },
                { label: 'Spam', value: 'spam' },
              ],
            },
            {
              type: 'row',
              admin: {
                condition: (_, siblingData) => siblingData?.status === 'won',
              },
              fields: [
                {
                  name: 'montantSigne',
                  label: 'Montant du devis signé (€ HT)',
                  type: 'number',
                  min: 0,
                },
                {
                  name: 'dateSignature',
                  label: 'Date de signature',
                  type: 'date',
                  admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
                },
              ],
            },
            { name: 'internalNotes', label: 'Notes internes', type: 'textarea' },
          ],
        },
        {
          label: 'Métadonnées',
          fields: [
            {
              name: 'submittedAt',
              label: 'Reçu le',
              type: 'date',
              required: true,
              index: true,
              defaultValue: () => new Date().toISOString(),
              admin: {
                readOnly: true,
                date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
              },
            },
            { name: 'userAgent', label: 'Navigateur', type: 'text', admin: { readOnly: true } },
          ],
        },
      ],
    },
  ],
}

export default Leads
