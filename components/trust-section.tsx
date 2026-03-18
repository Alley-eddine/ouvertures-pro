import { CheckCircle, ShieldCheck, PhoneCall } from "lucide-react";

const trustItems = [
  {
    icon: CheckCircle,
    title: "Garantie Décennale",
    description: "Couverture complète de nos travaux pendant 10 ans.",
  },
  {
    icon: ShieldCheck,
    title: "Matériaux Certifiés",
    description: "Sélection rigoureuse de fournisseurs premium NF & CE.",
  },
  {
    icon: PhoneCall,
    title: "Suivi Digital de Chantier",
    description: "Photos et rapports d'avancement envoyés en temps réel.",
  },
];

export function TrustSection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
            Confiance & Qualité Artisanale
          </h2>
          <p className="text-secondary-foreground/80">
            Nous nous engageons sur chaque détail de votre chantier.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {trustItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <item.icon className="w-12 h-12 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-secondary-foreground/80 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
