import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import User from '../entities/user.entity';
import { ReissuanceDto } from './dto/reissuance.dto';

@Injectable()
export class TokenService {
  constructor(
    readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  private TOKEN_SECRET = this.configService.get<string>('TOKEN_SECRET');
  private ACCESS_TOKEN_EXPIRED = this.configService.get<string>(
    'ACCESS_TOKEN_EXPIRATION_TIME',
  );
  private REFRESH_TOKEN_EXPIRED = this.configService.get<string>(
    'REFRESH_TOKEN_EXPIRATION_TIME',
  );

  async createTokens(user: User): Promise<Map<string, string>> {
    const map = new Map<string, string>();
    const accessToken: string = this.createAccessToken(
      user.googleId,
      user.name,
      user.role,
    );
    const refreshToken: string = await this.createRefreshToken(user.userId);
    map.set('username', user.name);
    map.set('accessToken', 'Bearer ' + accessToken);
    map.set('refreshToken', 'Bearer ' + refreshToken);
    return map;
  }

  async reissuanceToken(userId: number): Promise<ReissuanceDto> {
    const user: User = await this.userService.findByUserId(userId);
    const token = this.createAccessToken(user.googleId, user.name, user.role);
    return new ReissuanceDto(token);
  }

  removeRefreshToken(userId: number): Promise<void> {
    return this.userService.updateRefreshTokenById(userId, null);
  }

  private createAccessToken(
    googleId: string,
    name: string,
    role: string,
  ): string {
    const payload = {
      googleId: googleId,
      name: name,
      role: role,
    };
    return jwt.sign(payload, this.TOKEN_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRED + 'm',
      algorithm: 'HS256',
    });
  }

  private async createRefreshToken(userId: number): Promise<string> {
    const payload = {};
    const refreshToken = jwt.sign(payload, this.TOKEN_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRED + 'm',
      algorithm: 'HS256',
    });
    await this.setHashedRefreshToken(refreshToken, userId);
    return refreshToken;
  }

  private async setHashedRefreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<void> {
    const salt = await bcrypt.genSalt();
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    return this.userService.updateRefreshTokenById(
      userId,
      currentHashedRefreshToken,
    );
  }
}
