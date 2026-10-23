import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "leads" ADD COLUMN "distance_km" numeric;
  ALTER TABLE "leads" ADD COLUMN "hors_zone" boolean;
  CREATE INDEX "leads_hors_zone_idx" ON "leads" USING btree ("hors_zone");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "leads_hors_zone_idx";
  ALTER TABLE "leads" DROP COLUMN "distance_km";
  ALTER TABLE "leads" DROP COLUMN "hors_zone";`)
}
