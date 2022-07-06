import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './core/middleware/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { LeadModule } from './lead/lead.module';
import { RolesModule } from './roles/roles.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/test'),
    UserModule,
    LeadModule,
    RolesModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('user');
  }
}
