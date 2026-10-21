/**
 * Listes de choix d'un projet, partagées par les formulaires du site, la route
 * /api/devis, la collection Leads et l'email de notification.
 *
 * Elles reprennent la trame que Cédric suit en rendez-vous : domaine de
 * compétence, motivation, matériau, et « comment nous avez-vous connu ».
 * Ajouter une option ici l'ajoute partout ; la retirer demande une migration
 * de la base (les valeurs sont des énumérations Postgres).
 */

type Option = { readonly value: string; readonly label: string };

export const GROUPES_SERVICES = [
  {
    titre: "Menuiseries",
    options: [
      { value: "fenetres", label: "Fenêtres" },
      { value: "fenetres-toit", label: "Fenêtres de toit" },
      { value: "portes-entree", label: "Portes d'entrée" },
      { value: "portes-blindees", label: "Portes blindées" },
    ],
  },
  {
    titre: "Fermetures",
    options: [
      { value: "volets-roulants", label: "Volets roulants" },
      { value: "volets-battants", label: "Volets battants" },
      { value: "persiennes", label: "Persiennes métalliques" },
      { value: "portes-garage", label: "Portes de garage" },
    ],
  },
  {
    titre: "Extérieur",
    options: [
      { value: "portail", label: "Portail" },
      { value: "portillon", label: "Portillon" },
      { value: "cloture", label: "Clôture" },
    ],
  },
  {
    titre: "Verrières",
    options: [
      { value: "verriere-interieur", label: "Verrière d'intérieur" },
      { value: "verriere-exterieur", label: "Verrière d'extérieur" },
      { value: "verriere-toit", label: "Verrière de toit" },
    ],
  },
  {
    titre: "Automatisme et sécurité",
    options: [
      { value: "automatisme", label: "Automatisme / domotique" },
      { value: "alarme", label: "Alarme" },
    ],
  },
  {
    titre: "Dépannage",
    options: [{ value: "reparation", label: "Réparation / dépannage" }],
  },
] as const satisfies readonly { titre: string; options: readonly Option[] }[];

type OptionService = (typeof GROUPES_SERVICES)[number]["options"][number];

export const SERVICES: readonly OptionService[] = GROUPES_SERVICES.flatMap(
  (g): readonly OptionService[] => g.options
);

/** Pourquoi le client veut faire les travaux : c'est l'argument à lui servir. */
export const MOTIVATIONS = [
  { value: "thermique", label: "Isolation thermique" },
  { value: "phonique", label: "Isolation phonique" },
  { value: "securite", label: "Sécurité" },
  { value: "esthetique", label: "Esthétique, modernisation" },
  { value: "panne", label: "Élément abîmé ou en panne" },
] as const satisfies readonly Option[];

export const MATERIAUX = [
  { value: "pvc", label: "PVC" },
  { value: "aluminium", label: "Aluminium" },
  { value: "bois", label: "Bois" },
  { value: "mixte", label: "Mixte (PVC / alu)" },
  { value: "acier", label: "Acier" },
  { value: "conseil", label: "Je ne sais pas, conseillez-moi" },
] as const satisfies readonly Option[];

export const BUDGETS = [
  { value: "moins-2000", label: "Moins de 2 000 €" },
  { value: "2000-5000", label: "2 000 à 5 000 €" },
  { value: "5000-10000", label: "5 000 à 10 000 €" },
  { value: "plus-10000", label: "Plus de 10 000 €" },
  { value: "inconnu", label: "Je ne sais pas encore" },
] as const satisfies readonly Option[];

/**
 * « Comment nous avez-vous connu ? », déclaré par le client. Complète le canal
 * détecté automatiquement sans jamais le remplacer : le bouche-à-oreille ou un
 * camion vu dans la rue n'apparaissent qu'en « accès direct » côté machine.
 * Pas de choix « Annonce Google » : les visiteurs la confondent avec les
 * résultats naturels, et les annonces sont de toute façon détectées.
 */
export const CONNAISSANCES = [
  { value: "recherche-google", label: "Recherche Google" },
  { value: "google-maps", label: "Google Maps" },
  { value: "recommandation", label: "Recommandation d'un proche" },
  { value: "reseaux-sociaux", label: "Réseaux sociaux" },
  { value: "chantier-vehicule", label: "Un chantier ou un véhicule" },
  { value: "deja-client", label: "Déjà client" },
  { value: "autre", label: "Autre" },
] as const satisfies readonly Option[];

export type ValeurService = OptionService["value"];
export type ValeurMotivation = (typeof MOTIVATIONS)[number]["value"];
export type ValeurMateriau = (typeof MATERIAUX)[number]["value"];
export type ValeurConnaissance = (typeof CONNAISSANCES)[number]["value"];
export type ValeurBudget = (typeof BUDGETS)[number]["value"];

export function libelle(options: readonly Option[], valeur: string): string {
  return options.find((o) => o.value === valeur)?.label ?? valeur;
}

/** Ne garde que les valeurs connues : le corps de la requête vient du navigateur. */
export function filtrer<T extends string>(options: readonly { value: T }[], valeurs: unknown): T[] {
  if (!Array.isArray(valeurs)) return [];
  const connues = new Set<string>(options.map((o) => o.value));
  return [...new Set(valeurs.filter((v): v is T => typeof v === "string" && connues.has(v)))];
}

/** Copie modifiable pour les champs `select` de Payload. */
export function optionsPayload(options: readonly Option[]): { label: string; value: string }[] {
  return options.map((o) => ({ label: o.label, value: o.value }));
}
