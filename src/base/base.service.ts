import {
   ConflictException,
   GoneException,
   HttpStatus,
   Injectable,
   NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CityType, Gender } from 'src/common/enums/enums';
import { CreateProductDto } from './dto/base.dto';

@Injectable()
export class BaseService {
   constructor(private prisma: PrismaService) { }

   //#region Create Product
   async createProduct(
      tenantId: number,
      creator: number,
      payload: CreateProductDto,
   ): Promise<{ message: string; statusCode: number }> {
      try {
         //#region Check Exist
         const existing = await this.prisma.products.findFirst({
            where: { title: payload.title, app_action: 1 },
         });
         if (existing) {
            throw new NotFoundException('این محصول قبلاً ثبت شده است');
         }
         //#endregion

         //#region Add Family
         await this.prisma.products.create({
            data: {
               title: payload.title,
               description: payload.description,
               properties: payload.properties,
               created_by: creator,
            },
         });
         //#endregion

         //#region Response
         return {
            message: 'ثبت با موفقیت انجام شد',
            statusCode: HttpStatus.CREATED,
         };
         //#endregion
      } catch (e: any) {
         if (e instanceof ConflictException) {
            throw e;
         }
         if (e instanceof NotFoundException) {
            throw e;
         }
         throw new GoneException('مشکلی در ثبت رخ داده است');
      }
   }
   //#endregion

   //#region Get All Products
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

   //#region Titles
   async titles() {
      try {
         //#region Transaction
         const results = await this.prisma.titles.findMany({
            where: {
               app_action: 1,
            },
            select: {
               id: true,
               title: true,
               gender: true,
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

   //#region Products
   async cities() {
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

   //#region Cities
   async countriesGetAll() {
      try {
         //#region Query
         const results = await this.prisma.cities.findMany({
            where: { app_action: 1, type: 'Country' },
         });
         //#endregion
         //#region Response
         return {
            results,
            message: 'موفق',
         };
         //#endregion
      } catch (e: any) {
         throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
      }
   }

   async provincesGetAll(id: number) {
      try {
         //#region Query
         const results = await this.prisma.cities.findMany({
            where: { app_action: 1, type: 'Province', parent_ref: id },
         });
         //#endregion
         //#region Response
         return {
            results,
            message: 'موفق',
         };
         //#endregion
      } catch (e: any) {
         throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
      }
   }

   async citiesGetAll(id: number) {
      try {
         //#region Query
         const results = await this.prisma.cities.findMany({
            where: { app_action: 1, type: 'City', parent_ref: id },
         });
         //#endregion
         //#region Response
         return {
            results,
            message: 'موفق',
         };
         //#endregion
      } catch (e: any) {
         throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
      }
   }

   async cityGetAll() {
      try {
         const results: any[] = [];
         //#region Countries
         const _countries = await this.prisma.cities.findMany({
            where: { app_action: 1, type: 'Country' },
         });
         //#endregion

         for (const country of _countries) {
            //#region Provinces
            const _provinces = await this.prisma.cities.findMany({
               where: { app_action: 1, type: 'Province', parent_ref: country.id },
            });
            //#endregion

            for (const province of _provinces) {
               //#region Provinces
               const cities = await this.prisma.cities.findMany({
                  where: { app_action: 1, type: 'City', parent_ref: province.id },
               });
               //#endregion

               //#region Provinces
               cities.forEach((city: any) => {
                  results.push({
                     id: city.id,
                     title: city.title,
                     province: { id: province.id, title: province.title },
                     country: { id: country.id, title: country.title },
                  });
               });
               //#endregion
            }
         }

         //#region Response
         return {
            results,
            message: 'موفق',
         };
         //#endregion
      } catch (e: any) {
         throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
      }
   }

   //#endregion

   //#region Seed

   //#region Seed Cities
   async seedCitiesIfNotExists() {
      const existing = await this.prisma.cities.findMany({
         where: { app_action: 1 },
      });

      if (existing.length > 10) {
         console.log('✅ Cities already exist.');
         return;
      }

      console.log('🌱 Seeding cities...');

      await this.prisma.$transaction(async (tx) => {
         //#region Create Country
         const country = await tx.cities.create({
            data: {
               title: 'ایران',
               type: CityType.Country,
               parent_ref: 0,
               created_by: 0,
            },
         });

         //#region Create Province
         const province = await tx.cities.create({
            data: {
               title: 'اصفهان',
               type: CityType.Province,
               parent_ref: country.id,
               created_by: 0,
            },
         });

         //#region Create Cities of Province
         const isfahanCities = [
            'اصفهان',
            'خمینی‌شهر',
            'نجف‌آباد',
            'شهرضا',
            'مبارکه',
            'کاشان',
            'آران و بیدگل',
            'فلاورجان',
            'لنجان',
            'گلپایگان',
            'خوانسار',
            'نائین',
            'نطنز',
            'دهاقان',
            'فریدن',
            'فریدون‌شهر',
            'سمیرم',
            'برخوار',
            'تیران و کرون',
            'چادگان',
            'خور و بیابانک',
            'ورزنه',
            'زینل‌آباد',
         ];

         const cityData = isfahanCities.map((city) => ({
            title: city,
            type: CityType.City,
            parent_ref: province.id,
            created_by: 0,
         }));

         await tx.cities.createMany({ data: cityData });
         //#endregion

         console.log('✅ Cities seeded successfully.');
      });
   }

   //#endregion

   //#region Seed Banks
   async seedBanksIfNotExists() {
      const existing = await this.prisma.banks.findMany({
         where: { app_action: 1 },
      });

      if (existing.length > 1) {
         console.log('✅ Banks already exist.');
         return;
      }

      console.log('🌱 Seeding Banks...');

      await this.prisma.$transaction(async (tx) => {
         //#region Create Banks
         const _banks = ['ملی', 'ملت', 'صادرات', 'کشاورزی', 'شهر', 'سپه'];

         const bankData = _banks.map((it) => ({
            title: it,
            description: '',
            created_by: 0,
         }));

         await tx.banks.createMany({ data: bankData });
         //#endregion

         console.log('✅ Banks seeded successfully.');
      });
   }

   //#endregion

   //#region Seed Job Field
   async seedJobFieldsIfNotExists() {
      const existing = await this.prisma.jobFieldTitles.findMany({
         where: { app_action: 1 },
      });

      if (existing.length > 1) {
         console.log('✅ Job Fields already exist.');
         return;
      }

      console.log('🌱 Seeding Job Fields ...');

      await this.prisma.$transaction(async (tx) => {
         //#region Create Job Fields
         const _jobs = ['سنگ', 'آهن'];

         const jobData = _jobs.map((it) => ({
            title: it,
            description: '',
            created_by: 0,
         }));

         await tx.jobFieldTitles.createMany({ data: jobData });
         //#endregion

         console.log('✅ Job Field Titles seeded successfully.');
      });
   }

   //#endregion

   //#region Seed Titles
   async seedTitlesIfNotExists() {
      const existing = await this.prisma.titles.findMany({
         where: { app_action: 1 },
      });

      if (existing.length > 1) {
         console.log('✅ Titles already exist.');
         return;
      }

      console.log('🌱 Seeding Titles ...');

      await this.prisma.$transaction(async (tx) => {
         //#region Create Titles
         const _titles = [
            { title: 'آقای', gender: Gender.Male },
            { title: 'جناب آقای دکتر', gender: Gender.Male },
            { title: 'جناب آقای مهندس', gender: Gender.Male },
            { title: 'خانم', gender: Gender.FeMale },
            { title: 'سرکار خانم دکتر', gender: Gender.FeMale },
            { title: 'سرکار خانم مهندس', gender: Gender.FeMale },
         ];

         const titleData = _titles.map((it) => ({
            title: it.title,
            gender: it.gender,
            created_by: 0,
         }));

         await tx.titles.createMany({ data: titleData });
         //#endregion

         console.log('✅ Titles seeded successfully.');
      });
   }

   //#endregion

   //#endregion
}
