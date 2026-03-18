import { DoorOpen, Fence, RollerCoaster, Wrench } from "lucide-react";

const services = [
  {
    icon: DoorOpen,
    title: "Fenêtres",
    description: "PVC, aluminium ou bois. Pose neuve ou rénovation complète de vos fenêtres.",
  },
  {
    icon: Fence,
    title: "Portes",
    description: "Portes d'entrée, portes de service et portes de garage sur mesure.",
  },
  {
    icon: RollerCoaster,
    title: "Volets",
    description: "Volets roulants, battants ou coulissants. Motorisation disponible.",
  },
  {
    icon: Wrench,
    title: "Réparation",
    description: "Intervention rapide pour réparation et dépannage d'urgence.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Nos Services Experts
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-lg text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary/10">
                <service.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
