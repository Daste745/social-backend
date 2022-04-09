import { NestFactory } from '@nestjs/core';
import { env } from 'process';
import { AppModule } from './app.module';

require('dotenv').config();

async function bootstrap() {
  const port = parseInt(env.PORT) || 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}
bootstrap();
