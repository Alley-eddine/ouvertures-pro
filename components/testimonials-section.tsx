import { Star } from "lucide-react";

const testimonials = [
  {
    content:
      "Un travail de grande qualité pour notre changement de fenêtres à Meudon. Équipe ponctuelle et chantier très propre.",
    author: "Jean-Pierre M.",
    rating: 5,
  },
  {
    content:
      "Très réactifs suite à une tempête. L'installation des volets nous fait déjà économiser sur le chauffage.",
    author: "Marie L.",
    rating: 5,
  },
  {
    content:
      "Le suivi photo via WhatsApp est génial pour voir l'avancée quand on n'est pas sur place. Je recommande !",
    author: "Robert D.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Témoignages Clients
          </h2>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-primary text-primary" />
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg shadow-sm border border-border"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>
              <p className="font-semibold text-foreground">
                - {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
