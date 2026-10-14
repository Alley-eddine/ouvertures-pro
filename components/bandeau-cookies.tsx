"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EVENEMENT_OUVRIR, enregistrerChoix, lireChoix } from "@/lib/consentement";
import { GOOGLE_ADS_ID } from "@/lib/conversions";

/**
 * Bandeau de consentement, conforme aux lignes directrices de la CNIL :
 * - rien n'est déposé avant le choix ;
 * - « Tout refuser » est aussi visible et aussi simple que « Tout accepter » ;
 * - le bandeau ne bloque pas la navigation (pas de « mur de cookies ») ;
 * - le choix se modifie à tout moment via « Gérer les cookies ».
 *
 * Il n'apparaît que si la balise Google Ads est active : sans cookie
 * publicitaire, il n'y a rien à demander.
 */
export function BandeauCookies() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!GOOGLE_ADS_ID) return;
    if (!lireChoix()) setVisible(true);
    const ouvrir = () => setVisible(true);
    window.addEventListener(EVENEMENT_OUVRIR, ouvrir);
    return () => window.removeEventListener(EVENEMENT_OUVRIR, ouvrir);
  }, []);

  if (!visible) return null;

  function choisir(publicite: boolean) {
    enregistrerChoix(publicite);
    setVisible(false);
  }

  const bouton =
    "flex-1 h-11 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground " +
    "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

  return (
    <div
      role="dialog"
      aria-labelledby="cookies-titre"
      aria-describedby="cookies-texte"
      className="fixed inset-x-3 z-[60] md:inset-x-auto md:right-4 md:max-w-md bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:bottom-4 rounded-xl border border-border bg-background p-5 shadow-xl"
    >
      <p id="cookies-titre" className="font-semibold text-foreground">
        Cookies publicitaires
      </p>
      <p id="cookies-texte" className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Avec votre accord, nous utilisons des cookies Google Ads pour mesurer l&apos;efficacité de nos
        annonces. Ils ne servent pas à autre chose et ne sont déposés que si vous acceptez. Vous pouvez
        changer d&apos;avis à tout moment depuis le pied de page.{" "}
        <Link href="/politique-confidentialite" className="underline underline-offset-2 hover:text-foreground">
          En savoir plus
        </Link>
      </p>
      <div className="mt-4 flex gap-2">
        <button type="button" className={bouton} onClick={() => choisir(false)}>
          Tout refuser
        </button>
        <button type="button" className={bouton} onClick={() => choisir(true)}>
          Tout accepter
        </button>
      </div>
    </div>
  );
}
