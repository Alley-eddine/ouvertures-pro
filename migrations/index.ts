import * as migration_20261014_100909_initial from './20261014_100909_initial';

export const migrations = [
  {
    up: migration_20261014_100909_initial.up,
    down: migration_20261014_100909_initial.down,
    name: '20261014_100909_initial'
  },
];
