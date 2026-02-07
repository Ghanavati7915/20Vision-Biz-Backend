import {
  Controller,
  Body,
  UseGuards, Request, Patch, Param, Get,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatCreateDto, ChatMessageCreateDto } from './dto/chat.dto';


@ApiTags('Chat')
@ApiBearerAuth('JWT-auth')
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  //#region Create Chat
  @Post()
  @ApiOperation({ summary: 'Create Chat' })
  @ApiResponse({ status: 200, description: 'Chat Created Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Request() req, @Body() payload: ChatCreateDto) {
    return this.chatService.create(req.user.id, req.user.userID, payload);
  }
  //#endregion

  //#region Create Chat Message
  @Post('message')
  @ApiOperation({ summary: 'Create Chat Message' })
  @ApiResponse({ status: 200, description: 'Chat Message Created Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createMessage(@Request() req, @Body() payload: ChatMessageCreateDto) {
    return this.chatService.createMessage(req.user.id, req.user.userID, payload);
  }
  //#endregion

  //#region Get All
  @Get()
  @ApiOperation({ summary: 'Get All' })
  @ApiResponse({ status: 200, description: 'Chat List Data' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAll(@Request() req) {
    return this.chatService.getAll(req.user.id);
  }
  //#endregion

  //#region Get Chat
  @Get(':id')
  @ApiOperation({ summary: 'Get Chat By ID' })
  @ApiResponse({ status: 200, description: 'Chat Data' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getByID(@Request() req, @Param('id') id: number) {
    return this.chatService.getByID(req.user.id, id);
  }
  //#endregion

}