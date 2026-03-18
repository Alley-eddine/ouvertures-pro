"use client";

import { Star, Quote, ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    content: "Remplacement d'une porte fatiguée par une superbe porte blindée et rénovation des volets. Travail très propre, protection de l'immeuble pendant les travaux.",
    author: "Sophie M.",
    rating: 5,
  },
  {
    content: "Cédric et Benjamin travaillent avec professionnalisme et bonne humeur. Excellents conseils pour notre projet de rénovation de fenêtres.",
    author: "Laurent D.",
    rating: 5,
  },
  {
    content: "Entreprise sérieuse et réactive. Pose de fenêtres PVC impeccable, délais respectés. Ça se voit dans la qualité du travail.",
    author: "Nathalie B.",
    rating: 5,
  },
  {
    content: "Très satisfait de la pose de notre porte de garage et des volets roulants. Équipe à l'écoute, devis clair et respecté.",
    author: "Philippe R.",
    rating: 5,
  },
  {
    content: "Installation de baies vitrées dans notre salon. Le résultat est magnifique, la luminosité a complètement changé !",
    author: "Marie-Claire T.",
    rating: 5,
  },
  {
    content: "Intervention rapide pour un dépannage de volet roulant bloqué. Problème résolu en moins d'une heure. Service au top.",
    author: "Jean-Marc P.",
    rating: 5,
  },
  {
    content: "Nous avons fait changer toutes les fenêtres de la maison. Isolation phonique et thermique au top. Merci Ouvertures Pro !",
    author: "Isabelle K.",
    rating: 5,
  },
  {
    content: "Pose de stores bannes sur notre terrasse. Travail soigné, l'équipe a pris le temps de bien tout ajuster. Résultat parfait.",
    author: "Christophe L.",
    rating: 5,
  },
  {
    content: "Rénovation complète des menuiseries de notre appartement. Matériaux de qualité, finitions impeccables. Je recommande vivement.",
    author: "Sandrine V.",
    rating: 5,
  },
  {
    content: "Porte d'entrée blindée posée rapidement et proprement. L'équipe est ponctuelle et très professionnelle. Très content du résultat.",
    author: "Thomas G.",
    rating: 4,
  },
  {
    content: "Changement des volets battants par des volets roulants motorisés. Un vrai confort au quotidien ! Merci à toute l'équipe.",
    author: "Véronique A.",
    rating: 5,
  },
  {
    content: "Devis gratuit, réponse rapide, et travail de qualité. Installation de fenêtres aluminium dans notre bureau. Parfait.",
    author: "François H.",
    rating: 5,
  },
  {
    content: "Excellente entreprise. Pose de porte de garage sectionnelle faite en une demi-journée. Propre, efficace, rien à redire.",
    author: "Patrick S.",
    rating: 5,
  },
  {
    content: "On a fait appel à eux pour des fenêtres sur mesure. Le résultat dépasse nos attentes. Rapport qualité-prix imbattable.",
    author: "Caroline F.",
    rating: 5,
  },
  {
    content: "Troisième chantier avec Ouvertures Pro. Toujours la même qualité de service. C'est rare de trouver des artisans aussi fiables.",
    author: "Michel D.",
    rating: 5,
  },
];

function ReviewCard({ testimonial, isPaused }: { testimonial: typeof testimonials[0]; isPaused: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex-shrink-0 w-[320px] mx-3 transition-all duration-500 ${
        hovered ? "scale-105 z-10" : isPaused && !hovered ? "scale-95 opacity-60" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`bg-card p-6 rounded-xl border transition-all duration-500 h-full ${
        hovered ? "shadow-xl border-primary/30" : "shadow-sm border-border"
      }`}>
        <div className="absolute -top-3 left-5 w-7 h-7 bg-primary rounded-lg flex items-center justify-center shadow-md">
          <Quote className="w-3.5 h-3.5 text-white" />
        </div>

        <div className="flex gap-0.5 mb-3 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < testimonial.rating ? "fill-primary text-primary" : "fill-muted text-muted"
              }`}
            />
          ))}
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          &quot;{testimonial.content}&quot;
        </p>

        <div className="border-t border-border pt-3 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">G</span>
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{testimonial.author}</p>
            <p className="text-[11px] text-muted-foreground">Avis Google</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5;

    const animate = () => {
      if (!isPaused && container) {
        scrollPos += speed;
        const halfWidth = container.scrollWidth / 2;
        if (scrollPos >= halfWidth) {
          scrollPos = 0;
        }
        container.style.transform = `translateX(-${scrollPos}px)`;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          ref={titleRef}
          className={`text-center mb-16 ${titleVisible ? "animate-reveal-up" : "opacity-0"}`}
        >
          <p className="text-primary font-medium mb-2 uppercase tracking-wide text-sm">
            Ils nous font confiance
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Témoignages Clients
          </h2>
          <div className="flex justify-center items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < 5 ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
            ))}
            <span className="ml-2 text-muted-foreground text-sm">4.8/5 sur Google (30 avis)</span>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link
              href="https://search.google.com/local/writereview?placeid=ChIJAAAAAEXe5UcRAOQ9qzGB8JI"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Star className="w-4 h-4" />
              Laisser un avis Google
              <ExternalLink className="w-3 h-3" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Infinite ticker carousel */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient fades on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden py-6">
          <div
            ref={scrollRef}
            className="flex will-change-transform"
          >
            {doubled.map((testimonial, index) => (
              <ReviewCard
                key={index}
                testimonial={testimonial}
                isPaused={isPaused}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
