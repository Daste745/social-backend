import { registerAs } from '@nestjs/config';
import { join } from 'path';

// TODO: Use values from environment
// TODO: Support Docker Secrets

export default registerAs('database', () => {
  const srcDir = join(__dirname, '..');

  return {
    // logging: true, // TODO: Set this if debugging
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'social',
    password: 'social',
    database: 'social',
    entities: [join(srcDir, '**', '*.entity{.ts,.js}')],
    migrations: [join(srcDir, 'migrations', '*{.ts,.js}')],
    cli: {
      migrationsDir: 'src/migrations',
    },
  };
});
