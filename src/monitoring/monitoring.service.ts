import { BadRequestException, ConflictException, GoneException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { MonitorDto } from "./dto/monitoring.dto";
import { Prisma } from "@prisma/client";
@Injectable()
export class MonitoringService {
   constructor(private prisma: PrismaService) {}

   //#region Get By ID
   async getByID(id: number) {
      try {
         //#region Transaction
         const result = await this.prisma.monitorings.findFirst({
            where: {
               id: +id,
               app_action: 1,
            },
            select: {
               id: true,
               title: true,
               data: true,
               created_at: true,
               modify_at: true,
            },
         });

         //#endregion

         //#region Response
         if (result) {
            return result;
         } else {
            throw new GoneException("اطلاعاتی با این شناسه یافت نشد");
         }

         //#endregion
      } catch (e: any) {
         if (e instanceof GoneException) {
            throw e;
         }
         throw new GoneException("مشکلی در دریافت اطلاعات رخ داده است");
      }
   }
   //#endregion

   //#region Get Monitoring
   async getMyMonitor(id: number) {
      try {
         //#region Transaction
         const result = await this.prisma.monitorings.findFirst({
            where: {
               tenant_ref: +id,
               app_action: 1,
            },
            select: {
               id: true,
               title: true,
               data: true,
               created_at: true,
               modify_at: true,
            },
         });

         //#endregion

         //#region Response
         if (result) {
            return result;
         } else {
            throw new GoneException("اطلاعاتی با این شناسه یافت نشد");
         }

         //#endregion
      } catch (e: any) {
         if (e instanceof GoneException) {
            throw e;
         }
         throw new GoneException("مشکلی در دریافت اطلاعات رخ داده است");
      }
   }
   //#endregion

   //#region Update Monitor
   async updateMonitor(id: number, { title, data }: MonitorDto) {
      try {
         //#region Check
         const check = await this.prisma.monitorings.findFirst({
            where: { app_action: 1, tenant_ref: id },
         });
         //#endregion

         //#region New
         if (!check) {
            await this.prisma.monitorings.createMany({
               data: { title, data, created_by: id, tenant_ref: id },
            });
         }
         //#endregion
         //#region Edit
         else {
            await this.prisma.monitorings.updateMany({
               where: { id: check.id },
               data: { title, data, modify_by: id, modify_at: new Date() },
            });
         }
         //#endregion

         return { message: "انجام شد", statusCode: HttpStatus.OK };
      } catch (e: any) {
         if (e instanceof NotFoundException) {
            throw e;
         }
         if (e instanceof ConflictException) {
            throw e;
         }
         if (e instanceof BadRequestException) {
            throw e;
         }
         console.log(e);
         throw new GoneException("مشکلی در ثبت رخ داده است");
      }
   }
   //#endregion
}
