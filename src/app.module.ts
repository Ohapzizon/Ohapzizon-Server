import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './config/database/database.module';
import { ValidateModule } from './config/validate.module';
import { PostModule } from './post/post.module';
import { OrganizationModule } from './organization/organization.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ValidateModule,
    DatabaseModule,
    PostModule,
    OrganizationModule,
  ],
})
export class AppModule {}
