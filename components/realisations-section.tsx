"use client";

import Image from "next/image";

const realisations = [
  {
    id: 1,
    title: "Installation fenêtres PVC à Paris",
    imageBefore: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    imageAfter: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Porte d'entrée aluminium moderne",
    imageBefore: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    imageAfter: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Volets roulants électriques",
    imageBefore: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
    imageAfter: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Baie vitrée coulissante",
    imageBefore: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    imageAfter: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop",
  },
];

export function RealisationsSection() {
  return (
    <section id="realisations" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2 uppercase tracking-wide text-sm">
            La preuve par l&apos;image
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Nos Réalisations Avant / Après
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {realisations.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex">
                <div className="relative w-1/2">
                  <div className="absolute top-2 left-2 bg-foreground/80 text-white text-xs px-2 py-1 rounded z-10">
                    AVANT
                  </div>
                  <Image
                    src={item.imageBefore}
                    alt={`Avant - ${item.title}`}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="relative w-1/2">
                  <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded z-10">
                    APRÈS
                  </div>
                  <Image
                    src={item.imageAfter}
                    alt={`Après - ${item.title}`}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-medium text-foreground">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
