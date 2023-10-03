import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  const port = process.env.PORT || 3000;
  configureOpenAPIDocumentation(app);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );
  await app.listen(port);
}

function configureOpenAPIDocumentation(app: INestApplication) {
  try {
    const options = new DocumentBuilder()
      .setTitle('Pharmacy API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
  } catch (error) {
    Logger.error(
      `Server: Swagger setup with error message ${error.message} and stacktrace ${error.stacktrace}`,
    );
  }
}
bootstrap();
