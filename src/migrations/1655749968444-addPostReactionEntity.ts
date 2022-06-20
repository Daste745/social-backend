import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPostReactionEntity1655749968444 implements MigrationInterface {
  name = 'addPostReactionEntity1655749968444';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."reaction_type_enum" AS ENUM('like')
        `);
    await queryRunner.query(`
            CREATE TABLE "reaction" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "type" "public"."reaction_type_enum" NOT NULL DEFAULT 'like',
                "authorId" uuid NOT NULL,
                "postId" uuid NOT NULL,
                CONSTRAINT "PK_41fbb346da22da4df129f14b11e" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "reaction"
            ADD CONSTRAINT "FK_3689cedb63e6688d1c87466a7cd" FOREIGN KEY ("authorId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "reaction"
            ADD CONSTRAINT "FK_dc3aeb83dc815f9f22ebfa7785f" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "reaction" DROP CONSTRAINT "FK_dc3aeb83dc815f9f22ebfa7785f"
        `);
    await queryRunner.query(`
            ALTER TABLE "reaction" DROP CONSTRAINT "FK_3689cedb63e6688d1c87466a7cd"
        `);
    await queryRunner.query(`
            DROP TABLE "reaction"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."reaction_type_enum"
        `);
  }
}
