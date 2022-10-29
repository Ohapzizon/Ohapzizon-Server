import { Logger, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: validationSchema,
    }),
    AuthModule,
    TeamModule,
  ],
  providers: [Logger],
})
export class AppModule {}
