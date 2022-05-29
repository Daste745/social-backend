import { MigrationInterface, QueryRunner } from 'typeorm';

export class separateProfileRelationModel1653827425112
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "relation" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "profile1Id" uuid,
                "profile2Id" uuid,
                CONSTRAINT "PK_f241e9a7450751f8703be09c9e9" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "relation"
            ADD CONSTRAINT "FK_2fabdb07479bcc7b4a598896d15" FOREIGN KEY ("profile1Id") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "relation"
            ADD CONSTRAINT "FK_eb39f489a9461b7085803359807" FOREIGN KEY ("profile2Id") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "relation" DROP CONSTRAINT "FK_eb39f489a9461b7085803359807"
        `);
    await queryRunner.query(`
            ALTER TABLE "relation" DROP CONSTRAINT "FK_2fabdb07479bcc7b4a598896d15"
        `);
    await queryRunner.query(`
            DROP TABLE "relation"
        `);
  }
}
