"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);

    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="accueil" className="relative h-screen overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        ref={heroRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
        style={{
          backgroundImage: "url('/images/hero-windows.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 transition-all duration-700 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-white/90 font-medium">Devis gratuit sous 24h</span>
            </div>

            <h1
              className={`text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 transition-all duration-700 delay-200 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span className="block">Ouvertures Pro :</span>
              <span className="text-gradient">{"L'Excellence"}</span>
              <span className="text-white">{" & La"}</span>
              <span className="block text-gradient">Qualité Durable.</span>
            </h1>

            <p
              className={`text-lg md:text-xl text-white/85 mb-10 leading-relaxed max-w-xl transition-all duration-700 delay-400 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Garantissez la sécurité et le confort de votre maison avec notre expertise reconnue.
              Fenêtres, portes et volets de qualité supérieure.
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
                { value: "4.9/5", label: "Avis clients" },
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
