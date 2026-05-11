"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import Link from "next/link";

const teamMembers = [
  {
    name: "Cédric Tamoud",
    role: "Gérant — fondateur",
    image: "/images/team-1.jpg",
    description: "Le patron. Il fonde Ouvertures Pro en 2018, vient voir chaque chantier, conseille les produits, monte chaque devis. Souvent cité dans les avis Google pour ses « conseils précieux ».",
    badge: "Gérant",
  },
  {
    name: "Benjamin",
    role: "Poseur — salarié",
    image: "/images/team-3.jpg",
    description: "Bonnet rose en option. Précision sur les finitions, sourire en prime. Sur la plupart des chantiers aux côtés de Cédric.",
    badge: null,
  },
  {
    name: "Hervé",
    role: "Poseur — salarié",
    image: "/images/team-2.jpg",
    description: "Renfort pose et interventions rapides. Le 3e homme sur les gros chantiers, le 1er sur les dépannages.",
    badge: null,
  },
];

export function TeamSection() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="equipe" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div
          ref={titleRef}
          className={`text-center mb-16 ${titleVisible ? "animate-reveal-up" : "opacity-0"}`}
        >
          <p className="text-primary font-medium mb-2 uppercase tracking-wide text-sm">
            Qui débarque chez vous
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Cédric et son équipe.
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Ouvertures Pro, c&apos;est Cédric Tamoud et ses deux salariés, Benjamin et Hervé.
            Pas de sous-traitance, pas d&apos;intérimaires — toujours les mêmes têtes sur vos chantiers.
          </p>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`team-card group relative ${
                gridVisible ? "animate-reveal-up" : "opacity-0"
              }`}
              style={gridVisible ? { animationDelay: `${index * 0.12}s` } : undefined}
            >
              {/* Photo container — placeholder until team photos are added */}
              <div className="relative overflow-hidden rounded-2xl mb-5 aspect-[3/4] bg-gradient-to-br from-secondary/30 via-primary/10 to-muted">
                {member.badge && (
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] uppercase tracking-wider font-semibold shadow">
                    {member.badge}
                  </div>
                )}
                <div className="absolute inset-0 flex items-end p-6">
                  <p className="text-foreground/40 text-xs uppercase tracking-widest font-medium">
                    Photo à venir
                  </p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-5">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white/90 text-sm leading-relaxed mb-3">
                      {member.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
