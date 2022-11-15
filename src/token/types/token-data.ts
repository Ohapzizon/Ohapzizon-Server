import { Role } from '../../user/enum/role';
import { SocialProfile } from '../../auth/types/social-profile';

export type TokenData = {
  iss: string;
  iat: number;
  exp: number;
};

export type AccessTokenData = {
  user_id: number;
  email: string;
  username: string;
  displayName: string;
  role: Role;
} & TokenData;

export type RefreshTokenData = {
  token_id: string;
} & TokenData;

export type RegisterTokenData = {
  profile: SocialProfile;
} & TokenData;

export type SocialRegisterTokenData = {
  provider: string;
  accessToken: string;
} & RegisterTokenData;
