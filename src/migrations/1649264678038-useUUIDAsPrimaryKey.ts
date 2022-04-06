import { MigrationInterface, QueryRunner } from 'typeorm';

export class useUUIDAsPrimaryKey1649264678038 implements MigrationInterface {
  // Applying will generate random UUIDv4 keys as PK
  // Reverting will generate a new PK sequence starting at 1
  name = 'useUUIDAsPrimaryKey1649264678038';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      ALTER TABLE "user"
        ALTER COLUMN "id" DROP DEFAULT,
        ALTER COLUMN "id" SET DATA TYPE UUID USING (uuid_generate_v4()),
        ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()
    `);

    await queryRunner.query(`DROP SEQUENCE user_id_seq`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SEQUENCE user_id_seq INCREMENT 1 START 1`);

    await queryRunner.query(`
      ALTER TABLE "user"
        ALTER COLUMN "id" DROP DEFAULT,
        ALTER COLUMN "id" SET DATA TYPE INT USING (nextval('user_id_seq')),
        ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq')
    `);

    await queryRunner.query(`DROP EXTENSION "uuid-ossp"`);
  }
}
