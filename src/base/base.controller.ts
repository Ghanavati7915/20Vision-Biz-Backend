import {
  Controller,
  UseGuards, Get, Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseService } from './base.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Base')
@ApiBearerAuth('JWT-auth')
@Controller('base')
@UseGuards(JwtAuthGuard)
export class BaseController {
  constructor(private readonly baseService: BaseService) { }

 //#region Products
  @Public()
  @Get('/products')
  @ApiOperation({ summary: 'Get All Available Products' })
  @ApiResponse({ status: 200, description: 'List of Products' })
  products() {
    return this.baseService.products();
  }
  //#endregion

  //#region Company Search
  @Public()
  @Get('/company/search/:text')
  @ApiOperation({ summary: 'Search In The Companies With NationalCode' })
  @ApiResponse({ status: 200, description: 'List of Search Result' })
  companySearch(@Param('text') text: string) {
    return this.baseService.companySearch(text);
  }
  //#endregion

}