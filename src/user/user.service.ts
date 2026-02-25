import { BadRequestException, ConflictException, GoneException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UserDto } from "./dto/user.dto";
import { isNationalCode } from "../common/methods/validator";
import { ToggleStateDto } from "src/common/DTOs/shared";

@Injectable()
export class UserService {
   constructor(private prisma: PrismaService) {}

   //#region Get Basic Info By ID
   async get(id: number) {
      try {
         //#region Transaction
         const result = await this.prisma.users.findFirst({
            where: { app_action: 1, id },
            select: {
               firstname: true,
               lastname: true,
               gender: true,
               avatar: true,
               nationalCode: true,
            },
         });
         //#endregion

         //#region Check Exist
         if (!result) {
            throw new NotFoundException(" اطلاعات شما یافت نشد");
         }
         //#endregion

         result.avatar = result.avatar ? `${process.env.BACKEND_DOMAIN}/dl/${result.avatar}` : null;

         //#region Response
         return { result };
         //#endregion
      } catch (e: any) {
         if (e instanceof NotFoundException) {
            throw e;
         }
         throw new GoneException("مشکلی در دریافت اطلاعات رخ داده است");
      }
   }
   //#endregion

   //#region Update
   async update(id: number, payload: UserDto) {
      try {
         //#region Check Access
         const userFind = await this.prisma.users.findFirst({
            where: { app_action: 1, id },
         });
         if (!userFind) {
            throw new NotFoundException("اطلاعات شما یافت نشد");
         }
         if (payload.nationalCode) {
            if (!isNationalCode(payload.nationalCode)) {
               throw new BadRequestException("کد ملی را بصورت صحیح ارسال کنید");
            }
         }
         //#endregion

         //#region Update User Info
         await this.prisma.users.updateMany({
            where: { id },
            data: {
               firstname: payload.firstname,
               lastname: payload.lastname,
               gender: payload.gender,
               nationalCode: payload.nationalCode,
               modify_by: id,
               modify_at: new Date(),
            },
         });
         //#endregion

         //#region Response
         return {
            message: "ویرایش با موفقیت انجام شد",
            statusCode: HttpStatus.OK,
         };
         //#endregion
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

   //#region Update Avatar
   async updateAvatar(id: number, path: string) {
      try {
         //#region Check Access
         const userFind = await this.prisma.users.findFirst({
            where: { app_action: 1, id },
         });
         if (!userFind) {
            throw new NotFoundException("اطلاعات شما یافت نشد");
         }
         //#endregion

         //#region Update User Info
         await this.prisma.users.updateMany({
            where: { id },
            data: {
               avatar: path,
               modify_by: id,
               modify_at: new Date(),
            },
         });
         //#endregion

         //#region Response
         return {
            message: "ویرایش با موفقیت انجام شد",
            statusCode: HttpStatus.OK,
         };
         //#endregion
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

   //#region Toggle Share
   async toggleShare(tenantId: number, editor: number, payload: ToggleStateDto): Promise<{ message: string; statusCode: number }> {
      try {
         const result = await this.prisma.tenants.updateMany({
            where: {
               id: tenantId,
               app_action: 1,
            },
            data: {
               allowSharing: payload.state,
               modify_by: editor,
               modify_at: new Date(),
            },
         });

         if (result.count === 0) {
            throw new NotFoundException("مستاجر با این اطلاعات یافت نشد");
         }

         return {
            message: "وضعیت اشتراک گذاری با موفقیت تغییر یافت",
            statusCode: HttpStatus.OK,
         };
      } catch (error) {
         if (error instanceof NotFoundException) throw error;
         throw new GoneException("مشکلی در عملیات رخ داده است");
      }
   }
   //#endregion
}
