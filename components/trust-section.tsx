"use client";

import { Sparkles, Flag, Clock, MessageCircle } from "lucide-react";
import { useScrollReveal, useCountUp } from "@/hooks/use-scroll-reveal";

const trustItems = [
  {
    icon: Flag,
    title: "Made in France",
    description: "Menuiseries sélectionnées chez des fabricants français. Plus chères, mais ça vaut le coup — c'est ce que disent les clients.",
    count: 100,
    suffix: "%",
  },
  {
    icon: Clock,
    title: "Devis sous",
    description: "Étude personnalisée gratuite, réponse rapide. On ne fait pas attendre.",
    count: 24,
    suffix: "h",
  },
  {
    icon: Sparkles,
    title: "Chantier propre",
    description: "Bâches, nettoyage chaque soir, sol laissé impeccable. Mentionné dans 80% de nos avis Google.",
    count: 8,
    suffix: "/10",
  },
  {
    icon: MessageCircle,
    title: "Au métier",
    description: "7 ans à Chilly-Mazarin, des centaines de chantiers en Île-de-France. Une équipe stable de trois artisans.",
    count: 7,
    suffix: " ans",
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
