import { MigrationInterface, QueryRunner } from 'typeorm';

export class addProfileRelations1651707464264 implements MigrationInterface {
  name = 'addProfileRelations1651707464264';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "profile_following_profile" (
                "profileId_1" uuid NOT NULL,
                "profileId_2" uuid NOT NULL,
                CONSTRAINT "PK_c6a0353622a5a17d42b5f6662e2" PRIMARY KEY ("profileId_1", "profileId_2")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_52b04ea2dfdba839f5f48497ca" ON "profile_following_profile" ("profileId_1")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_8a0c28fd76cdd2b5f426b1f8c0" ON "profile_following_profile" ("profileId_2")
        `);
    await queryRunner.query(`
            ALTER TABLE "profile_following_profile"
            ADD CONSTRAINT "FK_52b04ea2dfdba839f5f48497cac" FOREIGN KEY ("profileId_1") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "profile_following_profile"
            ADD CONSTRAINT "FK_8a0c28fd76cdd2b5f426b1f8c09" FOREIGN KEY ("profileId_2") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "profile_following_profile" DROP CONSTRAINT "FK_8a0c28fd76cdd2b5f426b1f8c09"
        `);
    await queryRunner.query(`
            ALTER TABLE "profile_following_profile" DROP CONSTRAINT "FK_52b04ea2dfdba839f5f48497cac"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_8a0c28fd76cdd2b5f426b1f8c0"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_52b04ea2dfdba839f5f48497ca"
        `);
    await queryRunner.query(`
            DROP TABLE "profile_following_profile"
        `);
  }
}
