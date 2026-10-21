import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_leads_source_key" ADD VALUE 'appel-site' BEFORE 'bouche-a-oreille';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "leads" ALTER COLUMN "source_key" SET DATA TYPE text;
  DROP TYPE "public"."enum_leads_source_key";
  CREATE TYPE "public"."enum_leads_source_key" AS ENUM('google-ads', 'gbp', 'seo', 'social', 'ia', 'referent', 'campagne', 'direct', 'bouche-a-oreille');
  ALTER TABLE "leads" ALTER COLUMN "source_key" SET DATA TYPE "public"."enum_leads_source_key" USING "source_key"::"public"."enum_leads_source_key";`)
}
