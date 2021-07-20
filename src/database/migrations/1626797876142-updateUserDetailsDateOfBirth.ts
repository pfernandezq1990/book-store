import {MigrationInterface, QueryRunner} from "typeorm";

export class updateUserDetailsDateOfBirth1626797876142 implements MigrationInterface {
    name = 'updateUserDetailsDateOfBirth1626797876142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" DROP COLUMN "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "user_details" ADD "dateOfBirth" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" DROP COLUMN "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "user_details" ADD "dateOfBirth" character varying(100)`);
    }

}
