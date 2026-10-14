import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, LegalRow, LegalSection } from "@/components/legal-layout";

const COMPANY = {
  name: "OUVERTURES PRO",
  address: "22 bis rue des Malines, 91090 Lisses",
  email: "contact@ouverture-pro.fr",
  phone: "01 60 86 37 54",
  contact: "Cédric Tamoud",
};

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité et traitement des données personnelles d'Ouvertures Pro, conformément au RGPD.",
  robots: { index: true, follow: false },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité" updatedAt="5 juin 2026">
      <p className="text-muted-foreground">
        La présente politique de confidentialité décrit comment{" "}
        {COMPANY.name} collecte, utilise, conserve et protège vos données
        personnelles, conformément au Règlement Général sur la Protection des
        Données (RGPD — Règlement UE 2016/679) et à la loi Informatique et
        Libertés.
      </p>

      <LegalSection title="1. Responsable du traitement">
        <p>
          Le responsable du traitement des données collectées sur le site
          ouverture-pro.fr est :
        </p>
        <LegalRow label="Société" value={COMPANY.name} />
        <LegalRow label="Adresse" value={COMPANY.address} />
        <LegalRow
          label="Email"
          value={
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-primary hover:underline"
            >
              {COMPANY.email}
            </a>
          }
        />
        <LegalRow label="Contact" value={COMPANY.contact} />
      </LegalSection>

      <LegalSection title="2. Données collectées">
        <p>
          Nous collectons uniquement les données strictement nécessaires au
          traitement de votre demande, via le formulaire de devis :
        </p>
        <ul className="list-disc list-outside ml-6 space-y-1">
          <li>Prénom et nom</li>
          <li>Adresse email</li>
          <li>Numéro de téléphone</li>
          <li>Adresse postale du chantier (rue, code postal, ville)</li>
          <li>Type de projet (construction neuve, rénovation, remplacement)</li>
          <li>Services concernés (fenêtres, portes, volets, etc.)</li>
          <li>Description libre du projet</li>
          <li>Mode de contact préféré (email, téléphone, WhatsApp)</li>
        </ul>
        <p>
          Aucune donnée sensible au sens du RGPD (origine, opinions politiques,
          religion, santé, etc.) n&apos;est collectée ni traitée.
        </p>
      </LegalSection>

      <LegalSection title="3. Finalités du traitement">
        <p>Vos données sont utilisées exclusivement pour :</p>
        <ul className="list-disc list-outside ml-6 space-y-1">
          <li>
            Répondre à votre demande de devis et établir une étude personnalisée
          </li>
          <li>Vous recontacter par le mode que vous avez choisi</li>
          <li>
            Gérer la relation commerciale en cas de réalisation des travaux
          </li>
          <li>Respecter nos obligations légales et comptables</li>
        </ul>
        <p>
          Vos données ne sont jamais utilisées à des fins de prospection
          commerciale tierce, ni revendues à des tiers.
        </p>
      </LegalSection>

      <LegalSection title="4. Base légale du traitement">
        <p>
          Le traitement de vos données repose sur votre <strong>consentement</strong>{" "}
          (article 6.1.a du RGPD), donné par la soumission volontaire du
          formulaire de devis, et sur l&apos;<strong>exécution de mesures
          précontractuelles</strong> prises à votre demande (article 6.1.b du RGPD).
        </p>
      </LegalSection>

      <LegalSection title="5. Destinataires des données">
        <p>
          Vos données sont uniquement accessibles à l&apos;équipe interne
          d&apos;{COMPANY.name} en charge du suivi des devis et chantiers.
        </p>
        <p>
          Elles peuvent être transmises à nos sous-traitants techniques
          strictement nécessaires au fonctionnement du site, à savoir :
        </p>
        <ul className="list-disc list-outside ml-6 space-y-2">
          <li>
            <strong>Vercel Inc.</strong> — hébergement du site et des
            fonctions serveur (États-Unis, cadre Data Privacy Framework){" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              voir leur politique
            </a>
          </li>
          <li>
            <strong>Resend</strong> — service d&apos;envoi des emails de
            notification (États-Unis, cadre Data Privacy Framework){" "}
            <a
              href="https://resend.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              voir leur politique
            </a>
          </li>
        </ul>
        <p>
          Ces sous-traitants sont contractuellement tenus à un niveau de
          protection des données équivalent à celui exigé par le RGPD.
        </p>
      </LegalSection>

      <LegalSection title="6. Durée de conservation">
        <p>Vos données sont conservées pendant les durées suivantes :</p>
        <ul className="list-disc list-outside ml-6 space-y-1">
          <li>
            <strong>3 ans</strong> à compter du dernier contact, si votre
            demande de devis ne donne pas suite à un chantier
          </li>
          <li>
            <strong>10 ans</strong> à compter de la fin du chantier, pour les
            clients ayant fait réaliser des travaux (obligation comptable et
            garantie décennale)
          </li>
          <li>
            Les emails de notification sont automatiquement archivés selon la
            politique du fournisseur de messagerie
          </li>
        </ul>
        <p>
          Au-delà de ces durées, vos données sont anonymisées ou supprimées
          définitivement.
        </p>
      </LegalSection>

      <LegalSection title="7. Vos droits">
        <p>
          Conformément aux articles 15 à 22 du RGPD, vous disposez sur vos
          données des droits suivants :
        </p>
        <ul className="list-disc list-outside ml-6 space-y-1">
          <li>
            <strong>Droit d&apos;accès</strong> — connaître les données que nous
            détenons sur vous
          </li>
          <li>
            <strong>Droit de rectification</strong> — corriger des données
            inexactes
          </li>
          <li>
            <strong>Droit à l&apos;effacement</strong> (« droit à l&apos;oubli »)
            — demander la suppression de vos données
          </li>
          <li>
            <strong>Droit à la limitation</strong> du traitement
          </li>
          <li>
            <strong>Droit à la portabilité</strong> — récupérer vos données
            dans un format structuré
          </li>
          <li>
            <strong>Droit d&apos;opposition</strong> au traitement
          </li>
          <li>
            <strong>Droit de retirer votre consentement</strong> à tout moment
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Exercer vos droits">
        <p>
          Pour exercer l&apos;un de ces droits, contactez-nous par l&apos;un des
          moyens suivants :
        </p>
        <ul className="list-disc list-outside ml-6 space-y-1">
          <li>
            Par email :{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-primary hover:underline font-medium"
            >
              {COMPANY.email}
            </a>
          </li>
          <li>
            Par courrier postal : {COMPANY.name}, {COMPANY.address}
          </li>
        </ul>
        <p>
          Une réponse vous sera apportée dans un délai d&apos;un mois maximum
          à compter de la réception de votre demande. Une pièce
          d&apos;identité pourra vous être demandée pour vérifier votre
          identité.
        </p>
      </LegalSection>

      <LegalSection title="9. Recours auprès de la CNIL">
        <p>
          Si vous estimez, après nous avoir contactés, que vos droits ne sont
          pas respectés, vous pouvez introduire une réclamation auprès de la
          Commission Nationale de l&apos;Informatique et des Libertés (CNIL) :
        </p>
        <ul className="list-disc list-outside ml-6 space-y-1">
          <li>Adresse : 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07</li>
          <li>
            Site :{" "}
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              cnil.fr
            </a>
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="10. Sécurité des données">
        <p>
          Nous mettons en œuvre les mesures techniques et organisationnelles
          appropriées pour protéger vos données contre la perte,
          l&apos;altération, la diffusion ou l&apos;accès non autorisé. Les
          échanges entre votre navigateur et notre site sont chiffrés via le
          protocole HTTPS (TLS).
        </p>
      </LegalSection>

      <LegalSection title="11. Cookies">
        <p>
          Le site ouverture-pro.fr utilise un nombre minimal de cookies,
          uniquement à des fins de mesure d&apos;audience anonymisée via{" "}
          <strong>Vercel Analytics</strong>. Ces cookies ne permettent
          ni de vous identifier personnellement, ni de vous traquer entre
          sites.
        </p>
        <p>
          Aucun cookie publicitaire ou de profilage n&apos;est utilisé. Aucune
          demande de consentement n&apos;est requise pour ces cookies au sens
          de la délibération CNIL n°2020-091.
        </p>
      </LegalSection>

      <LegalSection title="12. Modifications">
        <p>
          La présente politique peut être amenée à évoluer. Toute modification
          sera publiée sur cette page avec la date de mise à jour. Nous vous
          invitons à la consulter régulièrement.
        </p>
        <p>
          Pour toute question relative à cette politique ou au traitement de
          vos données, contactez-nous à{" "}
          <a
            href={`mailto:${COMPANY.email}`}
            className="text-primary hover:underline font-medium"
          >
            {COMPANY.email}
          </a>
          .
        </p>
      </LegalSection>

      <div className="pt-6">
        <p className="text-sm text-muted-foreground">
          Voir aussi nos{" "}
          <Link
            href="/mentions-legales"
            className="text-primary hover:underline font-medium"
          >
            mentions légales
          </Link>
          .
        </p>
      </div>
    </LegalLayout>
  );
}
