import { GoneException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BaseService {
  constructor(private prisma: PrismaService) { }

  //#region Products
  async products() {
    try {
      //#region Transaction
      const results = await this.prisma.products.findMany({
        where: {
          app_action: 1,
        },
        select: {
          id: true,
          title: true,
          description: true,
          properties: true,
        },
      });
      //#endregion
      //#region Response
      return {
        results,
      };
      //#endregion
    } catch (e: any) {
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion

  //#region Company Search
  async companySearch(search: string) {
    try {
      //#region Transaction
      const results = await this.prisma.companies.findMany({
        where: {
          app_action: 1,
          OR: [
            {
              nationalCode: { contains: search },
            },
            {
              title: { contains: search },
            },
          ],
        },
        select: {
          id: true,
          title: true,
          tenant_ref: true,
          nationalCode: true,
          logo: true,
        },
      });
      //#endregion
      //#region Response
      return {
        results,
      };
      //#endregion
    } catch (e: any) {
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion
}
