import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { env } from 'process';

require('dotenv').config();

// TODO: Support Docker Secrets

export default registerAs('database', () => {
  const srcDir = join(__dirname, '..');

  return {
    // logging: true, // TODO: Set this if debugging
    type: 'postgres',
    host: env.POSTGRES_HOST || 'localhost',
    port: parseInt(env.POSTGRES_PORT) || 5432,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    entities: [join(srcDir, '**', '*.entity{.ts,.js}')],
    migrations: [join(srcDir, 'migrations', '*{.ts,.js}')],
    cli: {
      migrationsDir: 'src/migrations',
    },
  };
});
