import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BaseService } from './base/base.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor() { }

  getHello(): string {
    return 'Hello World!';
  }

  async onApplicationBootstrap() {
    console.log('Hello World')
  }
}
