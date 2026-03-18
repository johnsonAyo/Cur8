import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { Logger, ValidationPipe } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('CUR8 Project API')
    .setDescription('The carbon removal project scoring API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  if (process.env.VERCEL) {
    await app.init();
    return app.getHttpAdapter().getInstance();
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(`Application successfully started on port: ${port}`, 'Bootstrap');
}
let cachedServer: (req: IncomingMessage, res: ServerResponse) => void;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    if (!cachedServer) {
      cachedServer = await bootstrap();
    }
    return cachedServer(req, res);
  } catch (err: any) {
    console.error('NestJS initialization failed:', err);
    res.statusCode = 500;
    res.end(JSON.stringify({
      error: 'NestJS Initialization Error',
      message: err.message || String(err),
      stack: err.stack,
    }));
  }
}

if (!process.env.VERCEL) {
  bootstrap();
}
