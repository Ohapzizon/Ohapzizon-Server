import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './config/database/database.module';
import { ValidateModule } from './config/validate/validate.module';
import { PostModule } from './post/post.module';
import { OrganizationModule } from './organization/organization.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ValidateModule,
    DatabaseModule,
    PostModule,
    OrganizationModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
