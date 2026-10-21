import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Jeton qui autorise le visiteur à compléter SA demande juste après l'envoi.
 *
 * Les identifiants de leads se suivent (1, 2, 3…) : sans jeton, n'importe qui
 * pourrait modifier la fiche d'un autre. Le jeton est signé avec la clé
 * secrète de Payload et expire au bout de 24 heures.
 */

const DUREE_MS = 24 * 60 * 60 * 1000;

function signature(leadId: string, expire: number): string {
  const cle = process.env.PAYLOAD_SECRET;
  if (!cle) throw new Error("PAYLOAD_SECRET manquant");
  return createHmac("sha256", cle).update(`lead:${leadId}:${expire}`).digest("base64url");
}

export function creerJeton(leadId: string): string {
  const expire = Date.now() + DUREE_MS;
  return `${expire}.${signature(leadId, expire)}`;
}

export function jetonValide(leadId: string, jeton: unknown): boolean {
  if (typeof jeton !== "string") return false;
  const [brut, sig] = jeton.split(".");
  const expire = Number(brut);
  if (!sig || !Number.isFinite(expire) || expire < Date.now()) return false;
  try {
    const attendue = Buffer.from(signature(leadId, expire));
    const recue = Buffer.from(sig);
    return attendue.length === recue.length && timingSafeEqual(attendue, recue);
  } catch {
    return false;
  }
}
