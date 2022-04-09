import { argon2id, hash } from 'argon2';
import { User } from '../users/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class hashPasswordsWithArgon2id1649517566526
  implements MigrationInterface
{
  // This migration hashes all user passwords with Argon2id
  // WARN: This migration is irreversible, as passwords can't be un-hashed

  public async up(queryRunner: QueryRunner): Promise<void> {
    const usersRepository = queryRunner.manager.getRepository(User);

    const users = await usersRepository.find();
    for (const user of users) {
      user.password = await hash(user.password, {
        type: argon2id,
        parallelism: 4,
      });
    }
    await usersRepository.save(users);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error('This migration is irreversible.');
  }
}
