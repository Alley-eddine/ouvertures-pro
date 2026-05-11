"use client";

import { AppWindow, DoorClosed, Blinds, Warehouse, SunMedium, Fence } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const services = [
  {
    icon: AppWindow,
    title: "Fenêtres & baies vitrées",
    description: "PVC, aluminium ou mixte bois/alu. Double ou triple vitrage. On dépose les anciennes, on hisse les nouvelles, on isole.",
    color: "from-blue-500/10 to-blue-600/5",
  },
  {
    icon: DoorClosed,
    title: "Portes d'entrée",
    description: "Portes blindées, portes acier, portes vitrées. Sur mesure, avec digicode si besoin. Sécurité d'abord.",
    color: "from-amber-500/10 to-amber-600/5",
  },
  {
    icon: Blinds,
    title: "Volets",
    description: "Volets roulants (motorisés ou solaires), volets battants, volets coulissants. On garde ce qui peut être gardé, on rénove le reste.",
    color: "from-emerald-500/10 to-emerald-600/5",
  },
  {
    icon: Warehouse,
    title: "Portes de garage",
    description: "Sectionnelles, enroulables ou battantes. Motorisation comprise. Pose en demi-journée pour la plupart des modèles.",
    color: "from-violet-500/10 to-violet-600/5",
  },
  {
    icon: Fence,
    title: "Portails & clôtures",
    description: "Portails aluminium ou acier, portillons, clôtures, vitrines commerciales. Tout ce qui ferme et qui doit tenir.",
    color: "from-slate-500/10 to-slate-600/5",
  },
  {
    icon: SunMedium,
    title: "Stores & dépannage",
    description: "Stores bannes, stores intérieurs. Réparation de volets bloqués, changement de vitres, remplacement de gonds. Souvent en moins d'une heure.",
    color: "from-orange-500/10 to-orange-600/5",
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
            Tout ce qui ferme et qui s&apos;ouvre.
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Pose neuve, rénovation ou dépannage. On vient voir, on conseille, on fait un devis. Puis on pose.
          </p>
        </div>

        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`bg-card p-8 rounded-xl text-center card-hover border border-transparent hover:border-primary/20 group ${
                cardsVisible ? "animate-reveal-up" : "opacity-0"
              }`}
              style={cardsVisible ? { animationDelay: `${index * 0.1}s` } : undefined}
            >
              <div className={`w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-8 h-8 text-primary transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
