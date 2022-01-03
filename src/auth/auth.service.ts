import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import User from '../entities/user.entity';
import { TokenService } from '../token/token.service';
import { TokenDto } from '../token/dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async login(email: string, name: string): Promise<TokenDto> {
    return await this.tokenService.createTokens(email, name);
  }

  async logout(idx: string): Promise<void> {
    const user: User = await this.userRepository.findUser({
      where: idx,
    });
    await user.removeRefreshToken();
  }
}
