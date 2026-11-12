"use client";

import type { DefaultCellComponentProps } from "payload";

/** Libellé d'une option de liste, tel qu'il est défini dans la collection. */
function libelleOption(field: DefaultCellComponentProps["field"], valeur: string): string {
  const options = "options" in field && Array.isArray(field.options) ? field.options : [];
  for (const option of options) {
    if (typeof option === "string") {
      if (option === valeur) return option;
    } else if (option.value === valeur) {
      return typeof option.label === "string" ? option.label : valeur;
    }
  }
  return valeur;
}

/** Statut du lead en pastille colorée : on repère d'un coup d'œil ce qui attend. */
export function CelluleStatut({ cellData, field }: DefaultCellComponentProps) {
  if (!cellData) return null;
  const valeur = String(cellData);
  return <span className={`op-pastille op-pastille--${valeur}`}>{libelleOption(field, valeur)}</span>;
}

/** « Hors zone » en badge orange ; rien quand le client est dans le rayon. */
export function CelluleHorsZone({ cellData }: DefaultCellComponentProps) {
  if (!cellData) return null;
  return <span className="op-pastille op-pastille--hors-zone">Hors zone</span>;
}

/** Canal d'arrivée ; Google Ads ressort, c'est la campagne qu'on suit. */
export function CelluleCanal({ cellData, field }: DefaultCellComponentProps) {
  if (!cellData) return <span className="op-vide">—</span>;
  const valeur = String(cellData);
  const classe = valeur === "google-ads" ? "op-pastille op-pastille--ads" : "op-canal";
  return <span className={classe}>{libelleOption(field, valeur)}</span>;
}

/** Téléphone cliquable : depuis le portable, un tap lance l'appel. */
export function CelluleTelephone({ cellData }: DefaultCellComponentProps) {
  if (!cellData) return null;
  const numero = String(cellData);
  return (
    <a className="op-tel" href={`tel:${numero.replace(/[^\d+]/g, "")}`} onClick={(e) => e.stopPropagation()}>
      {numero}
    </a>
  );
}
