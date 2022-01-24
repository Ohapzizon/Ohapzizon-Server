import {
  GoneException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { IJwtPayload } from '../common/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import User from '../entities/user.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateToken(
    accessToken: string,
    refreshToken?: string,
    isRefresh = false,
  ): Promise<User> {
    let user: User = null;
    try {
      user = await this.verify(accessToken, refreshToken, isRefresh);
      if (isRefresh) await user.checkRefreshToken(refreshToken);
      return user;
    } catch (e) {
      switch (e.message) {
        // 토큰에 대한 오류를 판단합니다.
        case 'invalid signature': // signature의 구문을 분석할 수 없을 경우
        case 'invalid token': // 헤더 또는 페이로드의 구문을 분석할 수 없을 경우, 또는 유효하지 못한 토큰
        case 'jwt malformed': // 토큰에 구조적으로 문제가 생겼을 경우
        case 'jwt signature is required': // 토큰에 signature을 확인하지 못 했을 경우
        case 'Unexpected token': // 토큰의 형식이 원하는 형식과 맞지 않는 경우
        case 'jwt must be provided': // 클레임에 null 값이 들어갔을 경우
          throw new UnauthorizedException('유효하지 않은 토큰입니다.');

        case 'jwt expired': // 토큰이 만료되었을 경우
          if (isRefresh) {
            user = await this.decode(accessToken);
            await user.checkRefreshToken(refreshToken);
            return user;
          }
          throw new GoneException('만료된 토큰입니다.');

        default:
          Logger.error(e);
          throw new InternalServerErrorException('서버 오류입니다.');
      }
    }
  }

  async verify(token: string, refreshToken?: string, isRefresh = false) {
    const secretKey: string = process.env.JWT_ACCESS_TOKEN_SECRET;
    const verify: IJwtPayload = jwt.verify(token, secretKey) as IJwtPayload;
    if (isRefresh) {
      jwt.verify(refreshToken, secretKey);
    }
    return await this.userRepository.findUser({ where: { email: verify.sub } });
  }

  async decode(token: string): Promise<User> {
    const decode: IJwtPayload = jwt.decode(token) as IJwtPayload;
    return await this.userRepository.findUser({
      where: { email: decode.sub },
    });
  }

  createAccessToken(email: string, name: string): string {
    const payload: IJwtPayload = {
      sub: email,
      aud: name,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME + 'm',
      algorithm: 'HS256',
    });
  }

  async createRefreshToken(name: string): Promise<string> {
    const payload = {} as IJwtPayload;
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME + 'm',
      algorithm: 'HS256',
    });
    await this.setHashedRefreshToken(refreshToken, name);
    return refreshToken;
  }

  async setHashedRefreshToken(
    refreshToken: string,
    name: string,
  ): Promise<void> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(
      { name: name },
      { currentHashedRefreshToken: currentHashedRefreshToken },
    );
  }

  removeRefreshToken(id: string) {
    return this.userRepository.update(
      { user_id: id },
      {
        currentHashedRefreshToken: null,
      },
    );
  }
}
