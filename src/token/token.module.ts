import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { TokenController } from './token.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {
        algorithm: 'HS256',
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME + 'm',
      },
    }),
  ],
  providers: [TokenService],
  controllers: [TokenController],
  exports: [TokenService],
})
export class TokenModule {}
