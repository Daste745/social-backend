import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPosts1654800978827 implements MigrationInterface {
  name = 'createPosts1654800978827';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "post" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "content" character varying(1000) NOT NULL,
                "authorId" uuid,
                CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "post"
            ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"
        `);
    await queryRunner.query(`
            DROP TABLE "post"
        `);
  }
}
