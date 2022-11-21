import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { userProfileProvider } from './provider/user-profile.provider';
import { DatabaseModule } from '../../config/database/database.module';
import { DataSource } from 'typeorm';
import UserProfile from '../../entities/user-profile.entity';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: 'USER_PROFILE_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        console.log(dataSource);
        return dataSource.getRepository(UserProfile);
      },
      inject: ['DATA_SOURCE'],
    },
    UserProfileService,
  ],
  exports: [
    {
      provide: 'USER_PROFILE_REPOSITORY',
      useFactory: async (dataSource: DataSource) => {
        console.log(dataSource);
        return dataSource.getRepository(UserProfile);
      },
      inject: ['DATA_SOURCE'],
    },
    UserProfileService,
  ],
})
export class UserProfileModule {}
