import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, MapPin, Phone, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { PAGES_METIER, pageMetier } from "@/lib/pages-metier";
import { RAYON_DEPANNAGE_KM, TEXTE_ZONE, TEXTE_ZONE_DEPANNAGE } from "@/lib/zone";

const SITE_URL = "https://ouverture-pro.fr";
const TEL = { affiche: "01 60 86 37 54", lien: "tel:+33160863754" };

export function generateStaticParams() {
  return PAGES_METIER.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = pageMetier((await params).slug);
  if (!page) return {};
  return {
    title: page.metaTitre,
    description: page.metaDescription,
    alternates: { canonical: `/services/${page.slug}` },
    openGraph: { title: page.metaTitre, description: page.metaDescription, url: `/services/${page.slug}` },
  };
}

export default async function PageService({ params }: { params: Promise<{ slug: string }> }) {
  const page = pageMetier((await params).slug);
  if (!page) notFound();

  const lienDevis = `/devis?services=${page.services.join(",")}`;
  const zone = page.depannage ? TEXTE_ZONE_DEPANNAGE : TEXTE_ZONE;

  const fil = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: page.nom, item: `${SITE_URL}/services/${page.slug}` },
    ],
  };

  const boutonDevis = (
    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
      <Link href={lienDevis}>Demander un devis</Link>
    </Button>
  );
  const boutonAppel = (variante: "clair" | "sombre") => (
    <Button
      asChild
      size="lg"
      variant="outline"
      className={
        variante === "sombre"
          ? "border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background"
          : ""
      }
    >
      <a href={TEL.lien}>
        <Phone className="w-4 h-4" aria-hidden />
        {TEL.affiche}
      </a>
    </Button>
  );

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(fil) }} />

      <header className="bg-foreground py-4">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <Link href="/">
            <Image
              src="/images/logofinal.png"
              alt="Ouvertures Pro"
              width={140}
              height={50}
              priority
              style={{ height: "auto" }}
              className="brightness-0 invert"
            />
          </Link>
          <Button variant="ghost" asChild className="text-background hover:text-background/80">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" aria-hidden />
              Accueil
            </Link>
          </Button>
        </div>
      </header>

      <main>
        {/* En-tête */}
        <section className="bg-foreground text-background pb-14 pt-10">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">{page.h1}</h1>
            <p className="mt-5 text-lg text-background/80 leading-relaxed max-w-2xl">{page.intro}</p>
            <p className="mt-5 flex items-start gap-2 text-sm text-background/70">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
              <span>Artisans basés à Lisses (91) depuis 2018. {zone}</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {page.depannage ? (
                <>
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
                    <a href={TEL.lien}>
                      <Phone className="w-4 h-4" aria-hidden />
                      Appeler le {TEL.affiche}
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background"
                  >
                    <Link href={lienDevis}>Décrire la panne par écrit</Link>
                  </Button>
                </>
              ) : (
                <>
                  {boutonDevis}
                  {boutonAppel("sombre")}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Prestations */}
        <section className="py-14">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {page.depannage ? "Les pannes qu'on règle" : "Ce qu'on pose chez vous"}
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {page.prestations.map((p) => (
                <li key={p} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                  <Check className="w-5 h-5 mt-0.5 shrink-0 text-primary" aria-hidden />
                  <span className="text-foreground">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Réalisations */}
        {(page.avantApres.length > 0 || page.photos.length > 0) && (
          <section className="py-14 bg-muted">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Nos réalisations</h2>
              <div className="mt-8 space-y-8">
                {page.avantApres.map((r) => (
                  <figure key={r.titre}>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      {[
                        { photo: r.avant, etiquette: "Avant" },
                        { photo: r.apres, etiquette: "Après" },
                      ].map(({ photo, etiquette }) => (
                        <div key={etiquette} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-background">
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            sizes="(max-width: 1024px) 50vw, 480px"
                            className="object-cover"
                          />
                          <span className="absolute left-2 top-2 rounded bg-foreground/80 px-2 py-0.5 text-xs font-semibold text-background">
                            {etiquette}
                          </span>
                        </div>
                      ))}
                    </div>
                    <figcaption className="mt-2 text-sm font-medium text-foreground">{r.titre}</figcaption>
                  </figure>
                ))}
                {page.photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
                    {page.photos.map((p) => (
                      <div key={p.src} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-background">
                        <Image src={p.src} alt={p.alt} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Déroulé */}
        <section className="py-14">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Comment ça se passe</h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-2">
              {page.etapes.map((e, i) => (
                <li key={e.titre} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{e.titre}</p>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{e.texte}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Avis */}
        <section className="py-14 bg-muted">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Ils nous ont fait confiance</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {page.avis.map((a) => (
                <blockquote key={a.auteur} className="rounded-lg border border-border bg-card p-5">
                  <Quote className="w-5 h-5 text-primary" aria-hidden />
                  <p className="mt-3 text-foreground leading-relaxed">{a.texte}</p>
                  <footer className="mt-3 text-sm text-muted-foreground">{a.auteur}, avis Google</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Questions fréquentes</h2>
            <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-card">
              {page.faq.map((f) => (
                <details key={f.q} className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden className="text-muted-foreground transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{f.r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Appel à l'action */}
        <section className="bg-foreground py-14 text-background">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold">
              {page.depannage ? "Un volet en panne ?" : "Un projet ? Parlons-en."}
            </h2>
            <p className="mt-3 text-background/75">
              {page.depannage
                ? `Appelez-nous du lundi au vendredi, de 9 h à 12 h et de 14 h à 18 h. Dépannage dans un rayon de ${RAYON_DEPANNAGE_KM} km autour de Lisses.`
                : `Réponse sous 24 h. ${TEXTE_ZONE}`}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {page.depannage ? (
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  <a href={TEL.lien}>
                    <Phone className="w-4 h-4" aria-hidden />
                    Appeler le {TEL.affiche}
                  </a>
                </Button>
              ) : (
                <>
                  {boutonDevis}
                  {boutonAppel("sombre")}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Autres métiers */}
        <nav aria-label="Nos autres métiers" className="py-10">
          <div className="container mx-auto px-4 max-w-4xl">
            <p className="text-sm font-medium text-muted-foreground">Nos autres métiers</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {PAGES_METIER.filter((p) => p.slug !== page.slug).map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/services/${p.slug}`}
                    className="inline-block rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:border-primary/40 hover:text-primary"
                  >
                    {p.nom}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
