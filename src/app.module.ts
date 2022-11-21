import { Logger, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { TokenModule } from './token/token.module';
import { validationSchema } from './config/validation-schema';
import { HealthCheckModule } from './health-check/health-check.module';
import { DatabaseModule } from './config/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: validationSchema,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.production.env'
          : '.development.env',
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    PostModule,
    TeamModule,
    TokenModule,
    HealthCheckModule,
  ],
  providers: [Logger],
})
export class AppModule {}
