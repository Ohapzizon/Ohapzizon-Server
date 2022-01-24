import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    required: true,
    description: '땡길 게시글',
  })
  @ApiOperation({ summary: '땡겨' })
  @ApiResponse({
    description: '성공',
  })
  @HttpCode(HttpStatus.OK)
  @Get('/participate/:idx')
  async participate(@Param('idx') idx: number) {
    const data = await this.organizationService.participate(idx);
    return {
      status: 200,
      message: '땡겨~',
      data,
    };
  }
}
