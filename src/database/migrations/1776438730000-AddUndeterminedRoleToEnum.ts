import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUndeterminedRoleToEnum1776438730000 implements MigrationInterface {
    name = 'AddUndeterminedRoleToEnum1776438730000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adding a value to an ENUM type in Postgres
        // We use IF NOT EXISTS to avoid errors if it was already added manually
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum" ADD VALUE IF NOT EXISTS 'undetermined'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Postgres does not support removing values from an ENUM type directly.
        // Usually, this involves creating a new type, moving data, and dropping the old one.
        // For a development environment, we can leave it as is or document the limitation.
        console.warn('Down migration for ENUM type values is not supported in Postgres without recreating the type.');
    }
}
