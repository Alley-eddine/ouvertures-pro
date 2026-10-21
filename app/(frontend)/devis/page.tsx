"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { provenancePourEnvoi } from "@/lib/attribution";
import { signalerConversion } from "@/lib/conversions";
import { CONNAISSANCES, GROUPES_SERVICES, MATERIAUX, MOTIVATIONS } from "@/lib/catalogue-projet";
import { cn } from "@/lib/utils";

const projectTypes = [
  { id: "neuf", label: "Construction neuve" },
  { id: "renovation", label: "Rénovation" },
  { id: "remplacement", label: "Remplacement à l'identique" },
];

// Qualification : un seul tap par question, aucune saisie, tout est facultatif.
// Ces réponses permettent de rappeler en priorité les projets les plus avancés.
const budgets = [
  { id: "moins-2000", label: "Moins de 2 000 €" },
  { id: "2000-5000", label: "2 000 à 5 000 €" },
  { id: "5000-10000", label: "5 000 à 10 000 €" },
  { id: "plus-10000", label: "Plus de 10 000 €" },
  { id: "inconnu", label: "Je ne sais pas encore" },
];

const echeances = [
  { id: "des-que-possible", label: "Dès que possible" },
  { id: "1-3-mois", label: "Sous 1 à 3 mois" },
  { id: "3-6-mois", label: "Sous 3 à 6 mois" },
  { id: "renseignement", label: "Je me renseigne" },
];

const situations = [
  { id: "proprietaire", label: "Propriétaire" },
  { id: "locataire", label: "Locataire" },
  { id: "copropriete", label: "Copropriété" },
];

const nbOuverturesOptions = [
  { id: "1-2", label: "1 à 2" },
  { id: "3-5", label: "3 à 5" },
  { id: "6-10", label: "6 à 10" },
  { id: "plus-10", label: "Plus de 10" },
];

const classePastille = (actif: boolean) =>
  cn(
    "px-4 py-2 rounded-lg border text-sm transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    actif
      ? "border-primary bg-primary/10 text-primary font-medium"
      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
  );

/** Variante à choix multiples : chaque tap ajoute ou retire l'option. */
function ChoixMultiples({
  id,
  titre,
  aide,
  options,
  valeurs,
  onChange,
}: {
  id: string;
  titre: string;
  aide?: string;
  options: readonly { value: string; label: string }[];
  valeurs: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div>
      <p id={`${id}-label`} className="font-medium text-foreground mb-1">
        {titre}
      </p>
      {aide && <p className="text-sm text-muted-foreground mb-3">{aide}</p>}
      <div role="group" aria-labelledby={`${id}-label`} className={cn("flex flex-wrap gap-2", !aide && "mt-2")}>
        {options.map((o) => {
          const actif = valeurs.includes(o.value);
          return (
            <button
              key={o.value}
              id={`${id}-${o.value}`}
              type="button"
              aria-pressed={actif}
              onClick={() =>
                onChange(actif ? valeurs.filter((v) => v !== o.value) : [...valeurs, o.value])
              }
              className={classePastille(actif)}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Groupe de choix en pastilles : un tap suffit, et retaper désélectionne. */
function ChoixPastilles({
  id,
  titre,
  options,
  valeur,
  onChange,
}: {
  id: string;
  titre: string;
  options: { id: string; label: string }[];
  valeur: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p id={`${id}-label`} className="font-medium text-foreground mb-3">
        {titre}
      </p>
      <div role="group" aria-labelledby={`${id}-label`} className="flex flex-wrap gap-2">
        {options.map((o) => {
          const actif = valeur === o.id;
          return (
            <button
              key={o.id}
              id={`${id}-${o.id}`}
              type="button"
              aria-pressed={actif}
              onClick={() => onChange(actif ? "" : o.id)}
              className={classePastille(actif)}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DevisPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    projectType: "",
    services: [] as string[],
    description: "",
    preferredContact: "email",
    budget: "",
    echeance: "",
    situation: "",
    nbOuvertures: "",
    motivations: [] as string[],
    materiaux: [] as string[],
    sourceDeclaree: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const connaissances = CONNAISSANCES.map((c) => ({ id: c.value, label: c.label }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          origine: "Page devis",
          provenance: provenancePourEnvoi(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de l'envoi");
      }
      signalerConversion("devis");
      setIsSubmitted(true);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'envoi. Réessayez ou contactez-nous directement."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Demande envoyée avec succès !
          </h1>
          <p className="text-muted-foreground mb-8">
            Merci pour votre demande de devis. Notre équipe vous contactera dans les
            24-48 heures pour discuter de votre projet.
          </p>
          <Button asChild>
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
        </div>
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-foreground py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/images/logofinal.png"
              alt="Ouvertures Pro"
              width={140}
              height={50}
              priority
              style={{ height: "auto" }}
              className="brightness-0 invert"
            />
          </Link>
          <Button variant="ghost" asChild className="text-background hover:text-background/80">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Link>
          </Button>
        </div>
      </header>

      {/* Form */}
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Demande de Devis Gratuit
            </h1>
            <p className="text-muted-foreground">
              Remplissez le formulaire ci-dessous et nous vous contacterons rapidement
              pour établir un devis personnalisé.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card p-8 rounded-lg shadow-sm space-y-8">
            {/* Personal Info */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Vos coordonnées
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Lieu d&apos;intervention
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal *</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) =>
                        setFormData({ ...formData, postalCode: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Project Type */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Type de projet *
              </h2>
              <RadioGroup
                value={formData.projectType}
                onValueChange={(value) =>
                  setFormData({ ...formData, projectType: value })
                }
                className="grid md:grid-cols-3 gap-4"
              >
                {projectTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.id} id={type.id} />
                    <Label htmlFor={type.id} className="cursor-pointer">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">
                Services souhaités *
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Plusieurs choix possibles.
              </p>
              <div className="space-y-5">
                {GROUPES_SERVICES.map((groupe) => (
                  <ChoixMultiples
                    key={groupe.titre}
                    id={`services-${groupe.titre
                      .normalize("NFD")
                      .replace(/[̀-ͯ]/g, "")
                      .toLowerCase()
                      .replace(/\W+/g, "-")}`}
                    titre={groupe.titre}
                    options={groupe.options}
                    valeurs={formData.services}
                    onChange={(v) => setFormData({ ...formData, services: v })}
                  />
                ))}
              </div>
            </div>

            {/* Qualification — facultatif, un tap par question */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">
                Pour préparer votre devis
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Facultatif, mais ces quelques réponses nous permettent de vous
                rappeler avec une estimation déjà sérieuse plutôt qu&apos;avec
                des questions.
              </p>
              <div className="space-y-6">
                <ChoixMultiples
                  id="motivations"
                  titre="Pourquoi souhaitez-vous faire ces travaux ?"
                  aide="Plusieurs choix possibles."
                  options={MOTIVATIONS}
                  valeurs={formData.motivations}
                  onChange={(v) => setFormData({ ...formData, motivations: v })}
                />
                <ChoixMultiples
                  id="materiaux"
                  titre="Quel matériau vous intéresse ?"
                  aide="Plusieurs choix possibles."
                  options={MATERIAUX}
                  valeurs={formData.materiaux}
                  onChange={(v) => setFormData({ ...formData, materiaux: v })}
                />
                <ChoixPastilles
                  id="budget"
                  titre="Votre budget approximatif"
                  options={budgets}
                  valeur={formData.budget}
                  onChange={(v) => setFormData({ ...formData, budget: v })}
                />
                <ChoixPastilles
                  id="echeance"
                  titre="Quand souhaitez-vous faire les travaux ?"
                  options={echeances}
                  valeur={formData.echeance}
                  onChange={(v) => setFormData({ ...formData, echeance: v })}
                />
                <ChoixPastilles
                  id="situation"
                  titre="Vous êtes"
                  options={situations}
                  valeur={formData.situation}
                  onChange={(v) => setFormData({ ...formData, situation: v })}
                />
                <ChoixPastilles
                  id="nb-ouvertures"
                  titre="Nombre d'ouvertures concernées"
                  options={nbOuverturesOptions}
                  valeur={formData.nbOuvertures}
                  onChange={(v) => setFormData({ ...formData, nbOuvertures: v })}
                />
                <ChoixPastilles
                  id="connaissance"
                  titre="Comment nous avez-vous connus ?"
                  options={connaissances}
                  valeur={formData.sourceDeclaree}
                  onChange={(v) => setFormData({ ...formData, sourceDeclaree: v })}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description de votre projet
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Décrivez votre projet : dimensions, coloris, contraintes d'accès, etc."
                rows={5}
              />
            </div>

            {/* Preferred Contact */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Comment souhaitez-vous être contacté ?
              </h2>
              <RadioGroup
                value={formData.preferredContact}
                onValueChange={(value) =>
                  setFormData({ ...formData, preferredContact: value })
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="contact-email" />
                  <Label htmlFor="contact-email" className="cursor-pointer">
                    Par email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="contact-phone" />
                  <Label htmlFor="contact-phone" className="cursor-pointer">
                    Par téléphone
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="contact-whatsapp" />
                  <Label htmlFor="contact-whatsapp" className="cursor-pointer">
                    Par WhatsApp
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {errorMsg && (
              <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800">
                <p className="font-medium mb-1">L&apos;envoi a échoué</p>
                <p>{errorMsg}</p>
                <p className="mt-2 text-red-700">
                  Vous pouvez aussi nous joindre par téléphone au{" "}
                  <a href="tel:+33160863754" className="underline font-medium">
                    01 60 86 37 54
                  </a>{" "}
                  ou par WhatsApp au{" "}
                  <a
                    href="https://wa.me/33771742083"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    07 71 74 20 83
                  </a>
                  .
                </p>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande de devis"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              En soumettant ce formulaire, vous acceptez d&apos;être contacté par nos
              équipes. Vos données sont traitées conformément à notre politique de
              confidentialité.
            </p>
          </form>
        </div>
      </main>

      <WhatsAppButton />
    </div>
  );
}
