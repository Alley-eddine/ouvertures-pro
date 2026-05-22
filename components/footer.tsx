import Image from "next/image";
import Link from "next/link";
import { Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Logo & Contact */}
          <div>
            <Image
              src="/images/logofinal.png"
              alt="Ouvertures Pro"
              width={140}
              height={50}
              className="mb-4 brightness-0 invert"
            />
            <p className="text-background/70 text-sm leading-relaxed">
              Cédric Tamoud et son équipe — artisans menuisiers à Lisses,
              au service de l&apos;Île-de-France depuis 2018.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="text-background/50">Tél:</span>{" "}
                <span className="text-background">01 60 86 37 54 / 07 71 74 20 83</span>
              </p>
              <p>
                <span className="text-background/50">Email:</span>{" "}
                <span className="text-background">contact@ouvertures-pro.fr</span>
              </p>
              <p>
                <span className="text-background/50">Adresse:</span>{" "}
                <span className="text-background">
                  22 bis rue des Malines, 91090 Lisses
                </span>
              </p>
              <p className="pt-2">
                <span className="text-background/50">Horaires:</span>{" "}
                <span className="text-background">Lun – Ven · 9h-12h / 14h-18h</span>
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-3 text-sm text-background/70">
              {[
                { href: "#accueil", label: "Accueil" },
                { href: "#realisations", label: "Réalisations" },
                { href: "#services", label: "Nos Services" },
                { href: "#equipe", label: "L'Équipe" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-background transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & CTA */}
          <div>
            <h4 className="font-semibold mb-4">Suivez-nous</h4>
            <div className="flex gap-3 mb-6">
              <Link
                href="https://www.facebook.com/ouverturespro?locale=fr_FR"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white w-full btn-shine">
              <Link href="/devis">Demander un Devis</Link>
            </Button>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/10 pt-8 text-center text-sm text-background/50">
          <p>
            © {new Date().getFullYear()} Ouvertures Pro. Tous droits réservés.{" "}
            <Link href="#" className="hover:text-background transition-colors">
              Mentions Légales
            </Link>{" "}
            |{" "}
            <Link href="#" className="hover:text-background transition-colors">
              Politique de Confidentialité
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
