import { Role } from '../../user/enum/role';
import { SocialProfile } from '../../auth/social/types/social-profile';

export type TokenData = {
  iss: string;
  sub: string;
  iat: number;
  exp: number;
};

export type AccessTokenData = {
  email: string;
  username: string;
  displayName: string;
  role: Role;
} & TokenData;

export type RefreshTokenData = TokenData;

export type RegisterTokenData = {
  profile: SocialProfile;
} & TokenData;

export type SocialRegisterTokenData = {
  profile: SocialProfile;
  provider: string;
  accessToken: string;
} & TokenData;
