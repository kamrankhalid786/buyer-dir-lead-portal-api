import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { createDocument } from './swagger/swagger';
import * as passport from 'passport';
import 'dotenv/config';
import { WinstonModule } from 'nest-winston';
import * as Winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: WinstonModule.createLogger({
      transports: [
        new Winston.transports.File({
          filename: 'logs/logs.log',
        }),
        new Winston.transports.Console(),
      ],
    }),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // app.useGlobalInterceptors(new TransformInterceptor());
  SwaggerModule.setup('api', app, createDocument(app));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(3000);
}
bootstrap();
