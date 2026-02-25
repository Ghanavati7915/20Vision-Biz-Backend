import { BadRequestException, ConflictException, GoneException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateBranchBankDto, CreateBranchPhonesDto, CreateDepartmentDto } from "./dto/branch.dto";
import { Entity } from '../common/enums/enums';

@Injectable()
export class BranchService {
   constructor(private readonly prisma: PrismaService) {}

   //#region Create Phones
   async create_phones(
      tenantId: number,
      isPersonal: boolean,
      creator: number,
      id: number,
      payload: CreateBranchPhonesDto,
   ): Promise<{ message: string; statusCode: number }> {
      try {
         //#region Check Exist
         const existing = await this.prisma.branches.findFirst({ where: { id,entity: isPersonal?Entity.Personal:Entity.Company , entity_ref:tenantId, app_action: 1 } });
         if (!existing) {
            throw new NotFoundException("شعبه یافت نشد");
         }

         const existingPhones = await this.prisma.branchPhones.findFirst({
            where: { branch_ref: id, operator: payload.operator, title: payload.title, phone: payload.phone, app_action: 1 },
         });
         if (existingPhones) {
            throw new ConflictException("این اطلاعات را قبلاً ثبت کرده اید");
         }
         //#endregion

         //#region Add Family
         await this.prisma.branchPhones.create({
            data: {
               branch_ref: id,
               title: payload.title,
               type: payload.type,
               phone: payload.phone,
               operator: payload.operator,
               created_by: creator,
            },
         });
         //#endregion

         //#region Response
         return {
            message: "ثبت با موفقیت انجام شد",
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
         throw new GoneException("مشکلی در ثبت رخ داده است");
      }
   }
   //#endregion

   //#region Create Department
   async create_department(
      tenantId: number,
      isPersonal: boolean,
      creator: number,
      id: number,
      payload: CreateDepartmentDto,
   ): Promise<{ message: string; statusCode: number }> {
      try {
         //#region Check Exist
         const existing = await this.prisma.branches.findFirst({ where: { id,entity: isPersonal?Entity.Personal:Entity.Company , entity_ref:tenantId, app_action: 1 } });
         if (!existing) {
            throw new NotFoundException("شعبه یافت نشد");
         }

         const existingDepartment = await this.prisma.branchDepartments.findFirst({
            where: { branch_ref: id, title: payload.title, parent_ref: payload.parent_ref, app_action: 1 },
         });
         if (existingDepartment) {
            throw new ConflictException("این اطلاعات را قبلاً ثبت کرده اید");
         }
         //#endregion

         //#region Add Department
         await this.prisma.branchDepartments.create({
            data: {
               branch_ref: id,
               title: payload.title,
               parent_ref: payload.parent_ref,
               created_by: creator,
            },
         });
         //#endregion

         //#region Response
         return {
            message: "ثبت با موفقیت انجام شد",
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
         throw new GoneException("مشکلی در ثبت رخ داده است");
      }
   }
   //#endregion

   //#region Create Bank Accounts
   async create_bankAccounts(
      tenantId: number,
      isPersonal: boolean,
      creator: number,
      id: number,
      payload: CreateBranchBankDto,
   ): Promise<{ message: string; statusCode: number }> {
      try {
         //#region Check Exist
         const existing = await this.prisma.branches.findFirst({ where: { id, entity: isPersonal?Entity.Personal:Entity.Company , entity_ref:tenantId, app_action: 1 } });
         if (!existing) {
            throw new NotFoundException("شعبه یافت نشد");
         }

         const existingAccount = await this.prisma.branchBanks.findFirst({
            where: { branch_ref: id, bank_ref: payload.bank_ref, bankBranch: payload.bankBranch, title: payload.title, accountNo: payload.accountNo, app_action: 1 },
         });
         if (existingAccount) {
            throw new ConflictException("این اطلاعات را قبلاً ثبت کرده اید");
         }
         //#endregion

         //#region Add Family
         await this.prisma.branchBanks.create({
            data: {
               branch_ref: id,
              bank_ref: payload.bank_ref,
               bankBranch: payload.bankBranch,
               currency: payload.currency,
               type: payload.type,
               title: payload.title,
               accountNo: payload.accountNo,
               shabaNo: payload.shabaNo,
               internationalAccountNo: payload.internationalAccountNo,
               created_by: creator,
            },
         });
         //#endregion

         //#region Response
         return {
            message: "ثبت با موفقیت انجام شد",
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
         throw new GoneException("مشکلی در ثبت رخ داده است");
      }
   }
   //#endregion
}
