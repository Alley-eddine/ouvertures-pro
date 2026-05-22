"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp-button";

const services = [
  { id: "fenetres", label: "Fenêtres" },
  { id: "portes", label: "Portes" },
  { id: "volets", label: "Volets" },
  { id: "reparation", label: "Réparation" },
];

const projectTypes = [
  { id: "neuf", label: "Construction neuve" },
  { id: "renovation", label: "Rénovation" },
  { id: "remplacement", label: "Remplacement à l'identique" },
];

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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        services: [...formData.services, serviceId],
      });
    } else {
      setFormData({
        ...formData,
        services: formData.services.filter((s) => s !== serviceId),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de l'envoi");
      }
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
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Services souhaités *
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={service.id}
                      checked={formData.services.includes(service.id)}
                      onCheckedChange={(checked) =>
                        handleServiceChange(service.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={service.id} className="cursor-pointer">
                      {service.label}
                    </Label>
                  </div>
                ))}
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
                placeholder="Décrivez votre projet : nombre de fenêtres, dimensions, matériaux souhaités, etc."
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
