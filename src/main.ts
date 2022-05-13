import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from 'process';
import { AppModule } from './app.module';

require('dotenv').config();

async function bootstrap() {
  const port = parseInt(env.PORT) || 3000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Social')
    .setVersion('0.0.1')
    .build();
  const api_spec = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, api_spec);

  await app.listen(port);
}
bootstrap();
