import { COMMUNES } from "./zone-communes";

/**
 * Zone d'intervention d'Ouvertures Pro, d'après Cédric (octobre 2026) :
 * devis et déplacement gratuits jusqu'à 25 km de l'atelier de Lisses ;
 * au-delà, 150 € HT, offerts si le client signe le devis.
 * Les dépannages, eux, ne se font qu'à 20 km au plus, sans exception : une
 * fois sur deux, le déplacement ne débouche sur rien.
 *
 * Les distances sont à vol d'oiseau, depuis le centre de la commune : sur la
 * route, comptez un peu plus. C'est une indication pour Cédric et pour le
 * visiteur, pas un calcul de facture.
 */

export const RAYON_KM = 25;
export const FRAIS_HORS_ZONE_HT = 150;
export const RAYON_DEPANNAGE_KM = 20;
/** Valeur du service « Réparation / dépannage » dans lib/catalogue-projet. */
export const SERVICE_DEPANNAGE = "reparation";

/** Phrase de zone réutilisée sur le site. */
export const TEXTE_ZONE =
  `Devis et déplacement gratuits dans un rayon de ${RAYON_KM} km autour de Lisses. ` +
  `Au-delà, ils sont facturés ${FRAIS_HORS_ZONE_HT} € HT, et offerts si vous signez le devis.`;

export const TEXTE_ZONE_DEPANNAGE =
  `Dépannages dans un rayon de ${RAYON_DEPANNAGE_KM} km autour de Lisses uniquement.`;

/** Vrai si la commune est trop loin pour un dépannage (inconnue au-delà de 45 km comprise). */
export function depannageHorsZone(z: Zone): boolean {
  return z.km === null || z.km > RAYON_DEPANNAGE_KM;
}

/** Plus loin que la table : tout code postal absent est au-delà de cette distance. */
const LIMITE_TABLE_KM = 45;

export type Zone = {
  /** Distance en km à vol d'oiseau, ou null si au-delà de la table (> 45 km). */
  km: number | null;
  /** Commune retenue pour le calcul. */
  commune: string | null;
  horsZone: boolean;
};

function normaliser(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’\-]/g, " ")
    .replace(/\bst(e?)\b/g, "saint$1")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Situe une adresse par rapport à la zone. Renvoie null si le code postal
 * n'est pas un code français valide (5 chiffres) : on ne conclut rien.
 *
 * Un code postal couvre parfois plusieurs communes : on prend celle dont le
 * nom correspond à la ville saisie, sinon la plus proche (au bénéfice du
 * client, pour ne jamais annoncer de frais à tort).
 */
export function situer(codePostal: string, ville = ""): Zone | null {
  const cp = codePostal.replace(/\s/g, "");
  if (!/^\d{5}$/.test(cp)) return null;

  const candidates = COMMUNES.filter((c) => c[0] === cp);
  if (!candidates.length) return { km: null, commune: null, horsZone: true };

  const v = normaliser(ville);
  const exacte = v ? candidates.find((c) => normaliser(c[1]) === v) : undefined;
  const [, commune, km] = exacte ?? candidates.reduce((a, b) => (b[2] < a[2] ? b : a));
  return { km, commune, horsZone: km > RAYON_KM };
}

export function decrireDistance(z: Zone): string {
  return z.km === null ? `plus de ${LIMITE_TABLE_KM} km` : `environ ${z.km} km`;
}
