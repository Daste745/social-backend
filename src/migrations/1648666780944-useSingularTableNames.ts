import { MigrationInterface, QueryRunner } from 'typeorm';

export class useSingularTableNames1648666780944 implements MigrationInterface {
  name = 'useSingularTableNames1648666780944';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('users', 'user');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('user', 'users');
  }
}
