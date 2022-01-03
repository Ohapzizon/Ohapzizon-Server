import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './config/database/database.module';
import { ValidateModule } from './config/validate.module';
import { PostModule } from './post/post.module';
import { OrganizationModule } from './organization/organization.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ValidateModule,
    DatabaseModule,
    PostModule,
    OrganizationModule,
    GroupModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
