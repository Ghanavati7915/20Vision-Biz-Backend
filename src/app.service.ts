import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { BaseService } from "./base/base.service";

@Injectable()
export class AppService implements OnApplicationBootstrap {
   constructor(private readonly baseService: BaseService) {}

   getHello(): string {
      return "20Vision Biz Backend!";
   }

   async onApplicationBootstrap() {
      await this.baseService.seedCitiesIfNotExists();
      await this.baseService.seedBanksIfNotExists();
      await this.baseService.seedJobFieldsIfNotExists();
      await this.baseService.seedTitlesIfNotExists();
      console.log("20Vision Biz Backend Running");
   }
}
