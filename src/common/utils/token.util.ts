import { TokenData } from '../../token/types/token-data';
import * as jwt from 'jsonwebtoken';
import {
  GoneException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

export const validateToken = async <T extends TokenData>(
  token: string,
  secret: string,
  isRefresh = false,
): Promise<T> => {
  let verify: T;
  try {
    verify = await verifyToken<T>(token, secret);
  } catch (e) {
    switch (e.message) {
      case 'jwt expired':
        if (isRefresh) return decodeToken<T>(token);
        throw new GoneException('Expired Token');

      case 'jwt must be provided':
      case 'invalid token':
      case 'jwt malformed':
      case 'invalid signature':
        throw new UnauthorizedException('Invalid Token');

      default:
        throw new InternalServerErrorException('서버 에러입니다.');
    }
  }
  return verify;
};

export const verifyToken = async <T>(
  token: string,
  secret: string,
): Promise<T> => {
  return jwt.verify(token, secret) as T;
};

export const decodeToken = async <T>(token: string): Promise<T> => {
  return jwt.decode(token) as T;
};
