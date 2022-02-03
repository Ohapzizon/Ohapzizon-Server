import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import User from '../entities/user.entity';
import { UserDecorator } from '../common/decorators/user.decorator';

@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiParam({
    name: 'id',
    required: true,
    description: '땡길 게시글',
  })
  @ApiOperation({ summary: '땡겨' })
  @ApiOkResponse({
    description: '성공',
  })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Get('/participate/:id')
  async participate(
    @Param('id', ParseIntPipe) id: number,
    @UserDecorator() user: User,
  ) {
    const data = await this.organizationService.participate(id, user);
    return {
      status: 200,
      message: '땡겨~',
      data,
    };
  }
}
