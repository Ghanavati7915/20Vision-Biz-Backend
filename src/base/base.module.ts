import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseService } from './base.service';
import { BaseController } from './base.controller';

@Module({
  controllers: [BaseController],
  providers: [BaseService, PrismaService],
  exports: [BaseService],
})
export class BaseModule {}