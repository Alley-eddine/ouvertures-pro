import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_appels_type" AS ENUM('telephone', 'whatsapp');
  CREATE TYPE "public"."enum_appels_source_key" AS ENUM('google-ads', 'gbp', 'seo', 'social', 'ia', 'referent', 'campagne', 'direct');
  ALTER TYPE "public"."enum_leads_origine" ADD VALUE 'manuel';
  ALTER TYPE "public"."enum_leads_source_key" ADD VALUE 'gbp' BEFORE 'seo';
  ALTER TYPE "public"."enum_leads_source_key" ADD VALUE 'bouche-a-oreille';
  CREATE TABLE "appels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_appels_type" NOT NULL,
  	"numero" varchar,
  	"source_key" "enum_appels_source_key",
  	"source" varchar,
  	"campagne" varchar,
  	"mot_cle" varchar,
  	"gclid" varchar,
  	"page" varchar,
  	"clique_le" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "leads" ALTER COLUMN "email" DROP NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "appels_id" integer;
  CREATE INDEX "appels_source_key_idx" ON "appels" USING btree ("source_key");
  CREATE INDEX "appels_clique_le_idx" ON "appels" USING btree ("clique_le");
  CREATE INDEX "appels_updated_at_idx" ON "appels" USING btree ("updated_at");
  CREATE INDEX "appels_created_at_idx" ON "appels" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_appels_fk" FOREIGN KEY ("appels_id") REFERENCES "public"."appels"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_appels_id_idx" ON "payload_locked_documents_rels" USING btree ("appels_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "appels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "appels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_appels_fk";
  
  ALTER TABLE "leads" ALTER COLUMN "origine" SET DATA TYPE text;
  ALTER TABLE "leads" ALTER COLUMN "origine" SET DEFAULT 'devis'::text;
  DROP TYPE "public"."enum_leads_origine";
  CREATE TYPE "public"."enum_leads_origine" AS ENUM('devis', 'accueil');
  ALTER TABLE "leads" ALTER COLUMN "origine" SET DEFAULT 'devis'::"public"."enum_leads_origine";
  ALTER TABLE "leads" ALTER COLUMN "origine" SET DATA TYPE "public"."enum_leads_origine" USING "origine"::"public"."enum_leads_origine";
  ALTER TABLE "leads" ALTER COLUMN "source_key" SET DATA TYPE text;
  DROP TYPE "public"."enum_leads_source_key";
  CREATE TYPE "public"."enum_leads_source_key" AS ENUM('google-ads', 'seo', 'social', 'ia', 'referent', 'campagne', 'direct');
  ALTER TABLE "leads" ALTER COLUMN "source_key" SET DATA TYPE "public"."enum_leads_source_key" USING "source_key"::"public"."enum_leads_source_key";
  DROP INDEX "payload_locked_documents_rels_appels_id_idx";
  ALTER TABLE "leads" ALTER COLUMN "email" SET NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "appels_id";
  DROP TYPE "public"."enum_appels_type";
  DROP TYPE "public"."enum_appels_source_key";`)
}
