/**
 * Choix du visiteur sur les cookies publicitaires (Google Ads).
 *
 * Conforme aux lignes directrices de la CNIL : rien ne se dépose avant le
 * choix, refuser est aussi simple qu'accepter, et le choix se modifie à tout
 * moment depuis le lien « Gérer les cookies » du pied de page.
 *
 * Le choix lui-même est stocké localement : c'est un traceur exempté de
 * consentement, puisqu'il sert justement à respecter la décision du visiteur.
 */

const CLE = "op_consentement";
/** La CNIL recommande de redemander le choix au bout de 6 mois. */
const DUREE_MS = 6 * 30 * 24 * 60 * 60 * 1000;

export const EVENEMENT_CHOIX = "op-consentement";
export const EVENEMENT_OUVRIR = "op-consentement-ouvrir";

type Choix = { publicite: boolean; date: number };

export function lireChoix(): Choix | null {
  if (typeof window === "undefined") return null;
  try {
    const brut = window.localStorage.getItem(CLE);
    if (!brut) return null;
    const choix = JSON.parse(brut) as Choix;
    if (typeof choix.publicite !== "boolean" || Date.now() - choix.date > DUREE_MS) return null;
    return choix;
  } catch {
    return null;
  }
}

export function enregistrerChoix(publicite: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CLE, JSON.stringify({ publicite, date: Date.now() }));
  } catch {
    // Stockage bloqué : le choix vaut pour la page en cours seulement.
  }
  window.dispatchEvent(new CustomEvent(EVENEMENT_CHOIX, { detail: { publicite } }));
}

/** Vrai seulement si le visiteur a explicitement accepté. */
export function publiciteAcceptee(): boolean {
  return lireChoix()?.publicite === true;
}

/** Rouvre le bandeau (lien « Gérer les cookies »). */
export function ouvrirChoixCookies(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENEMENT_OUVRIR));
}
