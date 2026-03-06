"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1704067200000 = void 0;
class InitialMigration1704067200000 {
    name = 'InitialMigration1704067200000';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TYPE "public"."users_role_enum" AS ENUM('landlord', 'tenant')
    `);
        await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "email" character varying NOT NULL,
        "passwordHash" character varying NOT NULL,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "phone" character varying,
        "role" "public"."users_role_enum" NOT NULL,
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TYPE "public"."properties_status_enum" AS ENUM('available', 'occupied', 'maintenance')
    `);
        await queryRunner.query(`
      CREATE TABLE "properties" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "address" character varying NOT NULL,
        "city" character varying NOT NULL,
        "state" character varying NOT NULL,
        "zipCode" character varying NOT NULL,
        "rentAmount" numeric(10,2) NOT NULL,
        "description" text,
        "status" "public"."properties_status_enum" NOT NULL DEFAULT 'available',
        "landlordId" uuid NOT NULL,
        CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TYPE "public"."leases_status_enum" AS ENUM('active', 'expired', 'terminated')
    `);
        await queryRunner.query(`
      CREATE TABLE "leases" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "startDate" date NOT NULL,
        "endDate" date NOT NULL,
        "rentAmount" numeric(10,2) NOT NULL,
        "securityDeposit" numeric(10,2) NOT NULL,
        "status" "public"."leases_status_enum" NOT NULL DEFAULT 'active',
        "propertyId" uuid NOT NULL,
        "tenantId" uuid NOT NULL,
        CONSTRAINT "PK_7f1b5c7b7b7b7b7b7b7b7b7b7b7" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'paid', 'overdue')
    `);
        await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "amount" numeric(10,2) NOT NULL,
        "dueDate" date NOT NULL,
        "paidDate" date,
        "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending',
        "paymentMethod" character varying,
        "notes" text,
        "leaseId" uuid NOT NULL,
        CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TYPE "public"."complaints_priority_enum" AS ENUM('low', 'medium', 'high', 'urgent')
    `);
        await queryRunner.query(`
      CREATE TYPE "public"."complaints_status_enum" AS ENUM('open', 'in_progress', 'resolved', 'closed')
    `);
        await queryRunner.query(`
      CREATE TABLE "complaints" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "priority" "public"."complaints_priority_enum" NOT NULL DEFAULT 'medium',
        "status" "public"."complaints_status_enum" NOT NULL DEFAULT 'open',
        "resolvedAt" TIMESTAMP,
        "tenantId" uuid NOT NULL,
        "propertyId" uuid NOT NULL,
        CONSTRAINT "PK_a9c8dbc2ab4988edcc2ff0a7337" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TYPE "public"."notifications_type_enum" AS ENUM('complaint_submitted', 'complaint_status_updated', 'rent_due', 'payment_received', 'payment_overdue', 'rent_increase', 'lease_expiring', 'document_uploaded')
    `);
        await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "title" character varying NOT NULL,
        "message" text NOT NULL,
        "type" "public"."notifications_type_enum" NOT NULL,
        "read" boolean NOT NULL DEFAULT false,
        "userId" uuid NOT NULL,
        CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TYPE "public"."documents_documenttype_enum" AS ENUM('lease_agreement', 'property_photo', 'inspection_report', 'receipt', 'maintenance_record', 'other')
    `);
        await queryRunner.query(`
      CREATE TABLE "documents" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "filename" character varying NOT NULL,
        "filePath" character varying NOT NULL,
        "mimeType" character varying NOT NULL,
        "fileSize" integer NOT NULL,
        "documentType" "public"."documents_documenttype_enum" NOT NULL DEFAULT 'other',
        "propertyId" uuid NOT NULL,
        CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      ALTER TABLE "properties" ADD CONSTRAINT "FK_properties_landlord" 
      FOREIGN KEY ("landlordId") REFERENCES "users"("id") ON DELETE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE "leases" ADD CONSTRAINT "FK_leases_property" 
      FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE "leases" ADD CONSTRAINT "FK_leases_tenant" 
      FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE "payments" ADD CONSTRAINT "FK_payments_lease" 
      FOREIGN KEY ("leaseId") REFERENCES "leases"("id") ON DELETE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE "complaints" ADD CONSTRAINT "FK_complaints_tenant" 
      FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE "complaints" ADD CONSTRAINT "FK_complaints_property" 
      FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE "notifications" ADD CONSTRAINT "FK_notifications_user" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
    `);
        await queryRunner.query(`
      ALTER TABLE "documents" ADD CONSTRAINT "FK_documents_property" 
      FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE
    `);
        await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
        await queryRunner.query(`CREATE INDEX "IDX_users_role" ON "users" ("role")`);
        await queryRunner.query(`CREATE INDEX "IDX_properties_landlord" ON "properties" ("landlordId")`);
        await queryRunner.query(`CREATE INDEX "IDX_properties_status" ON "properties" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_leases_property" ON "leases" ("propertyId")`);
        await queryRunner.query(`CREATE INDEX "IDX_leases_tenant" ON "leases" ("tenantId")`);
        await queryRunner.query(`CREATE INDEX "IDX_leases_status" ON "leases" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_payments_lease" ON "payments" ("leaseId")`);
        await queryRunner.query(`CREATE INDEX "IDX_payments_status" ON "payments" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_payments_due_date" ON "payments" ("dueDate")`);
        await queryRunner.query(`CREATE INDEX "IDX_complaints_tenant" ON "complaints" ("tenantId")`);
        await queryRunner.query(`CREATE INDEX "IDX_complaints_property" ON "complaints" ("propertyId")`);
        await queryRunner.query(`CREATE INDEX "IDX_complaints_status" ON "complaints" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_notifications_user" ON "notifications" ("userId")`);
        await queryRunner.query(`CREATE INDEX "IDX_notifications_read" ON "notifications" ("read")`);
        await queryRunner.query(`CREATE INDEX "IDX_documents_property" ON "documents" ("propertyId")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_documents_property"`);
        await queryRunner.query(`DROP INDEX "IDX_notifications_read"`);
        await queryRunner.query(`DROP INDEX "IDX_notifications_user"`);
        await queryRunner.query(`DROP INDEX "IDX_complaints_status"`);
        await queryRunner.query(`DROP INDEX "IDX_complaints_property"`);
        await queryRunner.query(`DROP INDEX "IDX_complaints_tenant"`);
        await queryRunner.query(`DROP INDEX "IDX_payments_due_date"`);
        await queryRunner.query(`DROP INDEX "IDX_payments_status"`);
        await queryRunner.query(`DROP INDEX "IDX_payments_lease"`);
        await queryRunner.query(`DROP INDEX "IDX_leases_status"`);
        await queryRunner.query(`DROP INDEX "IDX_leases_tenant"`);
        await queryRunner.query(`DROP INDEX "IDX_leases_property"`);
        await queryRunner.query(`DROP INDEX "IDX_properties_status"`);
        await queryRunner.query(`DROP INDEX "IDX_properties_landlord"`);
        await queryRunner.query(`DROP INDEX "IDX_users_role"`);
        await queryRunner.query(`DROP INDEX "IDX_users_email"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_documents_property"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_notifications_user"`);
        await queryRunner.query(`ALTER TABLE "complaints" DROP CONSTRAINT "FK_complaints_property"`);
        await queryRunner.query(`ALTER TABLE "complaints" DROP CONSTRAINT "FK_complaints_tenant"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_payments_lease"`);
        await queryRunner.query(`ALTER TABLE "leases" DROP CONSTRAINT "FK_leases_tenant"`);
        await queryRunner.query(`ALTER TABLE "leases" DROP CONSTRAINT "FK_leases_property"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_properties_landlord"`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "complaints"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "leases"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."documents_documenttype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."complaints_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."complaints_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."leases_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."properties_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }
}
exports.InitialMigration1704067200000 = InitialMigration1704067200000;
//# sourceMappingURL=1704067200000-InitialMigration.js.map