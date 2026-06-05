import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalRow, LegalSection } from "@/components/legal-layout";

// ⚠️ INFOS À COMPLÉTER depuis le PDF d'export :
//   - SIRET / SIREN
//   - Numéro RCS et ville
//   - Capital social
//   - Forme juridique exacte (SARL, EURL, etc.)
//   - Numéro TVA intracommunautaire
// Cherche-les dans Export_Portail_Data_OUVERTURES_PRO_*.pdf
const LEGAL_INFO = {
  raisonSociale: "OUVERTURES PRO",
  formeJuridique: "SARL", // À VÉRIFIER
  capital: "[À COMPLÉTER : montant du capital social] €",
  siegeSocial: "22 bis rue des Malines, 91090 Lisses",
  siret: "[À COMPLÉTER : 14 chiffres du SIRET]",
  rcs: "[À COMPLÉTER : numéro RCS] — RCS Évry", // À vérifier la ville du greffe
  tva: "[À COMPLÉTER : FR + 11 chiffres]",
  directeurPublication: "Cédric Tamoud",
  email: "contact@ouverture-pro.fr",
  telephone: "01 60 86 37 54",
};

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Informations légales relatives au site ouverture-pro.fr et à la société Ouvertures Pro.",
  robots: { index: true, follow: false },
};

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales" updatedAt="5 juin 2026">
      <p className="text-muted-foreground">
        Conformément aux dispositions des articles 6-III et 19 de la Loi
        n°2004-575 du 21 juin 2004 pour la Confiance dans l&apos;économie
        numérique, dite L.C.E.N., il est porté à la connaissance des
        utilisateurs et visiteurs du site les présentes mentions légales.
      </p>

      <LegalSection title="1. Éditeur du site">
        <LegalRow label="Raison sociale" value={LEGAL_INFO.raisonSociale} />
        <LegalRow label="Forme juridique" value={LEGAL_INFO.formeJuridique} />
        <LegalRow label="Capital social" value={LEGAL_INFO.capital} />
        <LegalRow label="Siège social" value={LEGAL_INFO.siegeSocial} />
        <LegalRow label="SIRET" value={LEGAL_INFO.siret} />
        <LegalRow label="RCS" value={LEGAL_INFO.rcs} />
        <LegalRow label="TVA intracommunautaire" value={LEGAL_INFO.tva} />
        <LegalRow
          label="Directeur de la publication"
          value={LEGAL_INFO.directeurPublication}
        />
        <LegalRow
          label="Email"
          value={
            <a
              href={`mailto:${LEGAL_INFO.email}`}
              className="text-primary hover:underline"
            >
              {LEGAL_INFO.email}
            </a>
          }
        />
        <LegalRow
          label="Téléphone"
          value={
            <a
              href={`tel:${LEGAL_INFO.telephone.replace(/\s/g, "")}`}
              className="text-primary hover:underline"
            >
              {LEGAL_INFO.telephone}
            </a>
          }
        />
      </LegalSection>

      <LegalSection title="2. Hébergeur du site">
        <p>Le site ouverture-pro.fr est hébergé par :</p>
        <LegalRow label="Société" value="Vercel Inc." />
        <LegalRow
          label="Adresse"
          value="340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis"
        />
        <LegalRow
          label="Site web"
          value={
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              vercel.com
            </a>
          }
        />
      </LegalSection>

      <LegalSection title="3. Propriété intellectuelle">
        <p>
          L&apos;ensemble des éléments du site (textes, photographies,
          illustrations, logos, structure, charte graphique) est la propriété
          exclusive d&apos;{LEGAL_INFO.raisonSociale} ou de ses partenaires, et
          est protégé par les lois françaises et internationales relatives à la
          propriété intellectuelle.
        </p>
        <p>
          Toute reproduction, représentation, modification, publication,
          adaptation ou exploitation de tout ou partie des éléments du site, par
          quelque procédé que ce soit et sur quelque support que ce soit, sans
          autorisation préalable écrite de l&apos;éditeur, est strictement
          interdite et constitue une contrefaçon sanctionnée par les articles
          L.335-2 et suivants du Code de la propriété intellectuelle.
        </p>
      </LegalSection>

      <LegalSection title="4. Données personnelles et cookies">
        <p>
          Les informations recueillies via le formulaire de demande de devis
          sont traitées par {LEGAL_INFO.raisonSociale} aux seules fins de
          réponse aux demandes des utilisateurs et de gestion de la relation
          commerciale.
        </p>
        <p>
          Les modalités de collecte, de traitement, de conservation et les
          droits des personnes concernées sont détaillés dans notre{" "}
          <Link
            href="/politique-confidentialite"
            className="text-primary hover:underline font-medium"
          >
            politique de confidentialité
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="5. Liens hypertextes">
        <p>
          Le site peut contenir des liens hypertextes vers d&apos;autres sites
          internet. {LEGAL_INFO.raisonSociale} n&apos;exerce aucun contrôle sur
          ces sites et décline toute responsabilité quant à leur contenu ou aux
          pratiques de confidentialité qui leur sont propres.
        </p>
      </LegalSection>

      <LegalSection title="6. Crédits">
        <p>
          Photographies : équipe Ouvertures Pro — chantiers réalisés en
          Île-de-France.
        </p>
        <p>
          Conception et développement du site : réalisé sur mesure pour{" "}
          {LEGAL_INFO.raisonSociale}.
        </p>
      </LegalSection>

      <LegalSection title="7. Loi applicable et juridiction compétente">
        <p>
          Les présentes mentions légales sont régies par le droit français. En
          cas de litige relatif à leur interprétation ou à leur exécution, et à
          défaut d&apos;accord amiable, les tribunaux français seront seuls
          compétents.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
