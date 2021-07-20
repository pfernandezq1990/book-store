import {MigrationInterface, QueryRunner} from "typeorm";

export class updateUserDetails1626796277636 implements MigrationInterface {
    name = 'updateUserDetails1626796277636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" ADD "dateOfBirth" character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" DROP COLUMN "dateOfBirth"`);
    }

}
