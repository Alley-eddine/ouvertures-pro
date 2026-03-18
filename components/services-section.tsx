"use client";

import { DoorOpen, Fence, RollerCoaster, Wrench, Warehouse, SunMedium } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const services = [
  {
    icon: DoorOpen,
    title: "Fenêtres",
    description: "PVC, aluminium, hybride ou textural. Pose neuve ou rénovation complète.",
    color: "from-blue-500/10 to-blue-600/5",
  },
  {
    icon: Fence,
    title: "Portes d'entrée",
    description: "Portes d'entrée sécurisées et sur mesure, design moderne ou classique.",
    color: "from-amber-500/10 to-amber-600/5",
  },
  {
    icon: RollerCoaster,
    title: "Volets",
    description: "Volets roulants, battants ou coulissants. Motorisation disponible.",
    color: "from-emerald-500/10 to-emerald-600/5",
  },
  {
    icon: Warehouse,
    title: "Portes de garage",
    description: "Portes de garage sectionnelles, enroulables ou battantes sur mesure.",
    color: "from-violet-500/10 to-violet-600/5",
  },
  {
    icon: SunMedium,
    title: "Stores",
    description: "Stores bannes, stores intérieurs et extérieurs pour votre confort.",
    color: "from-orange-500/10 to-orange-600/5",
  },
  {
    icon: Wrench,
    title: "Réparation",
    description: "Intervention rapide pour réparation et dépannage d'urgence.",
    color: "from-red-500/10 to-red-600/5",
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
            Ce que nous faisons
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Nos Services Experts
          </h2>
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
