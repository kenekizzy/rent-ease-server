import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1774773286523 implements MigrationInterface {
    name = 'InitSchema1774773286523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'paid', 'overdue', 'partial', 'waived')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_payment_method_enum" AS ENUM('bank_transfer', 'cash', 'check', 'card', 'online')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lease_id" uuid NOT NULL, "tenant_id" uuid NOT NULL, "landlord_id" uuid NOT NULL, "amount" numeric(10,2) NOT NULL, "due_date" date NOT NULL, "paid_date" date, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending', "payment_method" "public"."payments_payment_method_enum", "transaction_ref" character varying(100), "transaction_document" character varying(50), "period_year" integer NOT NULL, "amount_paid" numeric(10,2), "notes" text, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TYPE "public"."complaints_priority_enum" AS ENUM('low', 'medium', 'high', 'urgent')`);
        await queryRunner.query(`CREATE TYPE "public"."complaints_status_enum" AS ENUM('open', 'in_progress', 'resolved', 'closed')`);
        await queryRunner.query(`CREATE TABLE "complaints" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenant_id" uuid NOT NULL, "landlord_id" uuid NOT NULL, "property_id" uuid NOT NULL, "lease_id" uuid NOT NULL, "title" character varying(200) NOT NULL, "description" text NOT NULL, "priority" "public"."complaints_priority_enum" NOT NULL DEFAULT 'medium', "status" "public"."complaints_status_enum" NOT NULL DEFAULT 'open', "resolution_notes" text, "resolved_at" TIMESTAMP, CONSTRAINT "PK_4b7566a2a489c2cc7c12ed076ad" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TYPE "public"."documents_file_type_enum" AS ENUM('pdf', 'image', 'text', 'spreadsheet', 'other')`);
        await queryRunner.query(`CREATE TYPE "public"."documents_access_level_enum" AS ENUM('landlord', 'tenant', 'both')`);
        await queryRunner.query(`CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "uploaded_by" uuid NOT NULL, "lease_id" uuid, "property_id" uuid, "file_name" character varying(255) NOT NULL, "file_path" character varying(500) NOT NULL, "file_type" "public"."documents_file_type_enum" NOT NULL, "mime_type" character varying(100) NOT NULL, "file_size_kb" integer NOT NULL, "version" integer NOT NULL DEFAULT '1', "access_level" "public"."documents_access_level_enum" NOT NULL DEFAULT 'both', CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TYPE "public"."properties_status_enum" AS ENUM('available', 'partially_occupied', 'occupied', 'maintenance')`);
        await queryRunner.query(`CREATE TYPE "public"."properties_property_type_enum" AS ENUM('apartment', 'house', 'shop', 'studio')`);
        await queryRunner.query(`CREATE TABLE "properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "landlord_id" uuid NOT NULL, "tenant_id" uuid, "name" character varying(255) NOT NULL, "description" text, "address_line1" character varying(255) NOT NULL, "address_line2" character varying(255), "city" character varying(100) NOT NULL, "state" character varying(100) NOT NULL, "zip_code" character varying(20) NOT NULL, "country" character varying(100) NOT NULL DEFAULT 'Nigeria', "latitude" numeric(10,7), "longitude" numeric(10,7), "property_type" "public"."properties_property_type_enum" NOT NULL, "condition" character varying, "bedrooms" integer, "bathrooms" integer, "rent_amount" numeric(10,2), "rent_duration_in_months" integer NOT NULL DEFAULT 12, "additionalFees" jsonb NOT NULL DEFAULT '{}', "utilities" jsonb NOT NULL DEFAULT '{}', "amenities" jsonb NOT NULL DEFAULT '[]', "images" jsonb NOT NULL DEFAULT '[]', "status" "public"."properties_status_enum" NOT NULL DEFAULT 'available', "is_listed" boolean NOT NULL DEFAULT false, "published_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TYPE "public"."property_units_unit_type_enum" AS ENUM('self_contain', 'mini_flat', 'two_bedroom', 'three_bedroom', 'four_bedroom', 'five_bedroom')`);
        await queryRunner.query(`CREATE TABLE "property_units" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "property_id" uuid NOT NULL, "lease_id" uuid, "tenant_id" uuid, "name" character varying(100) NOT NULL, "unit_type" "public"."property_units_unit_type_enum", "bedrooms" integer, "bathrooms" integer, "area_sqm" numeric(8,2), "floor_number" integer, "rent_amount" numeric(10,2), "status" "public"."properties_status_enum" NOT NULL DEFAULT 'available', "is_active" boolean NOT NULL DEFAULT true, "notes" text, CONSTRAINT "PK_property_units" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_property_units_property_name" ON "property_units" ("property_id", "name") `);

        await queryRunner.query(`CREATE TYPE "public"."leases_status_enum" AS ENUM('pending_acceptance', 'active', 'expired', 'terminated')`);
        await queryRunner.query(`CREATE TABLE "leases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "property_id" uuid NOT NULL, "unit_id" uuid, "tenant_id" uuid, "tenant_email" character varying(255), "invite_token" character varying(255), "landlord_id" uuid NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "annual_rent" numeric(10,2) NOT NULL, "security_deposit" numeric(10,2) NOT NULL, "annual_due_date" date NOT NULL, "status" "public"."leases_status_enum" NOT NULL DEFAULT 'active', "accepted_at" TIMESTAMP WITH TIME ZONE, "terminated_at" TIMESTAMP WITH TIME ZONE, "termination_reason" text, "terms_text" text, CONSTRAINT "CHK_c367418791b1ce2d836d8a3f75" CHECK ("end_date" > "start_date"), CONSTRAINT "PK_2668e338ab2d27079170ea55ea2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_leases_unit_id" ON "leases" ("unit_id") WHERE ("unit_id" IS NOT NULL)`);

        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('complaint_submitted', 'complaint_updated', 'complaint_resolved', 'payment_due', 'payment_received', 'payment_overdue', 'lease_created', 'lease_expiring', 'lease_terminated', 'document_uploaded', 'document_updated', 'rent_increase')`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_channel_enum" AS ENUM('in_app', 'email', 'both')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "type" "public"."notifications_type_enum" NOT NULL, "title" character varying(200) NOT NULL, "message" text NOT NULL, "channel" "public"."notifications_channel_enum" NOT NULL DEFAULT 'in_app', "is_read" boolean NOT NULL DEFAULT false, "reference_id" uuid, "reference_type" character varying(50), "sent_at" TIMESTAMP NOT NULL DEFAULT now(), "read_at" TIMESTAMP, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification_preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "email_enabled" boolean NOT NULL DEFAULT true, "in_app_enabled" boolean NOT NULL DEFAULT true, "complaint_alerts" boolean NOT NULL DEFAULT true, "payment_alerts" boolean NOT NULL DEFAULT true, "rent_reminders" boolean NOT NULL DEFAULT true, "document_alerts" boolean NOT NULL DEFAULT true, "reminder_days_before" integer NOT NULL DEFAULT '3', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_64c90edc7310c6be7c10c96f675" UNIQUE ("user_id"), CONSTRAINT "PK_e94e2b543f2f218ee68e4f4fad2" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('landlord', 'tenant')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying(255) NOT NULL, "googleId" character varying(255), "password" character varying(255), "avatar" character varying(255), "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "emailVerified" boolean NOT NULL DEFAULT false, "phone" character varying(14), "role" "public"."users_role_enum" NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_f382af58ab36057334fb262efd5" UNIQUE ("googleId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);

        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_72fae2ace901fdd43c82702c860" FOREIGN KEY ("lease_id") REFERENCES "leases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_9109b53fca5cef7720aca72974d" FOREIGN KEY ("tenant_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_06f1022749059521c69a97505c4" FOREIGN KEY ("landlord_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "complaints" ADD CONSTRAINT "FK_3898e047e545e9554128c37733d" FOREIGN KEY ("tenant_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "complaints" ADD CONSTRAINT "FK_f9e55de213a0b620508f88f289f" FOREIGN KEY ("landlord_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "complaints" ADD CONSTRAINT "FK_506369430745fcca4e8a568960e" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "complaints" ADD CONSTRAINT "FK_c71d7e62f1a88430b1929ccafb8" FOREIGN KEY ("lease_id") REFERENCES "leases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_b9e28779ec77ff2223e2da41f6d" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_657e1667c7ab83f61ba6a786d46" FOREIGN KEY ("lease_id") REFERENCES "leases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_3048f74b3ef42755b53d9e0b2a8" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_57f44106ee0efc1ff2bdc8c179a" FOREIGN KEY ("landlord_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_tenant_id_properties" FOREIGN KEY ("tenant_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "property_units" ADD CONSTRAINT "FK_property_units_property" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_units" ADD CONSTRAINT "FK_property_units_lease" FOREIGN KEY ("lease_id") REFERENCES "leases"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_units" ADD CONSTRAINT "FK_property_units_tenant" FOREIGN KEY ("tenant_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "leases" ADD CONSTRAINT "FK_ee853e23faf915f2c7da39a96f6" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leases" ADD CONSTRAINT "FK_leases_unit" FOREIGN KEY ("unit_id") REFERENCES "property_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leases" ADD CONSTRAINT "FK_b4787e839c9c76e31d5a06aa3c5" FOREIGN KEY ("tenant_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leases" ADD CONSTRAINT "FK_8bed9cabc56e506722ab81a65ba" FOREIGN KEY ("landlord_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "FK_64c90edc7310c6be7c10c96f675" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "FK_64c90edc7310c6be7c10c96f675"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`);
        await queryRunner.query(`ALTER TABLE "leases" DROP CONSTRAINT "FK_8bed9cabc56e506722ab81a65ba"`);
        await queryRunner.query(`ALTER TABLE "leases" DROP CONSTRAINT "FK_b4787e839c9c76e31d5a06aa3c5"`);
        await queryRunner.query(`ALTER TABLE "leases" DROP CONSTRAINT "FK_leases_unit"`);
        await queryRunner.query(`ALTER TABLE "leases" DROP CONSTRAINT "FK_ee853e23faf915f2c7da39a96f6"`);
        await queryRunner.query(`ALTER TABLE "property_units" DROP CONSTRAINT "FK_property_units_tenant"`);
        await queryRunner.query(`ALTER TABLE "property_units" DROP CONSTRAINT "FK_property_units_lease"`);
        await queryRunner.query(`ALTER TABLE "property_units" DROP CONSTRAINT "FK_property_units_property"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_tenant_id_properties"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_57f44106ee0efc1ff2bdc8c179a"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_3048f74b3ef42755b53d9e0b2a8"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_657e1667c7ab83f61ba6a786d46"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_b9e28779ec77ff2223e2da41f6d"`);
        await queryRunner.query(`ALTER TABLE "complaints" DROP CONSTRAINT "FK_c71d7e62f1a88430b1929ccafb8"`);
        await queryRunner.query(`ALTER TABLE "complaints" DROP CONSTRAINT "FK_506369430745fcca4e8a568960e"`);
        await queryRunner.query(`ALTER TABLE "complaints" DROP CONSTRAINT "FK_f9e55de213a0b620508f88f289f"`);
        await queryRunner.query(`ALTER TABLE "complaints" DROP CONSTRAINT "FK_3898e047e545e9554128c37733d"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_06f1022749059521c69a97505c4"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_9109b53fca5cef7720aca72974d"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_72fae2ace901fdd43c82702c860"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "notification_preferences"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_channel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`DROP TABLE "leases"`);
        await queryRunner.query(`DROP TYPE "public"."leases_status_enum"`);
        await queryRunner.query(`DROP TABLE "property_units"`);
        await queryRunner.query(`DROP TYPE "public"."property_units_unit_type_enum"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DROP TYPE "public"."properties_property_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."properties_status_enum"`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP TYPE "public"."documents_access_level_enum"`);
        await queryRunner.query(`DROP TYPE "public"."documents_file_type_enum"`);
        await queryRunner.query(`DROP TABLE "complaints"`);
        await queryRunner.query(`DROP TYPE "public"."complaints_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."complaints_priority_enum"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
    }

}
