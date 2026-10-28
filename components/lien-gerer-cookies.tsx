"use client";

import { ouvrirChoixCookies } from "@/lib/consentement";
import { GOOGLE_ADS_ID } from "@/lib/conversions";

/** Rouvre le bandeau de consentement. Masqué si aucun cookie publicitaire n'est utilisé. */
export function LienGererCookies({ className }: { className?: string }) {
  if (!GOOGLE_ADS_ID) return null;
  return (
    <>
      {" | "}
      <button type="button" onClick={ouvrirChoixCookies} className={className}>
        Gérer les cookies
      </button>
    </>
  );
}
