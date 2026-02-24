import { GoneException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CityType, Gender } from 'src/common/enums/enums';

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
      const _banks = [
        'ملی',
        'ملت',
        'صادرات',
        'کشاورزی',
        'شهر',
        'سپه'
      ];

      const bankData = _banks.map((it) => ({
        title: it,
        description: "",
        created_by: 0,
      }));

      await tx.banks.createMany({ data: bankData });
      //#endregion

      console.log('✅ Banks seeded successfully.');
    });
  }
  //#endregion

  //#region Job Field
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
      const _jobs = [
        'سنگ',
        'آهن'
      ];

      const jobData = _jobs.map((it) => ({
        title: it,
        description: "",
        created_by: 0,
      }));

      await tx.jobFieldTitles.createMany({ data: jobData });
      //#endregion

      console.log('✅ Job Field Titles seeded successfully.');
    });
  }
  //#endregion


  //#region Titles
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
}
