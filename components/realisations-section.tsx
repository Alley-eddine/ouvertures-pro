"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
  containerClassName?: string;
  imageFit?: "cover" | "contain";
}

function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Photo avant travaux",
  afterAlt = "Photo après travaux",
  beforeLabel = "Avant",
  afterLabel = "Après",
  containerClassName = "aspect-[4/3] rounded-xl border border-border",
  imageFit = "cover",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return;
      updateSlider(e.clientX);
    },
    [updateSlider]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current) return;
      updateSlider(e.touches[0].clientX);
    },
    [updateSlider]
  );

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  const fitClass = imageFit === "contain" ? "object-contain" : "object-cover";

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden cursor-col-resize select-none ${containerClassName}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="slider"
      aria-label="Comparaison avant après"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setSliderPosition((p) => Math.max(p - 2, 0));
        if (e.key === "ArrowRight") setSliderPosition((p) => Math.min(p + 2, 100));
      }}
    >
      {/* After image (background) */}
      <Image
        src={afterImage}
        alt={afterAlt}
        fill
        className={fitClass}
        sizes={imageFit === "contain" ? "95vw" : "(max-width: 768px) 100vw, 50vw"}
        priority={imageFit === "contain"}
      />

      {/* Before image (revealed via clip-path so it never squishes) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={beforeImage}
          alt={beforeAlt}
          fill
          className={fitClass}
          sizes={imageFit === "contain" ? "95vw" : "(max-width: 768px) 100vw, 50vw"}
          priority={imageFit === "contain"}
        />
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-primary-foreground"
          >
            <path
              d="M6 10L3 10M3 10L5 8M3 10L5 12M14 10L17 10M17 10L15 8M17 10L15 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1.5 rounded-full z-20">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full z-20">
        {afterLabel}
      </div>
    </div>
  );
}

type Realisation = {
  id: number;
  title: string;
  imageBefore: string;
  imageAfter: string;
  altBefore: string;
  altAfter: string;
  descriptionBefore: string;
  descriptionAfter: string;
};

const realisations: Realisation[] = [
  {
    id: 1,
    title: "Installation de baie vitrée et terrasse",
    imageBefore: "/images/realisations/avant-apres/1avant.webp",
    imageAfter: "/images/realisations/avant-apres/1apres.webp",
    altBefore: "Intérieur maison vide avant installation baie vitrée",
    altAfter: "Installation baie vitrée aluminium noir sur terrasse bois neuve",
    descriptionBefore:
      "Cet exemple montre le potentiel inexploité d'une pièce intérieure. Initialement, l'espace disposait d'un sol en carrelage clair et de murs peints, manquant d'ouverture vers l'extérieur.",
    descriptionAfter:
      "Découvrez la transformation spectaculaire de cet espace ! L'installation d'une grande baie vitrée coulissante en aluminium noir apporte une abondance de lumière naturelle et donne directement sur une terrasse en bois neuve.",
  },
  {
    id: 2,
    title: "Rénovation de patio avec pergola",
    imageBefore: "/images/realisations/avant-apres/2avant.webp",
    imageAfter: "/images/realisations/avant-apres/2apres.webp",
    altBefore: "Rénovation patio extérieur avant après bardage bois usé",
    altAfter: "Aménagement terrasse moderne avec pergola rétractable et mobilier intégré",
    descriptionBefore:
      "Un petit patio extérieur négligé. Le bardage en bois latéral était gris et altéré par le temps, et l'espace manquait de fonctionnalité.",
    descriptionAfter:
      "La métamorphose est totale ! Le bardage bois a été entièrement rénové et lasuré. L'espace a été optimisé avec des sièges sur mesure et une pergola rétractable (store banne motorisé) créant un véritable espace lounge extérieur.",
  },
  {
    id: 3,
    title: "Remplacement porte d'entrée semi-vitrée",
    imageBefore: "/images/realisations/avant-apres/3avant.webp",
    imageAfter: "/images/realisations/avant-apres/3apres.webp",
    altBefore: "Vieille porte d'entrée en bois abîmée peinture écaillée",
    altAfter: "Nouvelle porte d'entrée bleue vitrée avec grille de défense en fer forgé",
    descriptionBefore:
      "Cette ancienne porte d'entrée en bois massif avait fait son temps, avec sa peinture écaillée. Son format plein bloquait toute la lumière naturelle.",
    descriptionAfter:
      "Le changement est radical avec cette superbe porte d'entrée bleue sur mesure. Le modèle semi-vitré inonde l'intérieur de lumière, tandis que la grille en fer forgé assure un niveau de sécurité optimal.",
  },
  {
    id: 4,
    title: "Installation clôture rigide avec brise-vue",
    imageBefore: "/images/realisations/avant-apres/4avant.webp",
    imageAfter: "/images/realisations/avant-apres/4apres.webp",
    altBefore: "Ancien grillage souple endommagé sans brise-vue",
    altAfter: "Installation clôture rigide verte avec panneaux brise-vue palissade",
    descriptionBefore:
      "L'espace était délimité par un vieux grillage souple en fin de vie, affaissé et n'offrant aucune intimité par rapport à l'extérieur.",
    descriptionAfter:
      "Nous avons entièrement sécurisé cet espace avec une clôture rigide verte. Équipée de panneaux pleins, elle fait office de brise-vue efficace, garantissant une intimité totale.",
  },
  {
    id: 5,
    title: "Rénovation muret et portail",
    imageBefore: "/images/realisations/avant-apres/5avant.webp",
    imageAfter: "/images/realisations/avant-apres/5apres.webp",
    altBefore: "Ancien muret de maison et portail blanc détérioré",
    altAfter: "Portail coulissant et portillon aluminium gris anthracite sur muret rénové",
    descriptionBefore:
      "L'entrée de la propriété manquait de cachet avec un muret vieillissant et un portail blanc basique qui n'assurait plus une sécurité optimale.",
    descriptionAfter:
      "Rénovation complète de l'entrée ! Nous avons installé un ensemble portail coulissant et portillon en aluminium gris anthracite, encadrés par un muret fraîchement enduit avec couvertines noires. Un rendu moderne, sécurisé et élégant.",
  },
  {
    id: 6,
    title: "Remplacement devanture de magasin",
    imageBefore: "/images/realisations/avant-apres/6avant.webp",
    imageAfter: "/images/realisations/avant-apres/6apres.webp",
    altBefore: "Ancienne vitrine de commerce dégradée",
    altAfter: "Nouvelle vitrine en aluminium avec double vitrage pour commerce",
    descriptionBefore:
      "Cette ancienne vitrine commerciale présentait des signes d'usure importants, offrant une mauvaise isolation et une esthétique dépassée pour accueillir des clients.",
    descriptionAfter:
      "Rénovation de la devanture pour ce commerce Multiservices. Pose d'une vitrine sur mesure en aluminium avec double vitrage. L'isolation thermique et phonique est grandement améliorée, tout en modernisant l'image de la boutique.",
  },
  {
    id: 7,
    title: "Modernisation clôture et portail battant",
    imageBefore: "/images/realisations/avant-apres/7avant.webp",
    imageAfter: "/images/realisations/avant-apres/7apres.webp",
    altBefore: "Portail battant et clôture en bois blanc usé par le temps",
    altAfter: "Portail battant et clôture en aluminium gris anthracite sur mesure",
    descriptionBefore:
      "L'ancienne délimitation en bois blanc nécessitait beaucoup d'entretien et commençait à pourrir par endroits, compromettant la solidité de la structure.",
    descriptionAfter:
      "Remplacement par une solution zéro entretien ! Installation d'une clôture et d'un portail battant en aluminium gris anthracite. Un design épuré qui modernise instantanément la façade tout en garantissant une durabilité maximale.",
  },
  {
    id: 8,
    title: "Porte d'entrée classique et fer forgé",
    imageBefore: "/images/realisations/avant-apres/8avant.webp",
    imageAfter: "/images/realisations/avant-apres/8apres.webp",
    altBefore: "Vieille porte en bois vert foncé avec peinture écaillée",
    altAfter: "Porte d'entrée gris anthracite avec grille de défense en fer forgé",
    descriptionBefore:
      "Une porte d'entrée d'époque dont le bois avait souffert des intempéries, avec une peinture écaillée et des performances d'étanchéité devenues obsolètes.",
    descriptionAfter:
      "L'authenticité préservée, la performance en plus. Installation d'une nouvelle porte d'entrée gris anthracite intégrant une magnifique grille en fer forgé. Elle allie le charme du classique aux normes de sécurité et d'isolation actuelles.",
  },
  {
    id: 9,
    title: "Remplacement porte d'entrée double",
    imageBefore: "/images/realisations/avant-apres/9avant.webp",
    imageAfter: "/images/realisations/avant-apres/9apres.webp",
    altBefore: "Ancienne porte double rouge bordeaux en bois massif",
    altAfter: "Nouvelle porte double rouge avec moulures et haute isolation thermique",
    descriptionBefore:
      "Cette porte double traditionnelle montrait des signes de fatigue et nécessitait une rénovation pour retrouver son éclat et améliorer l'isolation du hall d'entrée.",
    descriptionAfter:
      "Pose d'une nouvelle porte double sur mesure. Nous avons conservé le coloris rouge vif et le style à moulures pour respecter l'esthétique de la maison, tout en apportant une étanchéité parfaite et des matériaux modernes.",
  },
  {
    id: 10,
    title: "Rénovation de fenêtre classique",
    imageBefore: "/images/realisations/avant-apres/10avant.webp",
    imageAfter: "/images/realisations/avant-apres/10apres.webp",
    altBefore: "Ancienne fenêtre en bois simple vitrage détériorée",
    altAfter: "Nouvelle fenêtre blanche double vitrage haute isolation",
    descriptionBefore:
      "Une menuiserie ancienne en simple vitrage, responsable d'importantes déperditions de chaleur et n'isolant plus du tout des bruits extérieurs.",
    descriptionAfter:
      "Amélioration du confort thermique et acoustique avec cette nouvelle fenêtre blanche équipée d'un double vitrage performant. Une pose soignée qui laisse entrer la lumière tout en gardant le froid à l'extérieur.",
  },
  {
    id: 11,
    title: "Installation porte de garage motorisée",
    imageBefore: "/images/realisations/avant-apres/11avant.webp",
    imageAfter: "/images/realisations/avant-apres/11apres.webp",
    altBefore: "Ancienne porte de garage enroulable marron vieillissante",
    altAfter: "Nouvelle porte de garage enroulable blanche motorisée en aluminium",
    descriptionBefore:
      "L'ancienne porte de garage manquait de praticité et son esthétique marron assombrissait l'annexe de la maison.",
    descriptionAfter:
      "Gain de confort au quotidien avec l'installation de cette porte de garage enroulable motorisée en aluminium blanc. Elle offre un gain de place optimal, une manipulation à distance et illumine l'allée.",
  },
  {
    id: 12,
    title: "Création d'une double porte d'entrée",
    imageBefore: "/images/realisations/avant-apres/12avant.webp",
    imageAfter: "/images/realisations/avant-apres/12apres.webp",
    altBefore: "Ancienne porte-fenêtre blanche avec volets battants",
    altAfter: "Nouvelle porte d'entrée double bleue avec vitrage et fer forgé",
    descriptionBefore:
      "L'accès se faisait par une porte-fenêtre standard blanche, peu sécurisante pour une entrée principale et manquant de caractère.",
    descriptionAfter:
      "Une métamorphose totale ! Remplacement de la porte-fenêtre par une splendide double porte d'entrée bleue sur mesure. Le vitrage laisse passer la lumière tandis que les grilles en fer forgé assurent la sécurité et apportent un cachet incroyable à la façade.",
  },
];

export function RealisationsSection() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({ threshold: 0.05 });

  return (
    <section id="realisations" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div
          ref={titleRef}
          className={`text-center mb-16 ${titleVisible ? "animate-reveal-up" : "opacity-0"}`}
        >
          <p className="text-primary font-medium mb-2 uppercase tracking-wide text-sm">
            La preuve par l&apos;image
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Nos Réalisations Avant / Après
          </h2>
          <p className="text-muted-foreground mt-3">
            Glissez pour comparer le résultat
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 gap-8">
          {realisations.map((item, index) => (
            <div
              key={item.id}
              className={`${gridVisible ? "animate-reveal-up" : "opacity-0"}`}
              style={gridVisible ? { animationDelay: `${index * 0.15}s` } : undefined}
            >
              <div className="relative group">
                <BeforeAfterSlider
                  beforeImage={item.imageBefore}
                  afterImage={item.imageAfter}
                  beforeAlt={item.altBefore}
                  afterAlt={item.altAfter}
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      className="absolute bottom-4 right-4 z-30 w-11 h-11 rounded-full bg-background/90 backdrop-blur-sm shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-background opacity-80 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                      aria-label={`Voir ${item.title} en grand`}
                    >
                      <Maximize2 size={18} className="text-foreground" />
                    </button>
                  </DialogTrigger>
                  <DialogContent
                    className="!max-w-[95vw] w-[95vw] p-3 sm:p-4 gap-3 bg-background max-h-[92vh] overflow-y-auto"
                    showCloseButton
                  >
                    <DialogTitle className="text-base sm:text-lg font-semibold pr-8">
                      {item.title}
                    </DialogTitle>
                    <BeforeAfterSlider
                      beforeImage={item.imageBefore}
                      afterImage={item.imageAfter}
                      beforeAlt={item.altBefore}
                      afterAlt={item.altAfter}
                      containerClassName="h-[55vh] sm:h-[62vh] bg-black/5 rounded-lg"
                      imageFit="contain"
                    />
                    <div className="grid sm:grid-cols-2 gap-4 mt-1">
                      <div className="bg-muted/50 rounded-lg p-4 border border-border">
                        <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                          Avant
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {item.descriptionBefore}
                        </p>
                      </div>
                      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                        <p className="text-xs uppercase tracking-wider font-semibold text-primary mb-2">
                          Après
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {item.descriptionAfter}
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-foreground font-semibold mt-4 text-center text-lg">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
