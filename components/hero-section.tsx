"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);

    let rafId = 0;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(() => {
        if (heroRef.current) {
          heroRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section id="accueil" className="relative h-screen overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        ref={heroRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
        style={{
          backgroundImage: "url('/images/hero/realisation-baies-vitrees-terrasse-moderne.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center pt-24 md:pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1
              className={`text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 transition-all duration-700 delay-200 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span className="block">Fenêtres, portes,</span>
              <span className="block">volets <span className="text-primary">et portails.</span></span>
              <span className="block text-white/80 text-3xl md:text-4xl lg:text-5xl mt-2 font-semibold">Pose &amp; rénovation.</span>
            </h1>

            <p
              className={`text-lg md:text-xl text-white/85 mb-10 leading-relaxed max-w-xl transition-all duration-700 delay-400 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Cédric, Benjamin et Hervé — une équipe d&apos;artisans basée à Lisses (91).
              Depuis 2018, on pose et on rénove vos menuiseries dans toute l&apos;Île-de-France.
              Devis sous 24h, conseil sans baratin.
            </p>

            <div
              className={`flex flex-wrap gap-4 transition-all duration-700 ${
                loaded ? "opacity-100 translate-y-0 delay-500" : "opacity-0 translate-y-8"
              }`}
            >
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 text-base h-12 btn-shine"
              >
                <Link href="/devis">Demander Votre Devis Gratuit</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 text-base h-12"
              >
                <Link href="#realisations">Voir Nos Travaux</Link>
              </Button>
            </div>

            {/* Stats bar */}
            <div
              className={`flex gap-8 mt-12 pt-8 border-t border-white/15 transition-all duration-700 ${
                loaded ? "opacity-100 translate-y-0 delay-700" : "opacity-0 translate-y-8"
              }`}
            >
              {[
                { value: "500+", label: "Projets réalisés" },
                { value: "10 ans", label: "Garantie décennale" },
                { value: "4,8/5", label: "Avis Google" },
              ].map((stat) => (
                <div key={stat.label} className="text-white">
                  <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
