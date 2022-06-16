import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
import {
  GoneException,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import User from '../../entities/user.entity';

const TOKEN_SECRET: string = process.env.TOKEN_SECRET;

export const validateToken = (
  accessToken: string,
  refreshToken?: string,
  isRefresh = false,
): User => {
  let verify: User = null;
  try {
    verify = verifyToken(accessToken) as User;
    if (isRefresh) verifyToken(refreshToken);
    return verify;
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

      case 'jwt expired': // 토큰이 만료되었그을 경우
        if (isRefresh) {
          verify = decodeToken(accessToken) as User;
          return verify;
        }
        throw new GoneException('만료된 토큰입니다.');

      default:
        Logger.error(e);
        throw new InternalServerErrorException('서버 오류입니다.');
    }
  }
};

export const verifyToken = (token: string, options?: jwt.VerifyOptions) => {
  return jwt.verify(token, TOKEN_SECRET, options);
};

export const decodeToken = (token: string, options?: jwt.DecodeOptions) => {
  return jwt.decode(token, options);
};
