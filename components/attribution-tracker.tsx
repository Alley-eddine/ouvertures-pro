"use client";

import { useEffect } from "react";
import { capturerProvenance } from "@/lib/attribution";

/**
 * Mémorise la provenance du visiteur dès la première page vue.
 * Rien à afficher : ce composant ne sert qu'à cet enregistrement.
 */
export function AttributionTracker() {
  useEffect(() => {
    capturerProvenance();
  }, []);

  return null;
}
