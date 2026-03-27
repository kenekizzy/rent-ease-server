import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGoogleIdToUser1743000000000 implements MigrationInterface {
    name = 'AddGoogleIdToUser1743000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Add googleId column if not exists
        const table = await queryRunner.getTable("users");
        if (table && !table.findColumnByName("googleId")) {
            await queryRunner.query(`ALTER TABLE "users" ADD "googleId" character varying(255)`);
            await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_google_id" UNIQUE ("googleId")`);
        }

        // 2. Make password nullable
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1. Revert password to NOT NULL
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);

        // 2. Remove googleId column
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_google_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "googleId"`);
    }
}
