import * as migration_20261014_100909_initial from './20261014_100909_initial';
import * as migration_20261014_132509_appels_et_saisie_manuelle from './20261014_132509_appels_et_saisie_manuelle';
import * as migration_20261021_154754_qualification_rdv from './20261021_154754_qualification_rdv';
import * as migration_20261021_165603_canal_appel_site from './20261021_165603_canal_appel_site';

export const migrations = [
  {
    up: migration_20261014_100909_initial.up,
    down: migration_20261014_100909_initial.down,
    name: '20261014_100909_initial',
  },
  {
    up: migration_20261014_132509_appels_et_saisie_manuelle.up,
    down: migration_20261014_132509_appels_et_saisie_manuelle.down,
    name: '20261014_132509_appels_et_saisie_manuelle',
  },
  {
    up: migration_20261021_154754_qualification_rdv.up,
    down: migration_20261021_154754_qualification_rdv.down,
    name: '20261021_154754_qualification_rdv',
  },
  {
    up: migration_20261021_165603_canal_appel_site.up,
    down: migration_20261021_165603_canal_appel_site.down,
    name: '20261021_165603_canal_appel_site'
  },
];
