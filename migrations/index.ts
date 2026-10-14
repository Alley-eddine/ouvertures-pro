import * as migration_20261014_100909_initial from './20261014_100909_initial';
import * as migration_20261014_132509_appels_et_saisie_manuelle from './20261014_132509_appels_et_saisie_manuelle';

export const migrations = [
  {
    up: migration_20261014_100909_initial.up,
    down: migration_20261014_100909_initial.down,
    name: '20261014_100909_initial',
  },
  {
    up: migration_20261014_132509_appels_et_saisie_manuelle.up,
    down: migration_20261014_132509_appels_et_saisie_manuelle.down,
    name: '20261014_132509_appels_et_saisie_manuelle'
  },
];
