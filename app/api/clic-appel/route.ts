import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

/**
 * Enregistre un tap sur un numéro de téléphone ou sur WhatsApp.
 *
 * Appelée par navigator.sendBeacon au moment du clic : le navigateur part
 * aussitôt vers l'appli Téléphone, on ne bloque donc jamais rien et on ne
 * renvoie pas d'erreur au visiteur.
 */

const TYPES = ["telephone", "whatsapp"] as const;
const SOURCE_KEYS = ["google-ads", "gbp", "seo", "social", "ia", "referent", "campagne", "direct"] as const;

function texte(v: unknown, max = 300): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;
}

function choix<T extends string>(v: unknown, autorises: readonly T[]): T | undefined {
  return autorises.includes(v as T) ? (v as T) : undefined;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    // sendBeacon peut envoyer en text/plain : on lit le texte brut.
    body = JSON.parse(await req.text());
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const type = choix(body.type, TYPES);
  if (!type) return new NextResponse(null, { status: 204 });

  const provenance =
    typeof body.provenance === "object" && body.provenance !== null
      ? (body.provenance as Record<string, unknown>)
      : {};

  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: "appels",
      overrideAccess: true,
      data: {
        type,
        numero: texte(body.numero, 40),
        sourceKey: choix(provenance.sourceKey, SOURCE_KEYS),
        source: texte(provenance.source),
        campagne: texte(provenance.campagne),
        motCle: texte(provenance.motCle),
        gclid: texte(provenance.gclid),
        page: texte(body.page),
        cliqueLe: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("[clic-appel] Non enregistré", err);
  }

  return new NextResponse(null, { status: 204 });
}
