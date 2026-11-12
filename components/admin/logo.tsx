// Balises <img> simples : ces composants sont rendus par l'admin Payload, pas par
// les pages du site, et des images statiques n'ont pas besoin de next/image.

/** Logo de la page de connexion de l'admin. */
export function Logo() {
  return <img src="/images/logofinal.png" alt="Ouvertures Pro" className="op-logo" width={260} height={121} />
}

/** Icône en haut du menu de l'admin : la maison du logo, sans le texte. */
export function Icone() {
  return <img src="/images/admin-icone.png" alt="Ouvertures Pro" className="op-icone" width={56} height={20} />
}
