import { MigrationInterface, QueryRunner } from 'typeorm';

export class makeProfileNameUnique1650618707627 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "profile"
      ADD CONSTRAINT "UQ_0046bf0859cceb5f1744df2a360" UNIQUE ("name")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "profile" DROP CONSTRAINT "UQ_0046bf0859cceb5f1744df2a360"
    `);
  }
}
