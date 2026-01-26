import {
  Controller,
  Body,
  UseGuards, Request, Patch, Param, Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserAvatarDto, UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }


  //#region Get User By ID
  @Get()
  @ApiOperation({ summary: 'Get User Data by ID' })
  @ApiResponse({ status: 200, description: 'User Data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  get(@Request() req: any) {
    return this.userService.get(req.user.id);
  }
  //#endregion

  //#region Update Basic
  @Patch()
  @ApiOperation({ summary: 'Update a User' })
  @ApiResponse({ status: 201, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Request() req: any, @Body() payload: UserDto) {
    return this.userService.update(req.user.id, payload);
  }
  //#endregion

  //#region Update Avatar
  @Patch('/avatar')
  @ApiOperation({ summary: 'Update a Avatar' })
  @ApiResponse({ status: 201, description: 'User Avatar updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateAvatar(@Request() req: any, @Body() payload: UserAvatarDto) {
    return this.userService.updateAvatar(req.user.id, payload.path);
  }
  //#endregion


}