"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUDGETS, CONNAISSANCES, MATERIAUX, MOTIVATIONS } from "@/lib/catalogue-projet";
import { cn } from "@/lib/utils";

type Option = { readonly value: string; readonly label: string };

/**
 * Quatre questions rapides posées sur la page de remerciement, une fois la
 * demande déjà enregistrée : on ne perd aucun lead, et les visiteurs répondent
 * plus volontiers une fois engagés qu'avant d'envoyer.
 */
export function QuestionsApresEnvoi({
  leadId,
  jeton,
  compact = false,
}: {
  leadId: string | null;
  jeton: string | null;
  compact?: boolean;
}) {
  const [motivations, setMotivations] = useState<string[]>([]);
  const [materiaux, setMateriaux] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [sourceDeclaree, setSourceDeclaree] = useState("");
  const [etat, setEtat] = useState<"questions" | "envoi" | "fini" | "ignore">("questions");

  if (!leadId || !jeton || etat === "ignore") return null;

  if (etat === "fini") {
    return (
      <p className="flex items-center justify-center gap-2 text-sm font-medium text-green-700">
        <CheckCircle className="h-4 w-4" aria-hidden />
        Merci, vos réponses ont été ajoutées à votre demande.
      </p>
    );
  }

  const rien = !motivations.length && !materiaux.length && !budget && !sourceDeclaree;

  async function envoyer() {
    setEtat("envoi");
    try {
      await fetch("/api/devis/complement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, jeton, motivations, materiaux, budget, sourceDeclaree }),
      });
    } catch {
      // Complément facultatif : la demande principale est déjà enregistrée.
    }
    setEtat("fini");
  }

  const bascule = (liste: string[], v: string) =>
    liste.includes(v) ? liste.filter((x) => x !== v) : [...liste, v];

  return (
    <div className={cn("rounded-lg border border-border bg-card text-left", compact ? "p-4" : "p-6")}>
      <p className={cn("font-semibold text-foreground", compact ? "text-base" : "text-lg")}>
        4 questions rapides pour préparer votre devis
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Facultatif : vos réponses nous permettent de vous rappeler avec une estimation déjà sérieuse.
      </p>

      <div className={cn("mt-5", compact ? "space-y-4" : "space-y-6")}>
        <Groupe
          id="apres-motivations"
          titre="Pourquoi souhaitez-vous faire ces travaux ?"
          aide="Plusieurs choix possibles"
          options={MOTIVATIONS}
          actif={(v) => motivations.includes(v)}
          onClic={(v) => setMotivations((m) => bascule(m, v))}
          compact={compact}
        />
        <Groupe
          id="apres-materiaux"
          titre="Quel matériau vous intéresse ?"
          aide="Plusieurs choix possibles"
          options={MATERIAUX}
          actif={(v) => materiaux.includes(v)}
          onClic={(v) => setMateriaux((m) => bascule(m, v))}
          compact={compact}
        />
        <Groupe
          id="apres-budget"
          titre="Budget approximatif pour l'ensemble du projet"
          options={BUDGETS}
          actif={(v) => budget === v}
          onClic={(v) => setBudget((b) => (b === v ? "" : v))}
          compact={compact}
        />
        <Groupe
          id="apres-connaissance"
          titre="Comment nous avez-vous connus ?"
          options={CONNAISSANCES}
          actif={(v) => sourceDeclaree === v}
          onClic={(v) => setSourceDeclaree((s) => (s === v ? "" : v))}
          compact={compact}
        />
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" onClick={() => setEtat("ignore")}>
          Non merci
        </Button>
        <Button
          type="button"
          onClick={envoyer}
          disabled={rien || etat === "envoi"}
          className="bg-primary text-white hover:bg-primary/90"
        >
          {etat === "envoi" ? "Envoi…" : "Envoyer mes réponses"}
        </Button>
      </div>
    </div>
  );
}

function Groupe({
  id,
  titre,
  aide,
  options,
  actif,
  onClic,
  compact,
}: {
  id: string;
  titre: string;
  aide?: string;
  options: readonly Option[];
  actif: (v: string) => boolean;
  onClic: (v: string) => void;
  compact: boolean;
}) {
  return (
    <div>
      <p id={`${id}-label`} className="text-sm font-medium text-foreground">
        {titre}
      </p>
      {aide && <p className="text-xs text-muted-foreground">{aide}</p>}
      <div role="group" aria-labelledby={`${id}-label`} className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = actif(o.value);
          return (
            <button
              key={o.value}
              id={`${id}-${o.value}`}
              type="button"
              aria-pressed={on}
              onClick={() => onClic(o.value)}
              className={cn(
                "rounded-lg border transition-colors",
                compact ? "px-2.5 py-1 text-xs" : "px-4 py-2 text-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                on
                  ? "border-primary bg-primary/10 font-medium text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
