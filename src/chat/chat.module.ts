import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService],
  exports: [ChatService],
})
export class ChatModule { }