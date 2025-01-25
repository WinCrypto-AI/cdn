import 'reflect-metadata';
import 'extensionsjs/lib';
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalPrefix } from './common/constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidatePipe } from './@systems/pipe';
import { getFromContainer, MetadataStorage } from 'class-validator';
import * as express from 'express';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemasObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { INestApplication } from '@nestjs/common';
import { configEnv } from './@config/env';
import { HttpExceptionFilter, TypeOrmFilter } from './@systems/exceptions/http-exception-filter';
import { ApiException } from './@systems/exceptions';
import { setupTransactionContext } from './@core/decorator';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';

const configSwagger = (app: INestApplication) => {
  const { SWAGGER_TITLE, SWAGGER_DESCRIPTION, SWAGGER_VERSION } = configEnv();
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion(SWAGGER_VERSION)
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    // extraModels: [PageResponse]
  });

  // Creating all the swagger schemas based on the class-validator decorators
  const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas;
  const targetSchemas = document.components.schemas || {};
  const schemasBinding = validationMetadatasToSchemas(metadatas) || {};

  Object.keys(schemasBinding).forEach(key => {
    const value = schemasBinding[key] as SchemasObject;
    if (!targetSchemas[key]) {
      Object.assign(targetSchemas, {
        key: value,
      });
    } else {
      const targetValue = targetSchemas[key] as SchemasObject;

      Object.assign(targetValue.properties, value.properties);
      targetValue.required = value.required;
      Object.assign(targetSchemas, {
        key: targetValue,
      });
    }
  });
  document.components.schemas = Object.assign({}, targetSchemas);
  SwaggerModule.setup('swagger', app, document);
};

const bootstrap = async () => {
  setupTransactionContext();
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  //#region Common config
  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix(GlobalPrefix.API);
  app.useGlobalPipes(
    new ValidatePipe({
      whitelist: false, // Chỉ giữ lại các field có trong DTO
      forbidNonWhitelisted: false, // Chặn field không có trong DTO
      transform: true, // Chuyển đổi kiểu dữ liệu tự động
    }),
  );
  app.useGlobalFilters(new I18nValidationExceptionFilter());
  // app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter(), new TypeOrmFilter());

  const { DIR_RESOURCE, STATIC_PATH_FILES } = configEnv();
  app.use('/' + STATIC_PATH_FILES, express.static(DIR_RESOURCE));
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { REQUEST_TIMEOUT = 30 * 60 * 1000 } = configEnv();
    res.setTimeout(REQUEST_TIMEOUT, () => {
      next(new ApiException('REQUEST TIMEOUT'));
    });
    next();
  });

  //#endregion
  configSwagger(app);

  await app.listen(port);

  console.log(`Server start on port ${port}. Open http://localhost:${port} to see results`);
  console.log(`API DOCUMENT Open http://localhost:${port}/swagger`);
  console.log(`API DOCUMENT JSON Open http://localhost:${port}/swagger-json`);
  console.log('TIMEZONE: ', process.env.TZ);
};

bootstrap();
