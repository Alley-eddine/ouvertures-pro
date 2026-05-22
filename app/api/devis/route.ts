import { NextResponse } from "next/server";
import { Resend } from "resend";

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
  const required: Array<keyof DevisPayload> = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "city",
    "postalCode",
    "projectType",
  ];
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
      firstName: (b.firstName as string).trim(),
      lastName: (b.lastName as string).trim(),
      email: emailStr.trim(),
      phone: (b.phone as string).trim(),
      address: typeof b.address === "string" ? b.address.trim() : "",
      city: (b.city as string).trim(),
      postalCode: (b.postalCode as string).trim(),
      projectType: (b.projectType as string).trim(),
      services: (b.services as unknown[]).filter((s): s is string => typeof s === "string"),
      description: typeof b.description === "string" ? b.description.trim() : "",
      preferredContact:
        typeof b.preferredContact === "string" ? b.preferredContact.trim() : "email",
    },
  };
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
  const to = process.env.DEVIS_TO_EMAIL; // e.g. "contact@ouverture-pro.fr"

  if (!apiKey || !from || !to) {
    console.error("[devis] Missing env vars", {
      hasKey: !!apiKey,
      hasFrom: !!from,
      hasTo: !!to,
    });
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 }
    );
  }

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

  const servicesLabels = data.services.map((s) => SERVICE_LABELS[s] ?? s).join(", ");
  const projectTypeLabel = PROJECT_TYPE_LABELS[data.projectType] ?? data.projectType;
  const contactPrefLabel = CONTACT_PREF_LABELS[data.preferredContact] ?? data.preferredContact;
  const fullName = `${data.firstName} ${data.lastName}`;

  const subject = `Nouvelle demande de devis — ${fullName} (${data.postalCode} ${data.city})`;

  const text = [
    "Nouvelle demande de devis Ouvertures Pro",
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
    Demande de ${escapeHtml(fullName)} (${escapeHtml(data.postalCode)} ${escapeHtml(data.city)}) — ${escapeHtml(servicesLabels) || "services divers"}.
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: ${COLOR_BG_SOFT};">
    <tr>
      <td align="center" style="padding: 32px 16px;">

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04);">

          <!-- Brand header -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; text-align: center; border-bottom: 4px solid ${COLOR_PRIMARY}; background: #ffffff;">
              <img src="${SITE_URL}/images/logofinal.png" alt="Ouvertures Pro" width="200" style="max-width: 200px; height: auto; display: inline-block;">
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
                      ${escapeHtml(data.postalCode)} ${escapeHtml(data.city)}
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
                      <strong style="color: ${COLOR_FG};">${escapeHtml(projectTypeLabel)}</strong>
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

          <!-- CTA -->
          <tr>
            <td style="padding: 28px 32px 24px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapeHtml(data.email)}?subject=Re%20%3A%20votre%20demande%20de%20devis%20-%20Ouvertures%20Pro" style="display: inline-block; background: ${COLOR_PRIMARY}; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
                      ✉️ Répondre à ${escapeHtml(data.firstName)}
                    </a>
                    <p style="margin: 12px 0 0 0; font-size: 12px; color: ${COLOR_MUTED};">
                      ou appelez le <a href="tel:${escapeHtml(data.phone)}" style="color: ${COLOR_PRIMARY}; text-decoration: none; font-weight: 500;">${escapeHtml(data.phone)}</a>
                    </p>
                  </td>
                </tr>
              </table>
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
          Email généré automatiquement depuis le formulaire devis du site
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
      to: [to],
      replyTo: data.email,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("[devis] Resend error", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: sent?.id });
  } catch (err) {
    console.error("[devis] Unexpected error", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
