import { Role } from '../../user/enum/role';
import { Profile, SocialProfile } from '../../auth/types/social-profile';

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
  profile: Profile;
} & TokenData;

export type SocialRegisterTokenData = {
  profile: SocialProfile;
  provider: string;
  accessToken: string;
} & TokenData;
