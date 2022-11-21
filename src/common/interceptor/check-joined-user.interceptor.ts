import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccessTokenData } from '../../token/types/token-data';
import { TeamService } from '../../team/team.service';

@Injectable()
export class CheckJoinedUserInterceptor implements NestInterceptor {
  constructor(private readonly teamService: TeamService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<boolean>> {
    const request = context.switchToHttp().getRequest();
    const accessToken: AccessTokenData = request.access_token;
    const { teamId } = request.query;
    const team = await this.teamService.findOneByIdOrFail(teamId);
    if (team.userId !== accessToken.user_id)
      throw new ForbiddenException('신청자가 아닙니다.');
    return next.handle();
  }
}
