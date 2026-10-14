/**
 * Conversions Google Ads.
 *
 * Tout est piloté par des variables d'environnement : tant que
 * NEXT_PUBLIC_GOOGLE_ADS_ID est vide, aucun script Google n'est chargé et
 * ces fonctions ne font rien. Une conversion n'est par ailleurs envoyée que
 * si le visiteur a accepté les cookies publicitaires (Consent Mode v2 se
 * charge du reste).
 *
 * Les variables NEXT_PUBLIC_ sont figées au build : après les avoir
 * renseignées dans Vercel, il faut redéployer.
 */

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";

/** Libellés de conversion créés dans Google Ads (Objectifs → Conversions). */
const LIBELLES = {
  devis: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_DEVIS ?? "",
  contact: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CONTACT ?? "",
  appel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_APPEL ?? "",
  whatsapp: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP ?? "",
} as const;

/**
 * Conversion « Appels depuis le site » : Google remplace le numéro affiché par
 * un numéro de transfert pour les visiteurs venus d'une annonce, et compte
 * chaque appel abouti comme conversion.
 */
export const LIBELLE_APPEL_SITE = process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_APPEL_SITE ?? "";

/** Le numéro tel qu'il est écrit sur le site : Google le cherche pour le remplacer. */
export const NUMERO_SUIVI = "07 71 74 20 83";

export type TypeConversion = keyof typeof LIBELLES;

type Gtag = (...args: unknown[]) => void;

function gtag(): Gtag | null {
  if (typeof window === "undefined") return null;
  const g = (window as unknown as { gtag?: Gtag }).gtag;
  return typeof g === "function" ? g : null;
}

export function signalerConversion(type: TypeConversion): void {
  const libelle = LIBELLES[type];
  const g = gtag();
  if (!GOOGLE_ADS_ID || !libelle || !g) return;
  g("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${libelle}` });
}
