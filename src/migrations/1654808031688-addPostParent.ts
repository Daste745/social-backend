import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPostParent1654808031688 implements MigrationInterface {
  name = 'addPostParent1654808031688';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "post"
            ADD "parentId" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "post"
            ADD CONSTRAINT "FK_985731f28966e0d45a7bd9078a6" FOREIGN KEY ("parentId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "post" DROP CONSTRAINT "FK_985731f28966e0d45a7bd9078a6"
        `);
    await queryRunner.query(`
            ALTER TABLE "post" DROP COLUMN "parentId"
        `);
  }
}
