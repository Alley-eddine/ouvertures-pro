"use client";

import { useEffect } from "react";
import {
  appliquerConsentementProvenance,
  capturerProvenance,
  provenancePourEnvoi,
} from "@/lib/attribution";
import { EVENEMENT_CHOIX } from "@/lib/consentement";
import { signalerConversion } from "@/lib/conversions";

function typeDeLien(href: string): "telephone" | "whatsapp" | null {
  if (href.startsWith("tel:")) return "telephone";
  if (/(^https?:\/\/)?(wa\.me|api\.whatsapp\.com)\//i.test(href)) return "whatsapp";
  return null;
}

/**
 * Mémorise la provenance du visiteur dès la première page vue, puis signale
 * chaque tap sur un numéro ou sur WhatsApp, où qu'il se trouve sur le site.
 * Rien à afficher : ce composant ne sert qu'au suivi.
 */
export function AttributionTracker() {
  useEffect(() => {
    capturerProvenance();

    function auClic(e: MouseEvent) {
      const lien = (e.target as Element | null)?.closest?.("a[href]");
      if (!lien) return;
      const href = lien.getAttribute("href") ?? "";
      const type = typeDeLien(href);
      if (!type) return;

      signalerConversion(type === "telephone" ? "appel" : "whatsapp");

      const corps = JSON.stringify({
        type,
        numero:
          type === "telephone"
            ? href.slice(4)
            : href.match(/(?:wa\.me|phone=)\/?(\+?\d+)/)?.[1] ?? undefined,
        page: window.location.pathname,
        provenance: provenancePourEnvoi(),
      });

      // sendBeacon survit à la sortie de page vers l'appli Téléphone.
      try {
        const envoye = navigator.sendBeacon?.(
          "/api/clic-appel",
          new Blob([corps], { type: "application/json" })
        );
        if (!envoye) {
          void fetch("/api/clic-appel", { method: "POST", body: corps, keepalive: true });
        }
      } catch {
        // Le suivi ne doit jamais empêcher l'appel.
      }
    }

    function auChoix(e: Event) {
      appliquerConsentementProvenance((e as CustomEvent<{ publicite: boolean }>).detail?.publicite === true);
    }

    document.addEventListener("click", auClic, { capture: true });
    window.addEventListener(EVENEMENT_CHOIX, auChoix);
    return () => {
      document.removeEventListener("click", auClic, { capture: true });
      window.removeEventListener(EVENEMENT_CHOIX, auChoix);
    };
  }, []);

  return null;
}
