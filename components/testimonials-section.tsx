"use client";

import { Star, Quote, ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=OUVERTURES+PRO+Avis";

type Review = {
  author: string;
  content: string;
  rating: number;
  date: string;
  localGuide?: boolean;
};

// Avis Google vérifiables sur la fiche Google Business d'Ouvertures Pro.
const allTestimonials: Review[] = [
  {
    author: "Adel Ghollam",
    rating: 5,
    date: "Il y a 4 mois",
    content:
      "Comme le nom de l'entreprise l'indique, un travail de « pro », propre, de qualité et dans les délais. Nous avons changé 2 baies vitrées et 2 fenêtres, les conseils de Cédric sont précieux pour bien choisir les produits, ces derniers sont made in France donc un petit plus cher que les autres mais la qualité est là et vaut le coup.",
  },
  {
    author: "Sousou R.",
    rating: 5,
    date: "Il y a 4 mois",
    content:
      "Un travail absolument impeccable ! La pose de la porte a été réalisée avec un soin remarquable et un grand professionnalisme. L'artisan est ponctuel, méticuleux, à l'écoute et de très bon conseil. Les finitions sont parfaites, le chantier a été laissé d'une propreté irréprochable et le résultat dépasse largement mes attentes. Je recommande les yeux fermés !",
  },
  {
    author: "Johnny Gohier",
    rating: 5,
    date: "Il y a 4 mois",
    content:
      "Entreprise très sérieuse du début à la fin. L'installation de mon portail et de ma porte d'entrée a été réalisée avec beaucoup de professionnalisme. Le travail est propre, soigné et conforme à ce qui avait été annoncé. Équipe ponctuelle, à l'écoute et de très bon conseil. Je recommande cette entreprise sans hésitation.",
  },
  {
    author: "Gilles Rayaume",
    rating: 5,
    date: "Il y a 4 mois",
    content:
      "Changement de porte d'entrée et de 8 fenêtres et 4 portes-fenêtres. Chantier réalisé dans les temps avec une équipe à l'écoute du client mais également d'un grand professionnalisme à tous niveaux. Petit plus : nettoyage du chantier parfait avant de partir chaque soir. Je recommande cette société.",
  },
  {
    author: "Oko Multi Services",
    rating: 5,
    date: "Il y a 4 mois",
    content:
      "Merci à Ouvertures Pro pour le travail effectué au sein de mon établissement commercial. La vitrine est magnifique, le travail est impeccable, je recommande à tout professionnel de faire appel à eux pour l'embellissement de leur vitrine. Travail de professionnels et rapide : moins de 24h.",
  },
  {
    author: "Thomas Arnold",
    rating: 5,
    date: "Il y a 2 ans",
    localGuide: true,
    content:
      "Nous venons de changer notre porte d'entrée avec Ouvertures Pro pour un modèle magnifique à un prix juste ! Cédric est super sympa et super efficace avec son équipe. Discrets, super bien équipés, et le chantier était toujours propre. Super communication. On recommande chaudement pour la seconde fois !",
  },
  {
    author: "Rita Pulval-Dady",
    rating: 5,
    date: "Il y a 3 ans",
    content:
      "Excellent travail pour la fourniture et pose de volets roulants solaires. Entreprise sérieuse, respect des délais annoncés, courtoisie et travaux conformes. Le patron est à l'écoute, proche de son chantier et des clients, avec une équipe professionnelle. Nous recommandons vivement.",
  },
  {
    author: "Claire H.",
    rating: 5,
    date: "Il y a 3 ans",
    localGuide: true,
    content:
      "Nous sommes extrêmement contents de la prestation pour le remplacement de notre porte fatiguée par une très belle porte blindée et pour la pose et rénovation de nos volets. Travail très propre, soin particulier à la protection de l'immeuble pendant les travaux. Équipe qui a toujours le sourire. Très bon rapport qualité-prix.",
  },
  {
    author: "Aurore Boussardon",
    rating: 5,
    date: "Il y a 3 ans",
    content:
      "Nous sommes très satisfaits : notre chantier a été réalisé comme prévu — délais, produits, coûts et surtout superbes finitions. Nous avons changé notre porte d'entrée, de garage (motorisée) et la buanderie. L'équipe travaille proprement et avec le sourire. Entreprise très sérieuse.",
  },
  {
    author: "Marion & Samuel Genin",
    rating: 5,
    date: "Il y a 3 ans",
    content:
      "Un grand merci à Cédric et son équipe pour nous avoir conseillés, expliqués et posé nos 5 fenêtres, 2 portes-fenêtres, tous les volets, la porte d'entrée (magnifique !), porte de service et porte de garage. Infiniment merci d'avoir habillé, embellit et isolé notre maison. Produits d'excellente qualité et prix très compétitifs.",
  },
  {
    author: "Jean-Sylvain Liénard",
    rating: 5,
    date: "Il y a 2 ans",
    content:
      "J'habite à Paris, au 7e étage. Mes fenêtres d'époque, en bois et vitres minces, étaient délabrées. Cédric a mis le chantier en route avec discrétion et compétence. Tous les meubles ont été protégés par des bâches. Chaque soir le matériel était regroupé, le sol nettoyé. À la fin du troisième jour tout était propre et fonctionnel. J'aime le travail bien fait.",
  },
  {
    author: "Sandy & Eric",
    rating: 5,
    date: "Il y a 3 ans",
    localGuide: true,
    content:
      "Nous en sommes à notre 2ème chantier avec Ouvertures Pro et ce n'est que le début ;) Excellents conseils et accompagnement dans nos projets. Large choix de produits français de très belle qualité. Cédric et Benjamin travaillent avec beaucoup de professionnalisme et dans la bonne humeur. À très bientôt pour la porte de garage !",
  },
  {
    author: "Brigitte Alexandre",
    rating: 5,
    date: "Il y a 3 ans",
    content:
      "Équipe professionnelle, courtoise avec le sourire, à l'écoute et proche de ses clients. Respect des délais. Travail soigné, chantier laissé propre. Entreprise sérieuse à recommander. Merci Cédric et Benjamin.",
  },
  {
    author: "Ilona Jobert",
    rating: 5,
    date: "Il y a 4 ans",
    content:
      "Un grand merci à Cédric et son équipe pour leur professionnalisme et leur gentillesse. La pose de ma porte de garage s'est déroulée dans les meilleures conditions et je suis plus que satisfaite du résultat.",
  },
  {
    author: "E. G.",
    rating: 5,
    date: "Il y a 3 ans",
    content:
      "Une équipe très professionnelle, très bien encadrée. Je suis très contente du travail réalisé : pose de stores bannettes, fenêtre et volet roulant dans mon appartement. Je recommande !",
  },
  {
    author: "Stephanie Bouchez",
    rating: 5,
    date: "Il y a 3 ans",
    content:
      "Merci encore pour cette belle réalisation. Une équipe discrète et concentrée, toujours de bonne humeur, à l'écoute. Ils connaissent leur boulot sur le bout des doigts. Matériel de très haute qualité, chantier propre et rigoureux. Des vrais professionnels, je recommande sans hésiter. Longue vie à votre société !",
  },
  {
    author: "Clode Hivernon",
    rating: 5,
    date: "Il y a 3 ans",
    content:
      "J'ai fait appel à cette société à plusieurs reprises. La satisfaction est au rendez-vous à chaque fois. Une équipe dynamique et très réactive, aussi bien sur les devis que sur les délais d'installation !",
  },
  {
    author: "Benoit Prunier",
    rating: 5,
    date: "Il y a 3 ans",
    content:
      "L'échange de la porte d'entrée a été très bien réalisé. Une équipe très professionnelle et agréable. Je recommande à 200%.",
  },
  {
    author: "Sophie Bilski",
    rating: 5,
    date: "Il y a 3 ans",
    content:
      "Bravo à Cédric pour son travail soigné et sa gentillesse ! Je recommande vivement.",
  },
  {
    author: "Anthony Robinson",
    rating: 5,
    date: "Il y a 2 ans",
    localGuide: true,
    content: "Ouvertures Pro : un travail impeccable avec une livraison 15 jours avant. Au top !",
  },
  {
    author: "Clément Tallandié",
    rating: 5,
    date: "Il y a 3 ans",
    content:
      "Une équipe top, du savoir-faire ainsi que des produits qualitatifs. Je recommande.",
  },
  {
    author: "Sand",
    rating: 5,
    date: "Il y a 3 ans",
    content: "Très professionnel et efficace, et avec du bon matériel.",
  },
  {
    author: "Tibs Dems",
    rating: 5,
    date: "Il y a 3 ans",
    localGuide: true,
    content: "Équipe et travail au top ! Je recommande fortement.",
  },
];

const testimonials = allTestimonials.slice(0, 20);

function ReviewCard({
  testimonial,
  isPaused,
}: {
  testimonial: Review;
  isPaused: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex-shrink-0 w-[320px] mx-3 transition-all duration-500 ${
        hovered ? "scale-105 z-10" : isPaused && !hovered ? "scale-95 opacity-60" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`relative bg-card p-6 rounded-xl border transition-all duration-500 h-full ${
          hovered ? "shadow-xl border-primary/30" : "shadow-sm border-border"
        }`}
      >
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

        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-[7]">
          &quot;{testimonial.content}&quot;
        </p>

        <div className="border-t border-border pt-3 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">G</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm truncate">
              {testimonial.author}
              {testimonial.localGuide && (
                <span className="ml-1.5 text-[9px] font-medium text-primary uppercase tracking-wide">
                  Local Guide
                </span>
              )}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Avis Google · {testimonial.date}
            </p>
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

    let animationId = 0;
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
    <section id="avis" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          ref={titleRef}
          className={`text-center mb-12 ${titleVisible ? "animate-reveal-up" : "opacity-0"}`}
        >
          <p className="text-primary font-medium mb-2 uppercase tracking-wide text-sm">
            Ils nous font confiance
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Avis clients vérifiés
          </h2>
          <div className="flex justify-center items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-primary text-primary" />
            ))}
            <span className="ml-2 text-muted-foreground text-sm">
              4,8/5 sur Google
            </span>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir tous les avis sur Google
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
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden py-6">
          <div ref={scrollRef} className="flex will-change-transform">
            {doubled.map((testimonial, index) => (
              <ReviewCard
                key={`${testimonial.author}-${index}`}
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
