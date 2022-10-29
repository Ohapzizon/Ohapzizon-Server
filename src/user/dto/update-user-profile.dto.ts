import { OmitType, PartialType } from '@nestjs/swagger';
import { RegisterUserProfileDto } from './register-user-profile.dto';

export class UpdateUserProfileDto extends PartialType(
  OmitType(RegisterUserProfileDto, ['department', 'grade']),
) {}
