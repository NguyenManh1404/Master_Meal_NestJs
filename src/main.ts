/* istanbul ignore file */

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { BadRequestExceptionFilter } from "./common/exception-filters/bad-request-exception.filter";
import { ValidationError } from "class-validator";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { ApiResponseStatus200Schema } from "./common/responses/200.response";
import { ApiResponseStatus201Schema } from "./common/responses/201.response";
import * as basicAuth from "express-basic-auth";
import * as dotenv from "dotenv";
import { PaginationMeta } from "./common/dtos/pagination.dto";
import { UserResponse } from "./api/responses/users/user.response";
import { AdminResponse } from "./api/responses/admins/admin.response";
import { ProfileResponse } from "./api/responses/users/profile.response";

dotenv.config();

async function bootstrap(): Promise<any> {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      exceptionFactory(errors: ValidationError[]): any {
        return new BadRequestException(errors);
      },
    })
  );
  app.useGlobalFilters(new BadRequestExceptionFilter());

  // Swagger settings
  app.use(
    ["/swagger", "/docs", "/docs-json"],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USERNAME]: process.env.SWAGGER_PASSWORD,
      },
    })
  );
  const documentBuilder = new DocumentBuilder()
    .setTitle("Master Meal Backend API Documentation")
    .setDescription("Master Meal Backend API Documentation")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        schema: "Bearer",
        bearerFormat: "Token",
      } as SecuritySchemeObject,
      "Bearer"
    )
    .build();
  const document = SwaggerModule.createDocument(app, documentBuilder, {
    extraModels: [
      ApiResponseStatus200Schema,
      ApiResponseStatus201Schema,
      PaginationMeta,
      UserResponse,
      AdminResponse,
      ProfileResponse,
    ],
  });
  SwaggerModule.setup("swagger", app, document);

  // Start application
  await app.listen(3000);
}

bootstrap().then();
