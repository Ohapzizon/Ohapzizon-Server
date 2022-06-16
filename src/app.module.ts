import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './config/database/database.module';
import { PostModule } from './post/post.module';
import { TeamModule } from './team/team.module';
import { ExceptionModule } from './common/filters/exception.module';
import { InterceptorModule } from './common/interceptors/interceptor.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PW: Joi.string().required(),
        DB_NAME: Joi.string().required(),

        CLIENT_ID: Joi.string().required(),
        CLIENT_SECRET: Joi.string().required(),

        TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    AuthModule,
    UserModule,
    DatabaseModule,
    PostModule,
    TeamModule,
    ExceptionModule,
    InterceptorModule,
  ],
})
export class AppModule {}
