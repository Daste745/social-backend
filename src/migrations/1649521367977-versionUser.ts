import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class versionUser1649521367977 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'version',
        type: 'int',
        isNullable: false,
        default: 1,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'version');
  }
}
