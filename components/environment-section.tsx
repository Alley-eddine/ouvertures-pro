"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function EnvironmentSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <section id="environnement" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className={`max-w-5xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}
        >
          <div className="grid md:grid-cols-5 gap-10 md:gap-16 items-center">
            {/* Left — text content */}
            <div className="md:col-span-3">
              <p className="text-primary font-medium mb-2 uppercase tracking-wide text-sm">
                Notre engagement
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                Le tri et le recyclage,
                <br />
                ça compte aussi.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Chaque chantier produit des déchets : anciennes menuiseries en
                PVC ou aluminium, vitres, cadres bois, films plastiques,
                emballages, gravats. Plutôt que de les balancer dans une benne
                tout-venant, on les fait collecter et valoriser par des
                prestataires agréés.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Bois, verre, métaux, plastiques — chaque matière repart vers la
                bonne filière. C&apos;est plus cher, c&apos;est plus long, mais
                c&apos;est notre manière de faire le métier proprement.
              </p>
            </div>

            {/* Right — big stat */}
            <div className="md:col-span-2 text-center md:text-left md:border-l md:border-border md:pl-10">
              <p className="text-6xl md:text-7xl font-bold text-foreground leading-none mb-3">
                12 000<span className="text-primary">€</span>
              </p>
              <p className="text-base font-semibold text-foreground mb-1">
                investis chaque année
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                en gestion des déchets et en recyclage de nos chantiers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
