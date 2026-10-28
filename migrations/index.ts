import * as migration_20261014_100909_initial from './20261014_100909_initial';
import * as migration_20261014_132509_appels_et_saisie_manuelle from './20261014_132509_appels_et_saisie_manuelle';
import * as migration_20261021_154754_qualification_rdv from './20261021_154754_qualification_rdv';
import * as migration_20261021_165603_canal_appel_site from './20261021_165603_canal_appel_site';
import * as migration_20261023_091624_zone_hors_zone from './20261023_091624_zone_hors_zone';
import * as migration_20261028_101927_depannage_hors_zone from './20261028_101927_depannage_hors_zone';

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
    name: '20261021_165603_canal_appel_site',
  },
  {
    up: migration_20261023_091624_zone_hors_zone.up,
    down: migration_20261023_091624_zone_hors_zone.down,
    name: '20261023_091624_zone_hors_zone',
  },
  {
    up: migration_20261028_101927_depannage_hors_zone.up,
    down: migration_20261028_101927_depannage_hors_zone.down,
    name: '20261028_101927_depannage_hors_zone'
  },
];
