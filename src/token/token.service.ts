import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenData } from './types/token-data';
import User from '../entities/user.entity';
import AuthToken from '../entities/auth-token.entity';
import { TokenDto } from './dto/token.dto';
import dataSource from '../config/database/data-source';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { authTokenRepository } from './token.repository';
import UserProfile from '../entities/user-profile.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  private ACCESS_TOKEN_SECRET = this.configService.get<string>(
    'ACCESS_TOKEN_SECRET',
  );
  private REFRESH_TOKEN_SECRET = this.configService.get<string>(
    'REFRESH_TOKEN_SECRET',
  );
  private REGISTER_TOKEN_SECRET = this.configService.get<string>(
    'REGISTER_TOKEN_SECRET',
  );
  private ACCESS_TOKEN_EXPIRATION = +this.configService.get<number>(
    'ACCESS_TOKEN_EXPIRATION_TIME',
  );
  private REFRESH_TOKEN_EXPIRATION = +this.configService.get<number>(
    'REFRESH_TOKEN_EXPIRATION_TIME',
  );
  private REGISTER_TOKEN_EXPIRATION = +this.configService.get<number>(
    'REGISTER_TOKEN_EXPIRATION_TIME',
  );

  async generateUserToken(
    user: User,
    userProfile: UserProfile,
    authToken: AuthToken,
  ): Promise<TokenDto> {
    const accessToken = this.generateAccessToken({
      sub: user.id,
      name: user.name,
      nickname: userProfile.displayName,
      email: user.email,
      role: user.role,
    });
    const refreshToken = this.generateRefreshToken({
      sub: authToken.id,
    });
    return new TokenDto(accessToken, refreshToken);
  }

  async refreshUserToken(
    user: User,
    userProfile: UserProfile,
    refreshTokenData: RefreshTokenData,
    res: Response,
  ): Promise<TokenDto> {
    let authToken: AuthToken;
    try {
      authToken = await authTokenRepository.findOneByIdOrFail(
        refreshTokenData.sub,
      );
    } catch (e) {
      throw new UnauthorizedException('Invalid Token');
    }
    const accessToken = this.generateAccessToken({
      sub: user.id,
      name: user.name,
      nickname: userProfile.displayName,
      email: user.email,
      role: user.role,
    });
    const now = new Date().getTime();
    const diff = refreshTokenData.exp * 1000 - now;
    if (diff < 1000 * 60 * 60 * 24 * 23) {
      const refreshToken = this.generateRefreshToken({
        sub: authToken.id,
      });
      const tokenDto = new TokenDto(accessToken, refreshToken);
      this.setTokenCookie(res, tokenDto);
      return tokenDto;
    }
    const tokenDto = new TokenDto(accessToken);
    this.setTokenCookie(res, tokenDto);
    return tokenDto;
  }

  async disabledAuthTokenByUserId(userId: string): Promise<void> {
    const authToken: AuthToken = await dataSource
      .createQueryBuilder(AuthToken, 'a')
      .where('u.id = :id', { id: userId })
      .innerJoin('a.user', 'u')
      .getOneOrFail();
    authToken.disabled = true;
    await dataSource.manager.save(AuthToken, authToken);
  }

  generateRegisterToken(payload: any): string {
    return jwt.sign(payload, this.REGISTER_TOKEN_SECRET, {
      issuer: 'ohapzizon.com',
      algorithm: 'HS256',
      expiresIn: this.REGISTER_TOKEN_EXPIRATION,
    });
  }

  private generateAccessToken(payload: any): string {
    return jwt.sign(payload, this.ACCESS_TOKEN_SECRET, {
      issuer: 'ohapzizon.com',
      algorithm: 'HS256',
      expiresIn: this.ACCESS_TOKEN_EXPIRATION,
    });
  }

  private generateRefreshToken(payload: any): string {
    return jwt.sign(payload, this.REFRESH_TOKEN_SECRET, {
      issuer: 'ohapzizon',
      algorithm: 'HS256',
      expiresIn: this.REFRESH_TOKEN_EXPIRATION,
    });
  }

  setTokenCookie(res: Response, { accessToken, refreshToken }: TokenDto): void {
    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie('refreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });
  }

  resetTokenCookie(res: Response): void {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
}
