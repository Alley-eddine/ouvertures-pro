/**
 * Provenance des demandes.
 *
 * On enregistre d'où vient le visiteur à sa première page vue, puis on rattache
 * cette provenance à chaque demande envoyée. Objectif : savoir si un lead vient
 * de Google Ads, du référencement naturel, des réseaux ou d'un accès direct —
 * et, pour Google Ads, quelle campagne et quel mot-clé l'ont amené.
 *
 * On garde la PREMIÈRE provenance de la session : si quelqu'un arrive par une
 * annonce puis navigue, c'est bien l'annonce qui a produit la demande.
 */

import { publiciteAcceptee } from "@/lib/consentement";

const STORAGE_KEY = "op_attribution";
/**
 * Avec l'accord du visiteur, la provenance est gardée 90 jours : quelqu'un qui
 * clique sur une annonce lundi et revient jeudi en tapant l'adresse reste
 * attribué à l'annonce. Sans accord, elle ne dure que le temps de l'onglet.
 */
const DUREE_LONGUE_MS = 90 * 24 * 60 * 60 * 1000;

export type Attribution = {
  /** Libellé lisible, affiché tel quel dans l'email de notification. */
  source: string;
  /** Clé courte et stable, pour les filtres et les statistiques. */
  sourceKey: "google-ads" | "gbp" | "seo" | "social" | "ia" | "referent" | "direct" | "campagne";
  campagne?: string;
  motCle?: string;
  gclid?: string;
  referent?: string;
  pageArrivee?: string;
  vuLe?: string;
};

const MOTEURS = ["google.", "bing.", "duckduckgo.", "yahoo.", "ecosia.", "qwant."];
const SOCIAL = [
  "facebook.",
  "instagram.",
  "linkedin.",
  "tiktok.",
  "youtube.",
  "pinterest.",
  "t.co",
  "x.com",
  "twitter.",
  "snapchat.",
];
const ASSISTANTS_IA = ["chatgpt.", "openai.", "perplexity.", "claude.", "copilot.", "gemini.", "bard."];

function hote(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function contient(hostname: string, aiguilles: string[]): boolean {
  return aiguilles.some((a) => hostname.includes(a));
}

/** Déduit la provenance à partir de l'URL d'arrivée et du référent. */
export function deduireProvenance(href: string, referent: string): Attribution {
  let params: URLSearchParams;
  try {
    params = new URL(href).searchParams;
  } catch {
    params = new URLSearchParams();
  }

  const gclid = params.get("gclid") ?? params.get("wbraid") ?? params.get("gbraid") ?? undefined;
  const utmSource = params.get("utm_source")?.toLowerCase() ?? "";
  const utmMedium = params.get("utm_medium")?.toLowerCase() ?? "";
  const campagne = params.get("utm_campaign") ?? undefined;
  const motCle = params.get("utm_term") ?? undefined;

  const payant = ["cpc", "ppc", "paid", "paidsearch"].includes(utmMedium);
  const base = {
    campagne,
    motCle,
    gclid,
    referent: referent || undefined,
    pageArrivee: href,
    vuLe: new Date().toISOString(),
  };

  // Google Ads : le gclid est posé par Google sur chaque clic d'annonce.
  if (gclid || (payant && utmSource.includes("google"))) {
    return { ...base, source: "Google Ads", sourceKey: "google-ads" };
  }

  // Fiche Google : le lien « Site Web » de la fiche est balisé
  // ?utm_source=google&utm_medium=organic&utm_campaign=gbp
  if (campagne?.toLowerCase() === "gbp" || ["gbp", "gmb", "google-business"].includes(utmSource)) {
    return { ...base, source: "Fiche Google", sourceKey: "gbp" };
  }

  // Autre campagne balisée (Meta Ads, emailing, QR code sur un flyer…).
  if (utmSource) {
    const canal = payant ? "campagne payante" : "campagne";
    return { ...base, source: `${utmSource} (${canal})`, sourceKey: "campagne" };
  }

  const h = hote(referent);
  if (!h) {
    return { ...base, source: "Accès direct", sourceKey: "direct" };
  }
  if (contient(h, ASSISTANTS_IA)) {
    return { ...base, source: "Assistant IA (ChatGPT, Perplexity…)", sourceKey: "ia" };
  }
  if (contient(h, MOTEURS)) {
    const moteur = h.includes("google.") ? "Google" : h.split(".")[0];
    return { ...base, source: `SEO ${moteur} (référencement naturel)`, sourceKey: "seo" };
  }
  if (contient(h, SOCIAL)) {
    return { ...base, source: `Réseaux sociaux (${h.replace(/^www\./, "")})`, sourceKey: "social" };
  }
  return { ...base, source: `Site référent (${h.replace(/^www\./, "")})`, sourceKey: "referent" };
}

/**
 * À appeler une fois au chargement. Mémorise la provenance si ce n'est pas
 * déjà fait pour cette session, sauf si le visiteur revient par une annonce :
 * dans ce cas la nouvelle provenance payante remplace l'ancienne.
 */
export function capturerProvenance(): void {
  if (typeof window === "undefined") return;
  try {
    const actuelle = deduireProvenance(window.location.href, document.referrer);
    const stockee = lireProvenance();
    const remplace =
      !stockee ||
      // un nouveau clic publicitaire prime sur une provenance plus ancienne
      (actuelle.sourceKey === "google-ads" && stockee.sourceKey !== "google-ads");
    ecrire(remplace || !stockee ? actuelle : stockee);
  } catch {
    // Navigation privée, stockage bloqué : on continue sans provenance.
  }
}

function ecrire(a: Attribution): void {
  const json = JSON.stringify(a);
  window.sessionStorage.setItem(STORAGE_KEY, json);
  if (publiciteAcceptee()) window.localStorage.setItem(STORAGE_KEY, json);
}

/** Provenance longue, seulement si le visiteur a accepté et qu'elle a moins de 90 jours. */
function lireLongue(): Attribution | null {
  if (!publiciteAcceptee()) return null;
  const brut = window.localStorage.getItem(STORAGE_KEY);
  if (!brut) return null;
  const a = JSON.parse(brut) as Attribution;
  const age = a.vuLe ? Date.now() - new Date(a.vuLe).getTime() : Infinity;
  if (age > DUREE_LONGUE_MS) {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
  return a;
}

export function lireProvenance(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    // La provenance longue est la plus ancienne : c'est elle qui a amené le visiteur.
    const longue = lireLongue();
    if (longue) return longue;
    const brut = window.sessionStorage.getItem(STORAGE_KEY);
    return brut ? (JSON.parse(brut) as Attribution) : null;
  } catch {
    return null;
  }
}

/**
 * À appeler quand le visiteur fait son choix : on garde la provenance 90 jours
 * s'il accepte, et on efface toute trace longue s'il refuse ou se rétracte.
 */
export function appliquerConsentementProvenance(publicite: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (!publicite) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const brut = window.sessionStorage.getItem(STORAGE_KEY);
    if (brut && !window.localStorage.getItem(STORAGE_KEY)) {
      window.localStorage.setItem(STORAGE_KEY, brut);
    }
  } catch {
    // Stockage bloqué : rien à faire.
  }
}

/**
 * Provenance à joindre à une demande. Si rien n'a été mémorisé (stockage
 * bloqué, onglet restauré…), on déduit au moment de l'envoi plutôt que de
 * renvoyer une demande sans provenance.
 */
export function provenancePourEnvoi(): Attribution | null {
  if (typeof window === "undefined") return null;
  return lireProvenance() ?? deduireProvenance(window.location.href, document.referrer);
}
