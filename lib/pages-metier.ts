import { RAYON_DEPANNAGE_KM, RAYON_KM, TEXTE_ZONE } from "./zone";

/**
 * Pages métier : une page par métier poussé dans les campagnes Google Ads,
 * pour qu'une annonce « volets roulants » arrive sur une page qui parle de
 * volets roulants, pas sur l'accueil.
 *
 * Tout le contenu s'en tient aux faits : réponses de Cédric (octobre 2026),
 * ce que le site affirmait déjà, et de vrais avis Google repris du site.
 * Pas de prix, pas de délai de pose court, pas d'aides (l'entreprise n'est
 * pas certifiée RGE). Les photos manquantes arriveront de Cédric.
 */

export type Photo = { src: string; alt: string };
export type AvantApres = { avant: Photo; apres: Photo; titre: string };
export type Avis = { auteur: string; texte: string };
export type Question = { q: string; r: string };

export type PageMetier = {
  slug: string;
  /** Titre court pour les liens et le fil d'Ariane. */
  nom: string;
  metaTitre: string;
  metaDescription: string;
  h1: string;
  intro: string;
  /** Services pré-cochés sur le formulaire de devis (valeurs de lib/catalogue-projet). */
  services: string[];
  /** Le dépannage a son propre rayon et met l'appel en avant. */
  depannage?: boolean;
  prestations: string[];
  etapes: { titre: string; texte: string }[];
  avantApres: AvantApres[];
  photos: Photo[];
  avis: Avis[];
  faq: Question[];
};

const RA = "/images/realisations/avant-apres";

const ETAPES_POSE = [
  {
    titre: "Visite et conseils",
    texte: `Cédric vient chez vous, prend les mesures et vous aide à choisir. Gratuit dans un rayon de ${RAYON_KM} km autour de Lisses.`,
  },
  { titre: "Devis détaillé", texte: "Vous recevez un devis clair, poste par poste, sans engagement." },
  {
    titre: "Fabrication sur mesure",
    texte: "Tout est fabriqué à vos dimensions : comptez en moyenne 6 semaines entre la signature et la pose.",
  },
  {
    titre: "Pose et finitions",
    texte: "L'équipe pose, fait les finitions et laisse le chantier propre. Bâches et nettoyage chaque soir.",
  },
];

const FAQ_COMMUNES: Question[] = [
  { q: "Le devis est-il gratuit ?", r: TEXTE_ZONE },
  {
    q: "Peut-on payer en plusieurs fois ?",
    r: "Oui, selon le montant et la taille du chantier. Parlez-en à Cédric au moment du devis.",
  },
];

export const PAGES_METIER: PageMetier[] = [
  {
    slug: "fenetres-et-portes",
    nom: "Fenêtres et portes",
    metaTitre: "Fenêtres et portes d'entrée sur mesure à Lisses et en Essonne",
    metaDescription:
      "Pose de fenêtres, baies vitrées et portes d'entrée en PVC, aluminium, bois ou mixte, autour de Lisses (91). Devis gratuit dans un rayon de 25 km.",
    h1: "Fenêtres et portes d'entrée, posées par des artisans de Lisses",
    intro:
      "PVC, aluminium, bois ou mixte : on remplace vos fenêtres, vos baies vitrées et votre porte d'entrée, sur mesure. Cédric vient chez vous, vous conseille, puis l'équipe pose et s'occupe des finitions.",
    services: ["fenetres", "portes-entree"],
    prestations: [
      "Fenêtres et portes-fenêtres en PVC, aluminium, bois ou mixte",
      "Double ou triple vitrage, pour l'isolation thermique et phonique",
      "Baies vitrées coulissantes",
      "Portes d'entrée sur mesure, pleines ou vitrées, avec grille de défense si besoin",
      "Portes blindées",
      "Dépose des anciennes menuiseries et finitions comprises",
    ],
    etapes: ETAPES_POSE,
    avantApres: [
      {
        titre: "Rénovation de fenêtre classique",
        avant: { src: `${RA}/10avant.webp`, alt: "Ancienne fenêtre en bois simple vitrage détériorée" },
        apres: { src: `${RA}/10apres.webp`, alt: "Nouvelle fenêtre blanche double vitrage haute isolation" },
      },
      {
        titre: "Remplacement porte d'entrée semi-vitrée",
        avant: { src: `${RA}/3avant.webp`, alt: "Vieille porte d'entrée en bois abîmée peinture écaillée" },
        apres: { src: `${RA}/3apres.webp`, alt: "Nouvelle porte d'entrée bleue vitrée avec grille de défense en fer forgé" },
      },
      {
        titre: "Installation de baie vitrée",
        avant: { src: `${RA}/1avant.webp`, alt: "Intérieur maison vide avant installation baie vitrée" },
        apres: { src: `${RA}/1apres.webp`, alt: "Installation baie vitrée aluminium noir sur terrasse bois neuve" },
      },
      {
        titre: "Porte d'entrée classique et fer forgé",
        avant: { src: `${RA}/8avant.webp`, alt: "Vieille porte en bois vert foncé avec peinture écaillée" },
        apres: { src: `${RA}/8apres.webp`, alt: "Porte d'entrée gris anthracite avec grille de défense en fer forgé" },
      },
    ],
    photos: [
      {
        src: "/images/galerie/renovation-maison-pierre-baies-vitrees-vert-menthe.webp",
        alt: "Maison en pierre rénovée avec baies vitrées vert menthe",
      },
      {
        src: "/images/galerie/porte-entree-anthracite-vitrage-fer-forge-dore.webp",
        alt: "Porte d'entrée anthracite avec vitrage et fer forgé doré",
      },
      {
        src: "/images/services/pose-baie-vitree-coulissante-aluminium-noir.webp",
        alt: "Grande baie vitrée coulissante aluminium noir, vue depuis un salon",
      },
    ],
    avis: [
      {
        auteur: "Gilles Rayaume",
        texte:
          "Changement de porte d'entrée et de 8 fenêtres et 4 portes-fenêtres. Chantier réalisé dans les temps avec une équipe à l'écoute du client mais également d'un grand professionnalisme à tous niveaux.",
      },
      {
        auteur: "Adel Ghollam",
        texte:
          "Comme le nom de l'entreprise l'indique, un travail de « pro », propre, de qualité et dans les délais. Nous avons changé 2 baies vitrées et 2 fenêtres…",
      },
    ],
    faq: [
      {
        q: "PVC, aluminium ou bois : que choisir ?",
        r: "Le PVC offre une bonne isolation pour un budget maîtrisé. L'aluminium permet des profilés fins et de grandes baies. Le bois apporte du cachet mais demande plus d'entretien, et le mixte combine deux matériaux. Cédric vous conseille sur place selon votre maison.",
      },
      {
        q: "Combien de temps avant la pose ?",
        r: "En moyenne 6 semaines entre la signature du devis et la pose, car tout est fabriqué sur mesure.",
      },
      ...FAQ_COMMUNES,
    ],
  },
  {
    slug: "volets-roulants",
    nom: "Volets roulants",
    metaTitre: "Volets roulants : pose, remplacement et motorisation à Lisses",
    metaDescription:
      "Pose et remplacement de volets roulants manuels, motorisés ou solaires autour de Lisses (91). Devis gratuit dans un rayon de 25 km.",
    h1: "Volets roulants : pose, remplacement et motorisation",
    intro:
      "Volets roulants manuels, motorisés ou solaires, en rénovation sur vos fenêtres existantes ou en neuf. On peut aussi remplacer un vieux volet à manivelle par un modèle motorisé.",
    services: ["volets-roulants"],
    prestations: [
      "Volets roulants manuels, motorisés ou solaires",
      "Pose en rénovation sur fenêtres existantes, ou en neuf",
      "Passage d'un volet à manivelle ou à sangle vers un volet motorisé",
      "Remplacement de volets anciens ou abîmés",
      "Commande par interrupteur ou télécommande",
    ],
    etapes: ETAPES_POSE,
    avantApres: [],
    photos: [],
    avis: [
      {
        auteur: "Rita Pulval-Dady",
        texte:
          "Excellent travail pour la fourniture et pose de volets roulants solaires. Entreprise sérieuse, respect des délais annoncés, courtoisie et travaux conformes.",
      },
      {
        auteur: "E. G.",
        texte:
          "Une équipe très professionnelle, très bien encadrée. Je suis très contente du travail réalisé : pose de stores bannettes, fenêtre et volet roulant dans mon appartement. Je recommande !",
      },
    ],
    faq: [
      {
        q: "Motorisé ou solaire : quelle différence ?",
        r: "Un volet motorisé classique est relié à l'électricité de la maison. Un volet solaire a son propre panneau et sa batterie : aucun câble à tirer, pratique en rénovation. Cédric vous dit sur place ce qui convient à vos fenêtres.",
      },
      {
        q: "Mon volet est bloqué, vous pouvez le réparer ?",
        r: `Oui, dans un rayon de ${RAYON_DEPANNAGE_KM} km autour de Lisses : voyez notre page dépannage.`,
      },
      ...FAQ_COMMUNES,
    ],
  },
  {
    slug: "portes-de-garage",
    nom: "Portes de garage",
    metaTitre: "Portes de garage sectionnelles, enroulables ou battantes à Lisses",
    metaDescription:
      "Pose de portes de garage sectionnelles, enroulables ou battantes, motorisées sur demande, autour de Lisses (91). Devis gratuit dans un rayon de 25 km.",
    h1: "Portes de garage sectionnelles, enroulables ou battantes",
    intro:
      "Sectionnelle, enroulable ou battante, motorisée si vous le souhaitez : on remplace votre porte de garage sur mesure, et on reprend l'existant s'il le faut.",
    services: ["portes-garage"],
    prestations: [
      "Portes sectionnelles, enroulables ou battantes",
      "Motorisation avec télécommande",
      "Fabrication sur mesure, aux dimensions de votre garage",
      "Dépose de l'ancienne porte et finitions comprises",
    ],
    etapes: ETAPES_POSE,
    avantApres: [
      {
        titre: "Installation porte de garage motorisée",
        avant: { src: `${RA}/11avant.webp`, alt: "Ancienne porte de garage enroulable marron vieillissante" },
        apres: { src: `${RA}/11apres.webp`, alt: "Nouvelle porte de garage enroulable blanche motorisée en aluminium" },
      },
    ],
    photos: [
      {
        src: "/images/galerie/porte-garage-sectionnelle-rouge.webp",
        alt: "Porte de garage sectionnelle rouge",
      },
      {
        src: "/images/galerie/porte-garage-battante-blanche-hublots.webp",
        alt: "Porte de garage battante blanche à hublots",
      },
      {
        src: "/images/galerie/portail-porte-garage-anthracite-camionnette-ouvertures-pro.webp",
        alt: "Portail et porte de garage anthracite, camionnette Ouvertures Pro",
      },
    ],
    avis: [
      {
        auteur: "Ilona Jobert",
        texte:
          "Un grand merci à Cédric et son équipe pour leur professionnalisme et leur gentillesse. La pose de ma porte de garage s'est déroulée dans les meilleures conditions et je suis plus que satisfaite du résultat.",
      },
      {
        auteur: "Aurore Boussardon",
        texte:
          "Nous sommes très satisfaits : notre chantier a été réalisé comme prévu — délais, produits, coûts et surtout superbes finitions. Nous avons changé notre porte d'entrée, de garage (motorisée) et la buanderie.",
      },
    ],
    faq: [
      {
        q: "Sectionnelle, enroulable ou battante ?",
        r: "La sectionnelle monte au plafond et laisse l'allée libre. L'enroulable s'enroule au-dessus de l'ouverture, pratique quand le plafond est encombré. La battante s'ouvre comme deux grands vantaux. Le choix dépend de votre garage : Cédric le voit sur place.",
      },
      {
        q: "Combien de temps avant la pose ?",
        r: "En moyenne 6 semaines entre la signature du devis et la pose, le temps de fabriquer la porte sur mesure.",
      },
      ...FAQ_COMMUNES,
    ],
  },
  {
    slug: "depannage-volets-roulants",
    nom: "Dépannage de volets",
    metaTitre: "Dépannage de volets roulants autour de Lisses (20 km)",
    metaDescription:
      "Volet roulant bloqué, sangle cassée, moteur en panne : dépannage dans un rayon de 20 km autour de Lisses (91). Appelez-nous.",
    h1: "Dépannage de volets roulants autour de Lisses",
    intro: `Volet bloqué, sangle ou manivelle cassée, moteur qui ne répond plus : on intervient dans un rayon de ${RAYON_DEPANNAGE_KM} km autour de Lisses. Appelez-nous en décrivant la panne, on vous dit tout de suite ce qu'on peut faire.`,
    services: ["reparation"],
    depannage: true,
    prestations: [
      "Volet roulant bloqué, ouvert ou fermé",
      "Sangle, manivelle ou treuil cassé",
      "Moteur ou télécommande qui ne répond plus",
      "Lames abîmées ou sorties des coulisses",
      "Passage au motorisé si la réparation ne vaut pas le coup",
    ],
    etapes: [
      {
        titre: "Vous nous appelez",
        texte: "Décrivez la panne : type de volet (manuel ou motorisé), ce qui se passe, depuis quand.",
      },
      {
        titre: "On vous dit ce qu'on peut faire",
        texte: "Selon la panne, on vous propose une intervention, ou un remplacement si la réparation ne vaut pas le coup.",
      },
      {
        titre: "Intervention",
        texte: `Uniquement dans un rayon de ${RAYON_DEPANNAGE_KM} km autour de Lisses. En vraie urgence (porte fracturée qui ne ferme plus, vitre cassée), intervention possible le jour même.`,
      },
    ],
    avantApres: [],
    photos: [],
    avis: [
      {
        auteur: "Clode Hivernon",
        texte:
          "J'ai fait appel à cette société à plusieurs reprises. La satisfaction est au rendez-vous à chaque fois. Une équipe dynamique et très réactive, aussi bien sur les devis que sur les délais d'installation !",
      },
      {
        auteur: "Brigitte Alexandre",
        texte:
          "Équipe professionnelle, courtoise avec le sourire, à l'écoute et proche de ses clients. Respect des délais. Travail soigné, chantier laissé propre. Entreprise sérieuse à recommander. Merci Cédric et Benjamin.",
      },
    ],
    faq: [
      {
        q: "Jusqu'où vous déplacez-vous pour un dépannage ?",
        r: `Jusqu'à ${RAYON_DEPANNAGE_KM} km autour de Lisses, pas au-delà. Pour un remplacement de volets, la zone est de ${RAYON_KM} km.`,
      },
      {
        q: "Intervenez-vous le jour même ?",
        r: "En cas de vraie urgence, comme une porte fracturée qui ne ferme plus ou une vitre cassée, oui si c'est possible. Pour un volet bloqué, on vous propose le premier créneau disponible.",
      },
      {
        q: "Mon volet est trop vieux, faut-il le changer ?",
        r: "Pas forcément. On vous dit honnêtement si la réparation vaut le coup, ou si un volet neuf, éventuellement motorisé, est plus raisonnable.",
      },
    ],
  },
];

export function pageMetier(slug: string): PageMetier | undefined {
  return PAGES_METIER.find((p) => p.slug === slug);
}
