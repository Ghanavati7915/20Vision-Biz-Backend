import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { BaseModule } from './base/base.module';
import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { ChatModule } from './chat/chat.module';
import { UploadModule } from './upload/upload.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    BaseModule,
    UserModule,
    ChatModule,
    MonitoringModule,
    ContactModule,
    UploadModule,
  ],
  providers: [
    PrismaService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    Reflector,
  ],
})
export class AppModule {
}