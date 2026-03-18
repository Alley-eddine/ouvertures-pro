import Image from "next/image";
import Link from "next/link";
import { Facebook, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0VhliwWw6iRTujO0oxZr9gs8uk9Fou.png"
              alt="Ouvertures Pro"
              width={140}
              height={50}
              className="mb-4 brightness-0 invert"
            />
            <p className="text-background/70 text-sm leading-relaxed">
              Votre artisan de confiance pour tous travaux de fenêtres, portes et 
              volets dans toute la région.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="text-background/50">Tél:</span>{" "}
                <span className="text-background">01 23 45 67 89</span>
              </p>
              <p>
                <span className="text-background/50">Email:</span>{" "}
                <span className="text-background">contact@ouvertures-pro.fr</span>
              </p>
              <p>
                <span className="text-background/50">Adresse:</span>{" "}
                <span className="text-background">
                  123 Rue de l&apos;Artisanat, 78000 Versailles
                </span>
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <Link href="#accueil" className="hover:text-background transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="#realisations" className="hover:text-background transition-colors">
                  Réalisations
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-background transition-colors">
                  Nos Services
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-background transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Nos Services</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>Fenêtres PVC</li>
              <li>Fenêtres Aluminium</li>
              <li>Portes d&apos;entrée</li>
              <li>Volets roulants</li>
              <li>Réparation & Dépannage</li>
            </ul>
          </div>

          {/* Social & CTA */}
          <div>
            <h4 className="font-semibold mb-4">Suivez-nous</h4>
            <div className="flex gap-3 mb-6">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white w-full">
              <Link href="/devis">Nous Contacter</Link>
            </Button>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/10 pt-8 text-center text-sm text-background/50">
          <p>
            © {new Date().getFullYear()} Ouvertures Pro. Tous droits réservés.{" "}
            <Link href="#" className="hover:text-background">
              Mentions Légales
            </Link>{" "}
            |{" "}
            <Link href="#" className="hover:text-background">
              Politique de Confidentialité
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
