import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
  ) {}

  @ApiParam({
    name: 'id',
    required: true,
    description: '땡길 페이지'
  })
  @ApiOperation({ summary: '땡겨' })
  @ApiResponse({
    description: '성공',
  })
  @HttpCode(HttpStatus.CREATED)
  @Get('/participate/:id')
  async participate(@Param('id') id) {
    const data = await this.organizationService.participate(id);
    return {
      status: 200,
      message: '땡겨~',
      data,
    };
  }
}
