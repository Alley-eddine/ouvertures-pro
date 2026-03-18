"use client";

import { ShieldCheck, Award, Clock, BadgeCheck } from "lucide-react";
import { useScrollReveal, useCountUp } from "@/hooks/use-scroll-reveal";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "RGE Qualibat",
    description: "Certification reconnue, gage de qualité et d'éligibilité aux aides.",
    count: 10,
    suffix: " ans",
  },
  {
    icon: BadgeCheck,
    title: "Made in France",
    description: "Matériaux certifiés NF & CE, sélectionnés auprès de fournisseurs français.",
    count: 100,
    suffix: "%",
  },
  {
    icon: Clock,
    title: "Étude Gratuite",
    description: "Devis et étude personnalisée offerts, réponse sous 24h.",
    count: 24,
    suffix: "h",
  },
  {
    icon: Award,
    title: "Projets Réalisés",
    description: "Des centaines de clients satisfaits en Île-de-France depuis 2018.",
    count: 500,
    suffix: "+",
  },
];

function CounterItem({ item, isVisible, index }: { item: typeof trustItems[0]; isVisible: boolean; index: number }) {
  const count = useCountUp(item.count, 2000, isVisible);

  return (
    <div
      className={`text-center p-6 ${
        isVisible ? "animate-reveal-up" : "opacity-0"
      }`}
      style={isVisible ? { animationDelay: `${index * 0.15}s` } : undefined}
    >
      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
        <item.icon className="w-8 h-8 text-secondary-foreground" />
      </div>
      <p className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-2">
        {count}{item.suffix}
      </p>
      <h3 className="text-lg font-semibold text-secondary-foreground mb-2">
        {item.title}
      </h3>
      <p className="text-secondary-foreground/80 text-sm leading-relaxed">
        {item.description}
      </p>
    </div>
  );
}

export function TrustSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <section className="py-24 bg-secondary relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/5 rounded-full" />

      <div className="container mx-auto px-4 relative z-10">
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, index) => (
            <CounterItem key={index} item={item} isVisible={isVisible} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
