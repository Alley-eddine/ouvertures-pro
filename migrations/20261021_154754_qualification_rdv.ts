import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_leads_motivations" AS ENUM('thermique', 'phonique', 'securite', 'esthetique', 'panne');
  CREATE TYPE "public"."enum_leads_materiaux" AS ENUM('pvc', 'aluminium', 'bois', 'mixte', 'acier', 'conseil');
  CREATE TYPE "public"."enum_leads_source_declaree" AS ENUM('recherche-google', 'google-maps', 'recommandation', 'reseaux-sociaux', 'chantier-vehicule', 'deja-client', 'autre');
  CREATE TABLE "leads_motivations" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_leads_motivations",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "leads_materiaux" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_leads_materiaux",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "leads_services" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_leads_services";
  CREATE TYPE "public"."enum_leads_services" AS ENUM('fenetres', 'fenetres-toit', 'portes-entree', 'portes-blindees', 'volets-roulants', 'volets-battants', 'persiennes', 'portes-garage', 'portail', 'portillon', 'cloture', 'verriere-interieur', 'verriere-exterieur', 'verriere-toit', 'automatisme', 'alarme', 'reparation');
  ALTER TABLE "leads_services" ALTER COLUMN "value" SET DATA TYPE "public"."enum_leads_services" USING "value"::"public"."enum_leads_services";
  ALTER TABLE "leads" ADD COLUMN "source_declaree" "enum_leads_source_declaree";
  ALTER TABLE "leads" ADD COLUMN "source_declaree_detail" varchar;
  ALTER TABLE "leads_motivations" ADD CONSTRAINT "leads_motivations_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_materiaux" ADD CONSTRAINT "leads_materiaux_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "leads_motivations_order_idx" ON "leads_motivations" USING btree ("order");
  CREATE INDEX "leads_motivations_parent_idx" ON "leads_motivations" USING btree ("parent_id");
  CREATE INDEX "leads_materiaux_order_idx" ON "leads_materiaux" USING btree ("order");
  CREATE INDEX "leads_materiaux_parent_idx" ON "leads_materiaux" USING btree ("parent_id");
  CREATE INDEX "leads_source_declaree_idx" ON "leads" USING btree ("source_declaree");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "leads_motivations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leads_materiaux" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "leads_motivations" CASCADE;
  DROP TABLE "leads_materiaux" CASCADE;
  ALTER TABLE "leads_services" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_leads_services";
  CREATE TYPE "public"."enum_leads_services" AS ENUM('fenetres', 'portes', 'volets', 'reparation');
  ALTER TABLE "leads_services" ALTER COLUMN "value" SET DATA TYPE "public"."enum_leads_services" USING "value"::"public"."enum_leads_services";
  DROP INDEX "leads_source_declaree_idx";
  ALTER TABLE "leads" DROP COLUMN "source_declaree";
  ALTER TABLE "leads" DROP COLUMN "source_declaree_detail";
  DROP TYPE "public"."enum_leads_motivations";
  DROP TYPE "public"."enum_leads_materiaux";
  DROP TYPE "public"."enum_leads_source_declaree";`)
}
