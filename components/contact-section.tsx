"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { provenancePourEnvoi } from "@/lib/attribution";
import { signalerConversion } from "@/lib/conversions";
import { GROUPES_SERVICES } from "@/lib/catalogue-projet";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    // Le nom est saisi d'un bloc ici : on sépare prénom et nom pour l'email.
    const morceaux = formData.name.trim().split(/\s+/);
    const firstName = morceaux[0] ?? "";
    const lastName = morceaux.slice(1).join(" ");

    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email: formData.email,
          phone: formData.phone,
          description: formData.message,
          services: formData.service ? [formData.service] : [],
          origine: "Accueil",
          provenance: provenancePourEnvoi(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de l'envoi");
      }
      signalerConversion("contact");
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'envoi. Réessayez ou appelez-nous au 01 60 86 37 54."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chaque coordonnée est actionnable d'un tap : c'est ce qui transforme une
  // visite mobile en appel.
  const contactInfo: {
    icon: typeof Phone;
    label: string;
    liens: { texte: string; href?: string }[];
  }[] = [
    {
      icon: Phone,
      label: "Téléphone",
      liens: [
        { texte: "01 60 86 37 54", href: "tel:+33160863754" },
        { texte: "07 71 74 20 83", href: "tel:+33771742083" },
      ],
    },
    {
      icon: Mail,
      label: "Email",
      liens: [
        { texte: "contact@ouvertures-pro.fr", href: "mailto:contact@ouvertures-pro.fr" },
      ],
    },
    {
      icon: MapPin,
      label: "Adresse",
      liens: [
        {
          texte: "22 bis rue des Malines, 91090 Lisses",
          href: "https://maps.google.com/?q=22+bis+rue+des+Malines+91090+Lisses",
        },
      ],
    },
  ];

  return (
    <section id="contact" className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div
          ref={sectionRef}
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "animate-reveal-up" : "opacity-0"}`}
        >
          <p className="text-primary font-medium mb-2 uppercase tracking-wide text-sm">
            Parlons de votre projet
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Contactez-Nous
          </h2>
          <p className="text-muted-foreground">
            Une question ? Un projet ? Nous sommes à votre écoute.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Informations de Contact
              </h3>
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-md group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-muted-foreground">
                        {item.liens.map((lien, i) => (
                          <span key={lien.texte}>
                            {i > 0 && " / "}
                            {lien.href ? (
                              <a
                                href={lien.href}
                                {...(lien.href.startsWith("http")
                                  ? { target: "_blank", rel: "noopener noreferrer" }
                                  : {})}
                                className="hover:text-primary underline-offset-2 hover:underline transition-colors"
                              >
                                {lien.texte}
                              </a>
                            ) : (
                              lien.texte
                            )}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Zone d&apos;Intervention
              </h3>
              <p className="text-muted-foreground mb-4">
                Nous intervenons dans toute l&apos;Île-de-France et ses environs (Essonne, Hauts-de-Seine, Val-de-Marne...).
              </p>
              <div className="bg-card rounded-xl overflow-hidden h-48 border border-border">
                <iframe
                  src="https://maps.google.com/maps?q=22+bis+rue+des+Malines+91090+Lisses&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Zone d'intervention"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Envoyez-nous un message
            </h3>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-reveal-scale">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Message envoyé !
                </h4>
                <p className="text-muted-foreground mb-6">
                  Nous vous répondrons dans les plus brefs délais.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsSubmitted(false)}
                >
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Votre nom"
                    className="input-animated"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="votre@email.com"
                      className="input-animated"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      placeholder="06 12 34 56 78"
                      className="input-animated"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service">
                    Votre projet concerne{" "}
                    <span className="font-normal text-muted-foreground">(facultatif)</span>
                  </Label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="input-animated h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Choisir…</option>
                    {GROUPES_SERVICES.map((groupe) => (
                      <optgroup key={groupe.titre} label={groupe.titre}>
                        {groupe.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    placeholder="Décrivez votre projet..."
                    rows={4}
                    className="input-animated"
                  />
                </div>
                {errorMsg && (
                  <p
                    role="alert"
                    className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2"
                  >
                    {errorMsg}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base btn-shine"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Envoyer le message
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
