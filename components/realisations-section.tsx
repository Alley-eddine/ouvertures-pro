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
  beforeLabel?: string;
  afterLabel?: string;
  containerClassName?: string;
  imageFit?: "cover" | "contain";
}

function BeforeAfterSlider({
  beforeImage,
  afterImage,
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
        alt="Après travaux"
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
          alt="Avant travaux"
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

const realisations = Array.from({ length: 12 }, (_, i) => {
  const n = i + 1;
  return {
    id: n,
    title: `Réalisation N°${n}`,
    imageBefore: `/images/realisations/avant-apres/${n}avant.webp`,
    imageAfter: `/images/realisations/avant-apres/${n}apres.webp`,
  };
});

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
                    className="!max-w-[95vw] w-[95vw] p-3 sm:p-4 gap-2 bg-background"
                    showCloseButton
                  >
                    <DialogTitle className="text-base font-semibold pr-8">
                      {item.title}
                    </DialogTitle>
                    <BeforeAfterSlider
                      beforeImage={item.imageBefore}
                      afterImage={item.imageAfter}
                      containerClassName="h-[78vh] bg-black/5 rounded-lg"
                      imageFit="contain"
                    />
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
