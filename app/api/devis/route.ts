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
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <h1 style="font-size: 20px; margin: 0 0 4px 0;">Nouvelle demande de devis</h1>
  <p style="color: #666; margin: 0 0 24px 0; font-size: 14px;">Reçue via ouverture-pro.fr</p>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr><td colspan="2" style="background: #f5f5f5; padding: 10px 12px; font-weight: 600;">Contact</td></tr>
    <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; width: 140px; color: #666;">Nom</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>${escapeHtml(fullName)}</strong></td></tr>
    <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #666;">Email</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
    <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #666;">Téléphone</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></td></tr>
    <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #666;">Contact préféré</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(contactPrefLabel)}</td></tr>
  </table>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr><td colspan="2" style="background: #f5f5f5; padding: 10px 12px; font-weight: 600;">Lieu d'intervention</td></tr>
    <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; width: 140px; color: #666;">Adresse</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(data.address) || "(non renseignée)"}</td></tr>
    <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #666;">Ville</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(data.postalCode)} ${escapeHtml(data.city)}</td></tr>
  </table>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr><td colspan="2" style="background: #f5f5f5; padding: 10px 12px; font-weight: 600;">Projet</td></tr>
    <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; width: 140px; color: #666;">Type</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(projectTypeLabel)}</td></tr>
    <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #666;">Services</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(servicesLabels) || "(aucun)"}</td></tr>
  </table>

  <div style="background: #f5f5f5; padding: 12px 16px; border-radius: 6px;">
    <p style="font-weight: 600; margin: 0 0 8px 0;">Description</p>
    <p style="margin: 0; white-space: pre-wrap; line-height: 1.5;">${nl2br(data.description) || "<em>(aucune description)</em>"}</p>
  </div>

  <p style="margin-top: 32px; font-size: 12px; color: #999;">Cet email a été généré automatiquement depuis le formulaire de devis du site Ouvertures Pro.</p>
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
