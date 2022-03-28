import { registerAs } from '@nestjs/config';

// TODO: Use values from environment
// TODO: Support Docker Secrets

export default registerAs('database', () => {
  return {
    // logging: true, // TODO: Set this if debugging
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'social',
    password: 'social',
    database: 'social',
    synchronize: true, // TODO: Use migrations!
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['src/migrations/*{.ts,.js}'],
    cli: {
      migrationsDir: 'src/migrations',
    },
  };
});
