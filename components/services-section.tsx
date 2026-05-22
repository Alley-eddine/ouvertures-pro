"use client";

import Image from "next/image";
import { AppWindow, DoorClosed, Blinds, Warehouse, SunMedium, Fence } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const services = [
  {
    icon: AppWindow,
    title: "Fenêtres & baies vitrées",
    description: "PVC, aluminium ou mixte bois/alu. Double ou triple vitrage. On dépose les anciennes, on hisse les nouvelles, on isole.",
    image: "/images/services/pose-baie-vitree-coulissante-aluminium-noir.webp",
    alt: "Grande baie vitrée coulissante aluminium noir, vue depuis salon contemporain",
  },
  {
    icon: DoorClosed,
    title: "Portes d'entrée",
    description: "Portes blindées, portes acier, portes vitrées. Sur mesure, avec digicode si besoin. Sécurité d'abord.",
    image: "/images/services/pose-porte-entree-vitrage-fer-forge.webp",
    alt: "Porte d'entrée bleue avec vitrage et grille en fer forgé sur façade en pierre",
  },
  {
    icon: Blinds,
    title: "Volets",
    description: "Volets roulants (motorisés ou solaires), volets battants, volets coulissants. On garde ce qui peut être gardé, on rénove le reste.",
    image: "/images/services/pose-volets-battants-imitation-bois.webp",
    alt: "Fenêtre PVC avec volets battants imitation bois, finition soignée",
  },
  {
    icon: Warehouse,
    title: "Portes de garage",
    description: "Sectionnelles, enroulables ou battantes. Motorisation comprise. Pose en demi-journée pour la plupart des modèles.",
    image: "/images/services/pose-porte-garage-sectionnelle-rouge.webp",
    alt: "Porte de garage sectionnelle rouge motorisée avec porte d'entrée assortie",
  },
  {
    icon: Fence,
    title: "Portails & clôtures",
    description: "Portails aluminium ou acier, portillons, clôtures, vitrines commerciales. Tout ce qui ferme et qui doit tenir.",
    image: "/images/services/installation-portail-cloture-aluminium-anthracite.webp",
    alt: "Portail double battant et portillon aluminium gris anthracite avec clôture pleine",
  },
  {
    icon: SunMedium,
    title: "Stores & dépannage",
    description: "Stores bannes, stores intérieurs. Réparation de volets bloqués, changement de vitres, remplacement de gonds. Souvent en moins d'une heure.",
    image: "/images/services/installation-store-banne-led-terrasse.webp",
    alt: "Store banne avec éclairage LED intégré déployé sur terrasse",
  },
];

export function ServicesSection() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="services" className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div
          ref={titleRef}
          className={`text-center mb-16 ${titleVisible ? "animate-reveal-up" : "opacity-0"}`}
        >
          <p className="text-primary font-medium mb-2 uppercase tracking-wide text-sm">
            Ce qu&apos;on pose chez vous
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Tout ce qui s&apos;ouvre et se ferme.
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Pose neuve, rénovation ou dépannage. On vient voir, on conseille, on fait un devis. Puis on pose.
          </p>
        </div>

        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`bg-card rounded-xl overflow-hidden card-hover border border-border hover:border-primary/30 group flex flex-col ${
                cardsVisible ? "animate-reveal-up" : "opacity-0"
              }`}
              style={cardsVisible ? { animationDelay: `${index * 0.1}s` } : undefined}
            >
              {/* Photo */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Icon badge top-left */}
                <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110">
                  <service.icon className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* Text */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
