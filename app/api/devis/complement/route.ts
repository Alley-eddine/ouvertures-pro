import { NextResponse } from "next/server";
import { getPayload } from "payload";
import { Resend } from "resend";
import config from "@payload-config";
import {
  BUDGETS,
  CONNAISSANCES,
  MATERIAUX,
  MOTIVATIONS,
  filtrer,
  libelle,
} from "@/lib/catalogue-projet";
import { jetonValide } from "@/lib/jeton-lead";

/**
 * Complète une demande depuis la page de remerciement : pourquoi, matériau,
 * budget, comment le client nous a connus.
 *
 * Ces questions sont posées APRÈS l'envoi pour ne perdre aucun lead : le
 * visiteur est déjà enregistré, il répond s'il le veut. Le jeton renvoyé par
 * /api/devis prouve qu'il complète bien sa propre demande.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://ouverture-pro.fr");

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const leadId = typeof b.leadId === "string" || typeof b.leadId === "number" ? String(b.leadId) : "";
  if (!leadId || !jetonValide(leadId, b.jeton)) {
    return NextResponse.json({ error: "Lien expiré" }, { status: 403 });
  }

  const motivations = filtrer(MOTIVATIONS, b.motivations);
  const materiaux = filtrer(MATERIAUX, b.materiaux);
  const budget = filtrer(BUDGETS, [b.budget])[0];
  const sourceDeclaree = filtrer(CONNAISSANCES, [b.sourceDeclaree])[0];
  if (!motivations.length && !materiaux.length && !budget && !sourceDeclaree) {
    return NextResponse.json({ ok: true, rien: true });
  }

  const payload = await getPayload({ config });
  const lead = await payload.findByID({ collection: "leads", id: leadId, depth: 0, overrideAccess: true }).catch(() => null);
  // Une fois que Cédric a pris la demande en main, c'est lui qui tient la fiche.
  if (!lead || lead.status !== "new") {
    return NextResponse.json({ error: "Demande déjà prise en charge" }, { status: 409 });
  }

  await payload.update({
    collection: "leads",
    id: leadId,
    overrideAccess: true,
    data: {
      ...(motivations.length ? { motivations } : {}),
      ...(materiaux.length ? { materiaux } : {}),
      ...(budget ? { budget } : {}),
      ...(sourceDeclaree ? { sourceDeclaree } : {}),
    },
  });

  await prevenir({
    nom: lead.nomComplet ?? lead.firstName,
    email: lead.email ?? undefined,
    lignes: [
      motivations.length ? `Pourquoi   : ${motivations.map((m) => libelle(MOTIVATIONS, m)).join(", ")}` : "",
      materiaux.length ? `Matériaux  : ${materiaux.map((m) => libelle(MATERIAUX, m)).join(", ")}` : "",
      budget ? `Budget     : ${libelle(BUDGETS, budget)}` : "",
      sourceDeclaree ? `Nous a connus par : ${libelle(CONNAISSANCES, sourceDeclaree)}` : "",
    ].filter(Boolean),
    lienAdmin: `${SITE_URL}/admin/collections/leads/${leadId}`,
  });

  return NextResponse.json({ ok: true });
}

/** Court email de complément, envoyé après la notification principale. N'échoue jamais. */
async function prevenir(c: { nom: string; email?: string; lignes: string[]; lienAdmin: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.DEVIS_TO_EMAIL?.split(",").map((e) => e.trim()).filter(Boolean);
  if (!apiKey || !from || !to?.length) return;
  try {
    await new Resend(apiKey).emails.send({
      from,
      to,
      replyTo: c.email,
      subject: `Compléments — ${c.nom}`,
      text: [
        `${c.nom} a complété sa demande :`,
        "",
        ...c.lignes,
        "",
        `Fiche complète : ${c.lienAdmin}`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("[devis/complement] Email non envoyé", err);
  }
}
