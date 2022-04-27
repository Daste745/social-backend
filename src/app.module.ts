import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import dbConfiguration from './config/db.config';
import jwtConfiguration from './config/jwt.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfiguration, jwtConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('database'),
    }),
    UsersModule,
    AuthModule,
    ProfilesModule,
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
