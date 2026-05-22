"use client";

import Image from "next/image";
import { useState } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Expand } from "lucide-react";

type Photo = {
  src: string;
  alt: string;
  caption: string;
  category: "portail" | "store" | "porte" | "garage" | "fenetre" | "renovation";
};

const photos: Photo[] = [
  {
    src: "/images/galerie/renovation-maison-pierre-baies-vitrees-vert-menthe.webp",
    alt: "Rénovation maison en pierres avec baies vitrées en aluminium vert menthe et fenêtres triangulaires sous combles",
    caption: "Rénovation pierres + baies alu vert menthe",
    category: "renovation",
  },
  {
    src: "/images/galerie/portail-porte-garage-anthracite-camionnette-ouvertures-pro.webp",
    alt: "Portail coulissant et porte de garage aluminium anthracite avec camionnette Ouvertures Pro à côté",
    caption: "Portail + porte de garage anthracite, chantier Ouvertures Pro",
    category: "portail",
  },
  {
    src: "/images/galerie/porte-entree-vert-menthe-vitrage-fer-forge.webp",
    alt: "Porte d'entrée aluminium vert menthe avec vitrage décoratif en fer forgé sur encadrement pierre",
    caption: "Porte d'entrée vert menthe, vitrage fer forgé",
    category: "porte",
  },
  {
    src: "/images/galerie/renovation-maison-campagne-fenetres-vert-menthe.webp",
    alt: "Rénovation complète maison de campagne en pierres avec fenêtres et lucarnes en aluminium vert menthe",
    caption: "Rénovation maison de campagne, fenêtres alu vert menthe",
    category: "renovation",
  },
  {
    src: "/images/galerie/baie-vitree-triangulaire-aluminium-vert-menthe.webp",
    alt: "Baie vitrée triangulaire sur mesure et baie coulissante en aluminium vert menthe sur façade en pierres",
    caption: "Baie vitrée triangulaire sur mesure",
    category: "fenetre",
  },
  {
    src: "/images/galerie/portail-double-aluminium-anthracite-cloture.webp",
    alt: "Portail double battant aluminium anthracite avec clôture sur muret blanc",
    caption: "Portail double battant + clôture, aluminium anthracite",
    category: "portail",
  },
  {
    src: "/images/galerie/portail-portillon-aluminium-anthracite.webp",
    alt: "Portail battant et portillon aluminium anthracite, façade blanche",
    caption: "Ensemble portail + portillon aluminium anthracite",
    category: "portail",
  },
  {
    src: "/images/galerie/portillon-rouge-aluminium-lames-horizontales.webp",
    alt: "Portillon aluminium rouge bordeaux à lames horizontales sur passage pavé",
    caption: "Portillon aluminium rouge bordeaux",
    category: "portail",
  },
  {
    src: "/images/galerie/portail-aluminium-anthracite-pavillon.webp",
    alt: "Portail aluminium anthracite avec panneau de chantier Ouvertures Pro devant pavillon",
    caption: "Portail aluminium anthracite, pavillon",
    category: "portail",
  },
  {
    src: "/images/galerie/cloture-rigide-verte-jardin.webp",
    alt: "Clôture rigide verte le long d'une haie de bambous avec panneau Ouvertures Pro",
    caption: "Clôture rigide verte avec brise-vue",
    category: "portail",
  },
  {
    src: "/images/galerie/porte-entree-anthracite-vitrage-fer-forge-dore.webp",
    alt: "Porte d'entrée gris anthracite avec vitrage classique et grille en fer forgé doré",
    caption: "Porte d'entrée anthracite avec vitrage fer forgé",
    category: "porte",
  },
  {
    src: "/images/galerie/porte-fenetre-pvc-blanche-volets-battants.webp",
    alt: "Porte-fenêtre PVC blanche double vantail avec volets battants blancs assortis",
    caption: "Porte-fenêtre PVC + volets battants blancs",
    category: "fenetre",
  },
  {
    src: "/images/galerie/store-banne-balcon-architecture-moderne.webp",
    alt: "Store banne sur balcon contemporain avec garde-corps en verre et ciel bleu",
    caption: "Store banne sur balcon contemporain",
    category: "store",
  },
  {
    src: "/images/galerie/store-banne-rouge-balcon-aluminium.webp",
    alt: "Store banne rouge déployé sur balcon en aluminium avec ciel bleu",
    caption: "Store banne rouge sur balcon",
    category: "store",
  },
  {
    src: "/images/galerie/store-banne-led-terrasse-crepuscule.webp",
    alt: "Store banne avec éclairage LED intégré sur terrasse au crépuscule",
    caption: "Store banne avec LEDs intégrées",
    category: "store",
  },
  {
    src: "/images/galerie/porte-garage-battante-blanche-hublots.webp",
    alt: "Porte de garage battante blanche à trois vantaux avec hublots",
    caption: "Porte de garage battante 3 vantaux",
    category: "garage",
  },
  {
    src: "/images/galerie/porte-garage-sectionnelle-rouge.webp",
    alt: "Porte de garage sectionnelle aluminium rouge motorisée",
    caption: "Porte de garage sectionnelle rouge",
    category: "garage",
  },
];

export function GallerySection() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({ threshold: 0.05 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="galerie" className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div
          ref={titleRef}
          className={`text-center mb-16 ${titleVisible ? "animate-reveal-up" : "opacity-0"}`}
        >
          <p className="text-primary font-medium mb-2 uppercase tracking-wide text-sm">
            La galerie
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Plus de chantiers, plus de détails.
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Portails, stores, portes, fenêtres et clôtures — un aperçu de ce qu&apos;on pose au quotidien en Île-de-France.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
        >
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setOpenIndex(index)}
              className={`group relative aspect-square overflow-hidden rounded-xl bg-background border border-border hover:border-primary/30 transition-all duration-300 cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-muted ${
                gridVisible ? "animate-reveal-up" : "opacity-0"
              }`}
              style={gridVisible ? { animationDelay: `${index * 0.05}s` } : undefined}
              aria-label={`Agrandir ${photo.caption}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-white text-xs sm:text-sm font-medium leading-tight">
                  {photo.caption}
                </p>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Expand size={14} className="text-foreground" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog
        open={openIndex !== null}
        onOpenChange={(open) => !open && setOpenIndex(null)}
      >
        <DialogContent
          className="!max-w-[95vw] w-[95vw] p-3 sm:p-4 gap-2 bg-background max-h-[92vh]"
          showCloseButton
        >
          {openIndex !== null && (
            <>
              <DialogTitle className="text-base font-semibold pr-8">
                {photos[openIndex].caption}
              </DialogTitle>
              <div className="relative w-full h-[78vh] bg-black/5 rounded-lg overflow-hidden">
                <Image
                  src={photos[openIndex].src}
                  alt={photos[openIndex].alt}
                  fill
                  sizes="95vw"
                  className="object-contain"
                  priority
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
