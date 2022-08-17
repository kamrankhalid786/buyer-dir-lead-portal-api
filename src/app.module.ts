import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Logger,
  CacheModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandModule } from 'nestjs-command';
import { SeedModule } from './shared/seed.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';
import { ContactModule } from './contact/contact.module';
import { ParametersModule } from './parameters/parameters.module';
import { LoggerMiddleware } from './core/middleware/logger.middleware';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/test'),
    UserModule,
    RolesModule,
    ContactModule,
    SeedModule,
    CommandModule,
    AuthModule,
    ParametersModule,
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      isGlobal: true,
      ttl: 60 * 60 * 24,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger, CacheModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('user');
  }
}
//TODO: Add redis cache parameters to .env file.
