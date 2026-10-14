"use client";

import Script from "next/script";
import { useEffect } from "react";
import { EVENEMENT_CHOIX } from "@/lib/consentement";
import { GOOGLE_ADS_ID, LIBELLE_APPEL_SITE, NUMERO_SUIVI } from "@/lib/conversions";

/**
 * Balise Google Ads avec Consent Mode v2.
 *
 * Tout est refusé par défaut : sans accord, Google ne dépose aucun cookie et
 * ne reçoit que des signaux anonymes. Ne se charge pas du tout tant que
 * NEXT_PUBLIC_GOOGLE_ADS_ID n'est pas renseigné.
 */
export function GoogleTag() {
  useEffect(() => {
    if (!GOOGLE_ADS_ID) return;
    function auChoix(e: Event) {
      const accepte = (e as CustomEvent<{ publicite: boolean }>).detail?.publicite === true;
      const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
      g?.("consent", "update", etatConsentement(accepte));
    }
    window.addEventListener(EVENEMENT_CHOIX, auChoix);
    return () => window.removeEventListener(EVENEMENT_CHOIX, auChoix);
  }, []);

  if (!GOOGLE_ADS_ID) return null;

  const id = JSON.stringify(GOOGLE_ADS_ID);
  const appelSite = LIBELLE_APPEL_SITE
    ? `gtag('config', ${JSON.stringify(`${GOOGLE_ADS_ID}/${LIBELLE_APPEL_SITE}`)}, { phone_conversion_number: ${JSON.stringify(NUMERO_SUIVI)} });`
    : "";

  // Un seul script inline : les valeurs par défaut du Consent Mode doivent être
  // posées AVANT que gtag.js ne se charge, d'où l'insertion manuelle à la fin.
  const init = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('consent', 'default', {
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
      analytics_storage: 'denied', wait_for_update: 500
    });
    gtag('set', 'ads_data_redaction', true);
    gtag('set', 'url_passthrough', true);
    try {
      var c = JSON.parse(localStorage.getItem('op_consentement') || 'null');
      if (c && c.publicite === true && Date.now() - c.date < 15552000000) {
        gtag('consent', 'update', {
          ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted',
          analytics_storage: 'granted'
        });
      }
    } catch (e) {}
    gtag('js', new Date());
    gtag('config', ${id});
    ${appelSite}
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(${id});
    document.head.appendChild(s);
  `;

  return <Script id="google-ads" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: init }} />;
}

function etatConsentement(accepte: boolean) {
  const v = accepte ? "granted" : "denied";
  return { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v };
}
