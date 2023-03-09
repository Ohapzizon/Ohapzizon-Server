import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenData } from './types/token-data';
import User from '../entities/user.entity';
import AuthToken from '../entities/auth-token.entity';
import { TokenDto } from './dto/token.dto';
import { Repository } from 'typeorm';
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION_TIME,
  REGISTER_TOKEN_SECRET,
  REGISTER_TOKEN_EXPIRATION_TIME,
  AUTH_TOKEN_REPOSITORY,
} from '../common/constants';

@Injectable()
export class TokenService {
  private readonly ACCESS_TOKEN_SECRET: string;
  private readonly REFRESH_TOKEN_SECRET: string;
  private readonly REGISTER_TOKEN_SECRET: string;
  private readonly ACCESS_TOKEN_EXPIRATION: number;
  private readonly REFRESH_TOKEN_EXPIRATION: number;
  private readonly REGISTER_TOKEN_EXPIRATION: number;

  constructor(
    @Inject(AUTH_TOKEN_REPOSITORY)
    private readonly authTokenRepository: Repository<AuthToken>,
    private readonly configService: ConfigService,
  ) {
    this.ACCESS_TOKEN_SECRET =
      this.configService.get<string>(ACCESS_TOKEN_SECRET);
    this.REFRESH_TOKEN_SECRET =
      this.configService.get<string>(REFRESH_TOKEN_SECRET);
    this.REGISTER_TOKEN_SECRET = this.configService.get<string>(
      REGISTER_TOKEN_SECRET,
    );
    this.ACCESS_TOKEN_EXPIRATION = +this.configService.get<number>(
      ACCESS_TOKEN_EXPIRATION_TIME,
    );
    this.REFRESH_TOKEN_EXPIRATION = +this.configService.get<number>(
      REFRESH_TOKEN_EXPIRATION_TIME,
    );
    this.REGISTER_TOKEN_EXPIRATION = +this.configService.get<number>(
      REGISTER_TOKEN_EXPIRATION_TIME,
    );
  }

  async generateUserToken(user: User): Promise<TokenDto> {
    const accessToken = this.generateAccessToken({
      user_id: user.id,
      name: user.name,
      displayName: user.profile.displayName,
      email: user.email,
      role: user.role,
    });
    const authToken = await this.authTokenRepository.findOneByOrFail({
      userId: user.id,
    });
    const refreshToken = this.generateRefreshToken({
      token_id: authToken.id,
    });
    return new TokenDto(accessToken, refreshToken);
  }

  async refreshUserToken(
    user: User,
    refreshTokenData: RefreshTokenData,
  ): Promise<TokenDto> {
    let authToken: AuthToken;
    try {
      authToken = await this.authTokenRepository.findOneByOrFail({
        id: refreshTokenData.token_id,
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid Token');
    }
    const accessToken = this.generateAccessToken({
      user_id: user.id,
      name: user.name,
      displayName: user.profile.displayName,
      email: user.email,
      role: user.role,
    });
    const now = new Date().getTime();
    const diff = refreshTokenData.exp * 1000 - now;
    if (diff < 1000 * 60 * 60 * 24 * 23) {
      const refreshToken = this.generateRefreshToken({
        token_id: authToken.id,
      });
      return new TokenDto(accessToken, refreshToken);
    }
    return new TokenDto(accessToken);
  }

  async disabledAuthTokenByUserId(userId: number): Promise<void> {
    const authToken: AuthToken = await this.authTokenRepository
      .createQueryBuilder('a')
      .where('u.id = :id', { id: userId })
      .innerJoin('a.user', 'u')
      .getOneOrFail();
    authToken.disabled = true;
    await this.authTokenRepository.save(authToken);
  }

  generateRegisterToken(payload: any): string {
    return jwt.sign(payload, this.REGISTER_TOKEN_SECRET, {
      issuer: 'ohapzizon.com',
      algorithm: 'HS256',
      expiresIn: this.REGISTER_TOKEN_EXPIRATION + 'ms',
    });
  }

  private generateAccessToken(payload: any): string {
    return jwt.sign(payload, this.ACCESS_TOKEN_SECRET, {
      issuer: 'ohapzizon.com',
      algorithm: 'HS256',
      expiresIn: this.ACCESS_TOKEN_EXPIRATION + 'ms',
    });
  }

  private generateRefreshToken(payload: any): string {
    return jwt.sign(payload, this.REFRESH_TOKEN_SECRET, {
      issuer: 'ohapzizon',
      algorithm: 'HS256',
      expiresIn: this.REFRESH_TOKEN_EXPIRATION + 'ms',
    });
  }
}
