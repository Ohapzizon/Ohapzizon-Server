export type Profile = {
  name: string;
  email: string;
};

export type SocialProfile = {
  socialId: string;
  thumbnail?: string | null;
} & Profile;
