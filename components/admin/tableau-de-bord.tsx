import type { ServerProps, Where } from "payload";

/**
 * Tableau de bord en tête de l'admin : ce qui attend une action (demandes pas
 * encore rappelées, devis sans réponse) et ce que le site a rapporté ce mois-ci.
 *
 * Les dates sont calculées à l'heure de Paris : le serveur tourne en UTC, et
 * une demande reçue le 1er à 0 h 30 appartient bien au nouveau mois.
 */

const FUSEAU = "Europe/Paris";
const RETARD_RAPPEL_H = 24;

const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const dateCourte = new Intl.DateTimeFormat("fr-FR", {
  timeZone: FUSEAU,
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});
const nomDuMois = new Intl.DateTimeFormat("fr-FR", { timeZone: FUSEAU, month: "long" });

/** Minuit à Paris pour une date du calendrier parisien, en instant UTC. */
function minuitParis(annee: number, mois: number, jour: number): Date {
  const minuitUtc = Date.UTC(annee, mois, jour);
  const heureParis = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: FUSEAU, hour: "2-digit", hourCycle: "h23" }).format(minuitUtc),
  );
  return new Date(minuitUtc - heureParis * 3_600_000);
}

function reperes(maintenant: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: FUSEAU,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    })
      .formatToParts(maintenant)
      .map((p) => [p.type, p.value]),
  );
  const annee = Number(parts.year);
  const mois = Number(parts.month) - 1;
  const jour = Number(parts.day);
  const decalageLundi = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(parts.weekday);
  return {
    debutMois: minuitParis(annee, mois, 1),
    debutSemaine: minuitParis(annee, mois, jour - decalageLundi),
  };
}

function libelleCanal(options: unknown, valeur: string | null | undefined): string {
  if (!valeur) return "Non renseigné";
  if (Array.isArray(options)) {
    for (const option of options) {
      if (typeof option === "object" && option && "value" in option && option.value === valeur) {
        return typeof option.label === "string" ? option.label : valeur;
      }
    }
  }
  return valeur;
}

const LISTE = "/admin/collections/leads";
const filtre = (where: string) => `${LISTE}?${where}`;

export async function TableauDeBord({ payload, user }: ServerProps) {
  if (!user) return null;

  const maintenant = new Date();
  const { debutMois, debutSemaine } = reperes(maintenant);
  const horsSpam: Where = { status: { not_equals: "spam" } };

  const [ceMois, cetteSemaine, aRappeler, devisEnAttente, signesMois, signesTotal, clicsAppel] = await Promise.all([
    payload.find({
      collection: "leads",
      where: { and: [horsSpam, { submittedAt: { greater_than_equal: debutMois.toISOString() } }] },
      select: { sourceKey: true },
      pagination: false,
      depth: 0,
    }),
    payload.count({
      collection: "leads",
      where: { and: [horsSpam, { submittedAt: { greater_than_equal: debutSemaine.toISOString() } }] },
    }),
    payload.find({
      collection: "leads",
      where: { status: { equals: "new" } },
      sort: "submittedAt",
      limit: 5,
      depth: 0,
      select: { nomComplet: true, firstName: true, city: true, phone: true, submittedAt: true, horsZone: true },
    }),
    payload.count({ collection: "leads", where: { status: { equals: "quoted" } } }),
    payload.find({
      collection: "leads",
      where: { and: [{ status: { equals: "won" } }, { dateSignature: { greater_than_equal: debutMois.toISOString() } }] },
      select: { montantSigne: true },
      pagination: false,
      depth: 0,
    }),
    payload.find({
      collection: "leads",
      where: { status: { equals: "won" } },
      select: { montantSigne: true },
      pagination: false,
      depth: 0,
    }),
    payload.count({ collection: "appels", where: { cliqueLe: { greater_than_equal: debutMois.toISOString() } } }),
  ]);

  const champCanal = payload.collections.leads.config.flattenedFields.find((f) => f.name === "sourceKey");
  const optionsCanal = champCanal && "options" in champCanal ? champCanal.options : [];
  const parCanal = new Map<string, number>();
  for (const lead of ceMois.docs) {
    const cle = lead.sourceKey ?? "";
    parCanal.set(cle, (parCanal.get(cle) ?? 0) + 1);
  }
  const canaux = [...parCanal.entries()].sort((a, b) => b[1] - a[1]);
  const maxCanal = Math.max(1, ...canaux.map(([, n]) => n));

  const somme = (docs: { montantSigne?: number | null }[]) => docs.reduce((t, d) => t + (d.montantSigne ?? 0), 0);
  const montantMois = somme(signesMois.docs);
  const montantTotal = somme(signesTotal.docs);
  const mois = nomDuMois.format(maintenant);
  const prenom = typeof user.name === "string" ? user.name.split(" ")[0] : "";

  return (
    <section className="op-tdb" aria-label="Tableau de bord">
      <header className="op-tdb__entete">
        <h2>{prenom ? `Bonjour ${prenom}` : "Bonjour"}</h2>
        <p>Les demandes reçues par le site et leur suivi.</p>
      </header>

      <div className="op-tdb__chiffres">
        <a className="op-carte op-carte--alerte" data-vide={aRappeler.totalDocs === 0} href={filtre("where[status][equals]=new")}>
          <span className="op-carte__valeur">{aRappeler.totalDocs}</span>
          <span className="op-carte__libelle">
            {aRappeler.totalDocs > 1 ? "demandes à rappeler" : "demande à rappeler"}
          </span>
        </a>
        <a className="op-carte" href={filtre("where[status][equals]=quoted")}>
          <span className="op-carte__valeur">{devisEnAttente.totalDocs}</span>
          <span className="op-carte__libelle">devis en attente de réponse</span>
        </a>
        <div className="op-carte">
          <span className="op-carte__valeur">{ceMois.docs.length}</span>
          <span className="op-carte__libelle">
            {ceMois.docs.length > 1 ? "demandes" : "demande"} en {mois} · {cetteSemaine.totalDocs} cette semaine
          </span>
        </div>
        <a className="op-carte op-carte--gain" href={filtre("where[status][equals]=won")}>
          <span className="op-carte__valeur">{euros.format(montantMois)}</span>
          <span className="op-carte__libelle">
            signés en {mois} ({signesMois.docs.length}) · {euros.format(montantTotal)} au total
          </span>
        </a>
      </div>

      <div className="op-tdb__colonnes">
        <div className="op-bloc">
          <h3>À rappeler en priorité</h3>
          {aRappeler.docs.length === 0 ? (
            <p className="op-bloc__vide">Tout le monde a été rappelé.</p>
          ) : (
            <ul className="op-rappels">
              {aRappeler.docs.map((lead) => {
                const recu = lead.submittedAt ? new Date(lead.submittedAt) : null;
                const enRetard = recu ? maintenant.getTime() - recu.getTime() > RETARD_RAPPEL_H * 3_600_000 : false;
                return (
                  <li key={lead.id} className={enRetard ? "op-rappels__ligne op-rappels__ligne--retard" : "op-rappels__ligne"}>
                    <a href={`${LISTE}/${lead.id}`} className="op-rappels__nom">
                      {lead.nomComplet || lead.firstName || "Sans nom"}
                      {lead.city ? <span className="op-rappels__ville"> · {lead.city}</span> : null}
                      {lead.horsZone ? <span className="op-pastille op-pastille--hors-zone">Hors zone</span> : null}
                    </a>
                    <span className="op-rappels__date">{recu ? dateCourte.format(recu) : ""}</span>
                    {lead.phone ? (
                      <a className="op-tel" href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}>
                        {lead.phone}
                      </a>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
          {aRappeler.totalDocs > aRappeler.docs.length ? (
            <a className="op-bloc__lien" href={filtre("where[status][equals]=new")}>
              Voir les {aRappeler.totalDocs} demandes
            </a>
          ) : null}
        </div>

        <div className="op-bloc">
          <h3>D’où viennent les demandes en {mois}</h3>
          {canaux.length === 0 ? (
            <p className="op-bloc__vide">Pas encore de demande ce mois-ci.</p>
          ) : (
            <ul className="op-canaux">
              {canaux.map(([cle, n]) => (
                <li key={cle || "vide"}>
                  <span className="op-canaux__nom">{libelleCanal(optionsCanal, cle)}</span>
                  <span className="op-canaux__barre">
                    <span
                      className={cle === "google-ads" ? "op-canaux__plein op-canaux__plein--ads" : "op-canaux__plein"}
                      style={{ width: `${(n / maxCanal) * 100}%` }}
                    />
                  </span>
                  <span className="op-canaux__nombre">{n}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="op-bloc__note">
            {clicsAppel.totalDocs} {clicsAppel.totalDocs > 1 ? "clics" : "clic"} sur un numéro ou WhatsApp en {mois}. Un client qui appelle se
            saisit à la main avec le canal « Appel depuis le site ».
          </p>
        </div>
      </div>
    </section>
  );
}
