import { NextResponse } from "next/server";
import { getPayload } from "payload";
import { Resend } from "resend";
import config from "@payload-config";

// Logo affiché dans l'email — URL hostée (data: URI / base64 strippés par Gmail).
// La prod tourne sur ouverture-pro.fr, le logo est servi par Next.
const LOGO_URL = "https://ouverture-pro.fr/images/logofinal.png";

const SERVICE_LABELS: Record<string, string> = {
  fenetres: "Fenêtres",
  portes: "Portes",
  volets: "Volets",
  reparation: "Réparation",
};

const PROJECT_TYPE_LABELS: Record<string, string> = {
  neuf: "Construction neuve",
  renovation: "Rénovation",
  remplacement: "Remplacement à l'identique",
};

const CONTACT_PREF_LABELS: Record<string, string> = {
  email: "Email",
  phone: "Téléphone",
  whatsapp: "WhatsApp",
};

// Qualification : renseignée côté formulaire, facultative.
const BUDGET_LABELS: Record<string, string> = {
  "moins-2000": "Budget < 2 000 €",
  "2000-5000": "Budget 2 000 – 5 000 €",
  "5000-10000": "Budget 5 000 – 10 000 €",
  "plus-10000": "Budget > 10 000 €",
  inconnu: "Budget non défini",
};

const ECHEANCE_LABELS: Record<string, string> = {
  "des-que-possible": "Dès que possible",
  "1-3-mois": "Sous 1 à 3 mois",
  "3-6-mois": "Sous 3 à 6 mois",
  renseignement: "Se renseigne",
};

const SITUATION_LABELS: Record<string, string> = {
  proprietaire: "Propriétaire",
  locataire: "Locataire",
  copropriete: "Copropriété",
};

const NB_OUVERTURES_LABELS: Record<string, string> = {
  "1-2": "1 à 2 ouvertures",
  "3-5": "3 à 5 ouvertures",
  "6-10": "6 à 10 ouvertures",
  "plus-10": "Plus de 10 ouvertures",
};

/** Réponses qui signalent un projet à rappeler en priorité. */
const QUALIFICATION_CHAUDE = new Set([
  "5000-10000",
  "plus-10000",
  "des-que-possible",
  "1-3-mois",
]);

type Provenance = {
  source?: string;
  sourceKey?: string;
  campagne?: string;
  motCle?: string;
  gclid?: string;
  referent?: string;
  pageArrivee?: string;
};

type DevisPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  projectType: string;
  services: string[];
  description: string;
  preferredContact: string;
  budget: string;
  echeance: string;
  situation: string;
  nbOuvertures: string;
  origine: string;
  provenance: Provenance | null;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function nl2br(s: string): string {
  return escapeHtml(s).replace(/\n/g, "<br>");
}

function validatePayload(body: unknown): { ok: true; data: DevisPayload } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid payload" };
  }
  const b = body as Record<string, unknown>;
  // Le formulaire court de la page d'accueil ne demande ni adresse ni type de
  // projet : on n'exige que de quoi rappeler la personne.
  const origine = texte(b.origine) || "Page devis";
  const required: Array<keyof DevisPayload> =
    origine === "Accueil"
      ? ["firstName", "email", "phone"]
      : ["firstName", "lastName", "email", "phone", "city", "postalCode", "projectType"];
  for (const k of required) {
    if (typeof b[k] !== "string" || (b[k] as string).trim() === "") {
      return { ok: false, error: `Missing or invalid field: ${k}` };
    }
  }
  if (!Array.isArray(b.services)) {
    return { ok: false, error: "services must be an array" };
  }
  // Basic email format check
  const emailStr = b.email as string;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
    return { ok: false, error: "Invalid email format" };
  }
  return {
    ok: true,
    data: {
      firstName: texte(b.firstName),
      lastName: texte(b.lastName),
      email: emailStr.trim(),
      phone: texte(b.phone),
      address: texte(b.address),
      city: texte(b.city),
      postalCode: texte(b.postalCode),
      projectType: texte(b.projectType),
      services: (b.services as unknown[]).filter((s): s is string => typeof s === "string"),
      description: typeof b.description === "string" ? b.description.trim() : "",
      preferredContact:
        typeof b.preferredContact === "string" ? b.preferredContact.trim() : "email",
      budget: texte(b.budget),
      echeance: texte(b.echeance),
      situation: texte(b.situation),
      nbOuvertures: texte(b.nbOuvertures),
      origine,
      provenance: lireProvenance(b.provenance),
    },
  };
}

function texte(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** La provenance vient du navigateur : on ne garde que des champs texte courts. */
function lireProvenance(v: unknown): Provenance | null {
  if (typeof v !== "object" || v === null) return null;
  const p = v as Record<string, unknown>;
  const coupe = (x: unknown) => (typeof x === "string" ? x.trim().slice(0, 300) : undefined);
  const out: Provenance = {
    source: coupe(p.source),
    sourceKey: coupe(p.sourceKey),
    campagne: coupe(p.campagne),
    motCle: coupe(p.motCle),
    gclid: coupe(p.gclid),
    referent: coupe(p.referent),
    pageArrivee: coupe(p.pageArrivee),
  };
  return out.source ? out : null;
}

/** Garde une valeur seulement si elle fait partie des options de la collection. */
function choix<T extends string>(v: string | undefined, autorises: readonly T[]): T | undefined {
  return autorises.includes(v as T) ? (v as T) : undefined;
}

const SOURCE_KEYS = ["google-ads", "seo", "social", "ia", "referent", "campagne", "direct"] as const;
const SERVICES = ["fenetres", "portes", "volets", "reparation"] as const;

/**
 * Enregistre la demande dans l'admin Payload. Ne lève jamais : si la base est
 * indisponible, l'email part quand même — on ne perd pas un lead pour ça.
 * Renvoie l'identifiant du lead, ou null si l'enregistrement a échoué.
 */
async function enregistrerLead(data: DevisPayload, userAgent: string | null): Promise<string | null> {
  try {
    const payload = await getPayload({ config });
    const lead = await payload.create({
      collection: "leads",
      overrideAccess: true,
      data: {
        origine: data.origine === "Accueil" ? "accueil" : "devis",
        firstName: data.firstName,
        lastName: data.lastName || undefined,
        email: data.email,
        phone: data.phone,
        address: data.address || undefined,
        postalCode: data.postalCode || undefined,
        city: data.city || undefined,
        preferredContact: choix(data.preferredContact, ["email", "phone", "whatsapp"] as const),
        projectType: choix(data.projectType, ["neuf", "renovation", "remplacement"] as const),
        services: data.services.filter((s): s is (typeof SERVICES)[number] =>
          (SERVICES as readonly string[]).includes(s)
        ),
        description: data.description || undefined,
        budget: choix(data.budget, ["moins-2000", "2000-5000", "5000-10000", "plus-10000", "inconnu"] as const),
        echeance: choix(data.echeance, ["des-que-possible", "1-3-mois", "3-6-mois", "renseignement"] as const),
        situation: choix(data.situation, ["proprietaire", "locataire", "copropriete"] as const),
        nbOuvertures: choix(data.nbOuvertures, ["1-2", "3-5", "6-10", "plus-10"] as const),
        sourceKey: choix(data.provenance?.sourceKey, SOURCE_KEYS),
        source: data.provenance?.source,
        campagne: data.provenance?.campagne,
        motCle: data.provenance?.motCle,
        gclid: data.provenance?.gclid,
        referent: data.provenance?.referent,
        pageArrivee: data.provenance?.pageArrivee,
        userAgent: userAgent?.slice(0, 300) || undefined,
        status: "new",
        submittedAt: new Date().toISOString(),
      },
    });
    return String(lead.id);
  } catch (err) {
    console.error("[devis] Lead non enregistré dans l'admin", err);
    return null;
  }
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://ouverture-pro.fr");

// Brand colors (matching the site primary teal-blue + brown secondary)
const COLOR_PRIMARY = "#0e9cb8";
const COLOR_PRIMARY_DARK = "#0a7d94";
const COLOR_SECONDARY = "#8a6e4b";
const COLOR_FG = "#1a1a1a";
const COLOR_MUTED = "#6b7280";
const COLOR_BG_SOFT = "#f8fafc";
const COLOR_BORDER = "#e5e7eb";

export async function POST(req: Request) {
  // Lazy-fail with a clear message if env vars are missing — easier debug than a 500.
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL; // e.g. "Ouvertures Pro <devis@ouverture-pro.fr>"
  const toRaw = process.env.DEVIS_TO_EMAIL; // single email OR comma-separated list

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = validatePayload(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const data = result.data;

  // L'admin passe en premier : c'est le filet de sécurité si l'email échoue.
  const leadId = await enregistrerLead(data, req.headers.get("user-agent"));
  const lienAdmin = leadId ? `${SITE_URL}/admin/collections/leads/${leadId}` : null;

  if (!apiKey || !from || !toRaw) {
    console.error("[devis] Missing env vars", {
      hasKey: !!apiKey,
      hasFrom: !!from,
      hasTo: !!toRaw,
    });
    // Sans email, la demande n'est pas perdue si elle est dans l'admin.
    return leadId
      ? NextResponse.json({ ok: true, leadId, email: "non configuré" })
      : NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  // Support multi-recipient: "a@x.com, b@y.com" → ["a@x.com", "b@y.com"]
  const to = toRaw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const servicesLabels = data.services.map((s) => SERVICE_LABELS[s] ?? s).join(", ");
  const projectTypeLabel =
    PROJECT_TYPE_LABELS[data.projectType] ?? data.projectType ?? "";
  const lieuLabel =
    `${data.postalCode} ${data.city}`.trim() || "Non précisé";
  const contactPrefLabel = CONTACT_PREF_LABELS[data.preferredContact] ?? data.preferredContact;
  const fullName = `${data.firstName} ${data.lastName}`;

  // Qualification : on ne montre que ce que le visiteur a réellement renseigné.
  const qualification = [
    { valeur: data.budget, label: BUDGET_LABELS[data.budget] },
    { valeur: data.echeance, label: ECHEANCE_LABELS[data.echeance] },
    { valeur: data.situation, label: SITUATION_LABELS[data.situation] },
    { valeur: data.nbOuvertures, label: NB_OUVERTURES_LABELS[data.nbOuvertures] },
  ].filter((q) => Boolean(q.label));

  const provenanceLabel = data.provenance?.source ?? "Provenance inconnue";
  const detailsProvenance = [
    data.provenance?.campagne ? `Campagne : ${data.provenance.campagne}` : "",
    data.provenance?.motCle ? `Mot-clé : ${data.provenance.motCle}` : "",
    data.provenance?.gclid ? "Clic publicitaire identifié (gclid)" : "",
  ].filter(Boolean);

  const resumeSubject = [
    servicesLabels,
    NB_OUVERTURES_LABELS[data.nbOuvertures],
    BUDGET_LABELS[data.budget],
  ]
    .filter(Boolean)
    .join(" · ");

  const lieuSubject = `${data.postalCode} ${data.city}`.trim();
  const subject = `Nouvelle demande — ${fullName}${
    resumeSubject ? ` — ${resumeSubject}` : ""
  }${lieuSubject ? ` (${lieuSubject})` : ""}`;

  const chipsHtml = qualification
    .map((q) => {
      const chaude = QUALIFICATION_CHAUDE.has(q.valeur);
      const fond = chaude ? COLOR_SECONDARY : "#ffffff";
      const texteCouleur = chaude ? "#ffffff" : COLOR_MUTED;
      const bordure = chaude ? COLOR_SECONDARY : COLOR_BORDER;
      return `<span style="display: inline-block; margin: 0 6px 6px 0; padding: 5px 11px; border: 1px solid ${bordure}; border-radius: 999px; background: ${fond}; color: ${texteCouleur}; font-size: 13px; font-weight: ${
        chaude ? "700" : "500"
      };">${escapeHtml(q.label)}</span>`;
    })
    .join("");

  const blocProvenance = `
          <tr>
            <td style="padding: 16px 32px 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-radius: 10px; overflow: hidden;">
                <tr>
                  <td style="background: ${COLOR_PRIMARY_DARK}; padding: 14px 18px; text-align: center;">
                    <p style="margin: 0; color: rgba(255,255,255,0.75); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.4px;">Provenance du lead</p>
                    <p style="margin: 4px 0 0 0; color: #ffffff; font-size: 16px; font-weight: 700;">${escapeHtml(provenanceLabel)}</p>
                    ${
                      detailsProvenance.length
                        ? `<p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.8); font-size: 12px;">${detailsProvenance
                            .map(escapeHtml)
                            .join(" &nbsp;·&nbsp; ")}</p>`
                        : ""
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>${
            chipsHtml
              ? `
          <tr>
            <td style="padding: 16px 32px 0 32px;">${chipsHtml}</td>
          </tr>`
              : ""
          }`;

  const text = [
    "Nouvelle demande de devis Ouvertures Pro",
    "",
    "── Provenance ──",
    `Source      : ${provenanceLabel}`,
    ...detailsProvenance.map((d) => `              ${d}`),
    `Formulaire  : ${data.origine}`,
    ...(lienAdmin ? [`Admin       : ${lienAdmin}`] : []),
    "",
    "── Qualification ──",
    qualification.length
      ? qualification.map((q) => `• ${q.label}`).join("\n")
      : "(non renseignée)",
    "",
    "── Contact ──",
    `Nom         : ${fullName}`,
    `Email       : ${data.email}`,
    `Téléphone   : ${data.phone}`,
    `Préférence  : ${contactPrefLabel}`,
    "",
    "── Lieu d'intervention ──",
    `Adresse     : ${data.address || "(non renseignée)"}`,
    `Ville       : ${data.postalCode} ${data.city}`,
    "",
    "── Projet ──",
    `Type        : ${projectTypeLabel}`,
    `Services    : ${servicesLabels || "(aucun)"}`,
    "",
    "── Description ──",
    data.description || "(aucune description)",
  ].join("\n");

  const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLOR_BG_SOFT}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; color: ${COLOR_FG}; line-height: 1.5;">
  <!-- Preheader (hidden text shown in inbox preview) -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    Demande de ${escapeHtml(fullName)}${lieuSubject ? ` (${escapeHtml(lieuSubject)})` : ""} — ${escapeHtml(provenanceLabel)}.
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: ${COLOR_BG_SOFT};">
    <tr>
      <td align="center" style="padding: 32px 16px;">

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04);">

          <!-- Brand header -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; text-align: center; border-bottom: 4px solid ${COLOR_PRIMARY}; background: #ffffff;">
              <img src="${LOGO_URL}" alt="Ouvertures Pro" width="200" style="max-width: 200px; height: auto; display: inline-block; border: 0;">
              <!--[if !mso]><!-->
              <div style="font-size: 0; line-height: 0; mso-line-height-rule: exactly;">&nbsp;</div>
              <!--<![endif]-->
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding: 32px 32px 8px 32px;">
              <p style="margin: 0; color: ${COLOR_PRIMARY}; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">📨 Nouvelle demande</p>
              <h1 style="margin: 6px 0 4px 0; font-size: 24px; font-weight: 700; color: ${COLOR_FG}; line-height: 1.2;">
                Demande de devis
              </h1>
              <p style="margin: 0; color: ${COLOR_MUTED}; font-size: 14px;">
                Reçue via <a href="${SITE_URL}" style="color: ${COLOR_PRIMARY}; text-decoration: none;">ouverture-pro.fr</a>
              </p>
            </td>
          </tr>

${blocProvenance}

          <!-- Contact block -->
          <tr>
            <td style="padding: 16px 32px 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid ${COLOR_BORDER}; border-radius: 10px; overflow: hidden;">
                <tr>
                  <td style="background: ${COLOR_PRIMARY}; padding: 10px 16px;">
                    <p style="margin: 0; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px;">Contact</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 18px;">
                    <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: 700; color: ${COLOR_FG};">${escapeHtml(fullName)}</p>
                    <p style="margin: 0 0 6px 0; font-size: 14px;">
                      <span style="color: ${COLOR_MUTED};">Email :</span>
                      <a href="mailto:${escapeHtml(data.email)}" style="color: ${COLOR_PRIMARY}; text-decoration: none; font-weight: 500;">${escapeHtml(data.email)}</a>
                    </p>
                    <p style="margin: 0 0 6px 0; font-size: 14px;">
                      <span style="color: ${COLOR_MUTED};">Téléphone :</span>
                      <a href="tel:${escapeHtml(data.phone)}" style="color: ${COLOR_PRIMARY}; text-decoration: none; font-weight: 500;">${escapeHtml(data.phone)}</a>
                    </p>
                    <p style="margin: 8px 0 0 0; font-size: 13px; color: ${COLOR_MUTED};">
                      Préfère être contacté·e par <strong style="color: ${COLOR_FG};">${escapeHtml(contactPrefLabel.toLowerCase())}</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Location block -->
          <tr>
            <td style="padding: 16px 32px 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid ${COLOR_BORDER}; border-radius: 10px; overflow: hidden;">
                <tr>
                  <td style="background: ${COLOR_SECONDARY}; padding: 10px 16px;">
                    <p style="margin: 0; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px;">Lieu d'intervention</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 18px;">
                    ${
                      data.address
                        ? `<p style="margin: 0 0 4px 0; font-size: 15px; color: ${COLOR_FG};">${escapeHtml(data.address)}</p>`
                        : ""
                    }
                    <p style="margin: 0; font-size: 15px; color: ${COLOR_FG}; font-weight: 600;">
                      ${escapeHtml(lieuLabel)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Project block -->
          <tr>
            <td style="padding: 16px 32px 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid ${COLOR_BORDER}; border-radius: 10px; overflow: hidden;">
                <tr>
                  <td style="background: ${COLOR_PRIMARY_DARK}; padding: 10px 16px;">
                    <p style="margin: 0; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px;">Projet</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 18px;">
                    <p style="margin: 0 0 8px 0; font-size: 14px;">
                      <span style="color: ${COLOR_MUTED};">Type :</span>
                      <strong style="color: ${COLOR_FG};">${escapeHtml(projectTypeLabel) || "Non précisé"}</strong>
                    </p>
                    <p style="margin: 0; font-size: 14px;">
                      <span style="color: ${COLOR_MUTED};">Services :</span>
                      <strong style="color: ${COLOR_FG};">${escapeHtml(servicesLabels) || "(aucun)"}</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Description -->
          ${
            data.description
              ? `
          <tr>
            <td style="padding: 16px 32px 0 32px;">
              <p style="margin: 0 0 8px 0; color: ${COLOR_MUTED}; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px;">
                Description du projet
              </p>
              <div style="background: ${COLOR_BG_SOFT}; padding: 16px 18px; border-left: 4px solid ${COLOR_PRIMARY}; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: ${COLOR_FG};">${nl2br(data.description)}</p>
              </div>
            </td>
          </tr>
          `
              : ""
          }

          <!-- CTA: 2 buttons (email + call) side by side -->
          <tr>
            <td style="padding: 28px 32px 24px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
                <tr>
                  <td style="padding: 0 6px 12px 6px;" align="center">
                    <a href="mailto:${escapeHtml(data.email)}?subject=Re%20%3A%20votre%20demande%20de%20devis%20-%20Ouvertures%20Pro" style="display: inline-block; background: ${COLOR_PRIMARY}; color: #ffffff; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; white-space: nowrap;">
                      ✉️ Répondre par email
                    </a>
                  </td>
                  <td style="padding: 0 6px 12px 6px;" align="center">
                    <a href="tel:${escapeHtml(data.phone)}" style="display: inline-block; background: ${COLOR_FG}; color: #ffffff; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; white-space: nowrap;">
                      📞 Appeler ${escapeHtml(data.firstName)}
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: ${COLOR_MUTED}; text-align: center;">
                ${escapeHtml(data.phone)}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: ${COLOR_FG}; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 6px 0; color: #ffffff; font-size: 14px; font-weight: 700; letter-spacing: 0.5px;">
                Ouvertures Pro
              </p>
              <p style="margin: 0 0 10px 0; color: #b0b0b0; font-size: 12px;">
                Fenêtres, portes, volets &amp; portails — Île-de-France
              </p>
              <p style="margin: 0; color: #b0b0b0; font-size: 12px; line-height: 1.6;">
                22 bis rue des Malines, 91090 Lisses<br>
                <a href="tel:+33160863754" style="color: #ffffff; text-decoration: none;">01 60 86 37 54</a> ·
                <a href="https://wa.me/33771742083" style="color: #ffffff; text-decoration: none;">WhatsApp 07 71 74 20 83</a>
              </p>
            </td>
          </tr>

        </table>

        <p style="margin: 16px 0 0 0; font-size: 11px; color: ${COLOR_MUTED}; text-align: center;">
          Email généré automatiquement — formulaire : ${escapeHtml(data.origine)}${
            lienAdmin
              ? `<br><a href="${escapeHtml(lienAdmin)}" style="color: ${COLOR_PRIMARY}; text-decoration: none; font-weight: 600;">Ouvrir ce lead dans l'admin →</a>`
              : ""
          }
        </p>

      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const resend = new Resend(apiKey);
    const { data: sent, error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("[devis] Resend error", error);
      return leadId
        ? NextResponse.json({ ok: true, leadId, email: "échec" })
        : NextResponse.json({ error: "Failed to send email" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: sent?.id, leadId });
  } catch (err) {
    console.error("[devis] Unexpected error", err);
    return leadId
      ? NextResponse.json({ ok: true, leadId, email: "échec" })
      : NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
