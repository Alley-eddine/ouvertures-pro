import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";

export function LegalLayout({
  title,
  children,
  updatedAt,
}: {
  title: string;
  children: React.ReactNode;
  updatedAt: string;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-foreground py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
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
          <Button
            variant="ghost"
            asChild
            className="text-background hover:text-background/80"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-16">
        <article className="container mx-auto px-4 max-w-3xl">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">
              Dernière mise à jour : {updatedAt}
            </p>
          </header>

          <div className="prose-legal space-y-8 text-foreground leading-relaxed">
            {children}
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <Button asChild variant="outline">
              <Link href="/" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour à l&apos;accueil
              </Link>
            </Button>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
        {title}
      </h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}

export function LegalRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-1">
      <span className="text-foreground/60 sm:min-w-[180px] text-sm">
        {label}
      </span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}
