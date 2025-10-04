import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cors from 'cors';
import * as dotenv from 'dotenv';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import * as morgan from 'morgan';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './common/GlobalExceptionFilter';

dotenv.config();

const corsOptions: cors.CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'dev'
        ? new ConsoleLogger({
            colors: true,
            prefix: 'MAO',
            json: true,
          })
        : false,
  });
  app.enableCors(corsOptions);
  app.use(
    helmet({
      crossOriginResourcePolicy: true,
    }),
  );

  app.use(morgan.default('dev'));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: false,
    }),
  );
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));
  const config = new DocumentBuilder()
    .setTitle('Mãos à obra')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const options: SwaggerDocumentOptions = {
    autoTagControllers: true,
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
  };
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, documentFactory);
  const port = parseInt(process.env.APP_PORT ?? '5000', 10);
  const host = process.env.HOST;
  if (host) {
    await app.listen(port, host);
  } else {
    await app.listen(port);
  }
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
