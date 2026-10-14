"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, MessageCircle, Phone } from "lucide-react";

// Le numéro publié sur la fiche Google : celui que Cédric décroche sur chantier.
const TEL_HREF = "tel:+33771742083";
const WHATSAPP_HREF = `https://wa.me/33771742083?text=${encodeURIComponent(
  "Bonjour, je souhaite obtenir des informations sur vos services."
)}`;

/**
 * Barre d'action fixée en bas de l'écran, sur mobile uniquement.
 * Sur téléphone, appeler doit rester à un pouce de distance pendant toute la
 * lecture : c'est le premier canal de contact pour un artisan.
 */
export function BarreAppelMobile() {
  const pathname = usePathname();
  const surDevis = pathname?.startsWith("/devis");

  return (
    <>
      {/* Réserve la hauteur de la barre pour que le pied de page reste lisible. */}
      <div aria-hidden className="h-16 md:hidden" style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }} />
      <nav
        aria-label="Nous contacter"
        className="fixed inset-x-0 bottom-0 z-50 md:hidden border-t border-border bg-background/95 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex gap-2 px-3 py-2">
          <a
            href={TEL_HREF}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary h-12 text-sm font-semibold text-white active:bg-primary/90"
          >
            <Phone className="w-4 h-4" aria-hidden />
            Appeler
          </a>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border h-12 text-sm font-medium text-foreground active:bg-muted"
          >
            <MessageCircle className="w-4 h-4" aria-hidden />
            WhatsApp
          </a>
          {!surDevis && (
            <Link
              href="/devis"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border h-12 text-sm font-medium text-foreground active:bg-muted"
            >
              <FileText className="w-4 h-4" aria-hidden />
              Devis
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
