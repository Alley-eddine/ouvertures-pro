"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import Link from "next/link";

const teamMembers = [
  {
    name: "Cédric Tamoud",
    role: "Gérant / Fondateur",
    image: "/images/team-1.jpg",
    description: "À la tête d'Ouvertures Pro depuis 2018, Cédric pilote chaque projet avec passion et exigence.",
  },
  {
    name: "Hervé",
    role: "Technicien Poseur",
    image: "/images/team-2.jpg",
    description: "Spécialiste en installation et pose de fenêtres, portes et volets.",
  },
  {
    name: "Benjamin",
    role: "Technicien Poseur",
    image: "/images/team-3.jpg",
    description: "Précision et soin du détail pour des finitions impeccables.",
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
            Les visages derrière le travail
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Notre Équipe
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Des professionnels passionnés, engagés pour la qualité de vos projets.
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
              {/* Photo container */}
              <div className="relative overflow-hidden rounded-2xl mb-5 aspect-[3/4] bg-muted">
                {/* Placeholder - replace with real photos */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-4xl font-bold text-white/80">
                      {member.name.charAt(0)}
                    </span>
                  </div>
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

        {/* Note for photos */}
        <p className="text-center text-sm text-muted-foreground/60 mt-12 italic">
          Ajoutez vos photos d&apos;équipe dans public/images/ (team-1.jpg, team-2.jpg, team-3.jpg)
        </p>
      </div>
    </section>
  );
}
