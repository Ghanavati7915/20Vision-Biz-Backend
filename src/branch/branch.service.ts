import {
  BadRequestException,
  ConflictException,
  GoneException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateBranchBankDto, CreateBranchDepartmentEmployeesDto,
  CreateBranchDto,
  CreateBranchPhonesDto, CreateBranchSocialAccountsDto,
  CreateDepartmentDto,
} from './dto/branch.dto';
import { Entity } from '../common/enums/enums';
import { AddressDto } from '../common/DTOs/shared';

@Injectable()
export class BranchService {
  constructor(private readonly prisma: PrismaService) {}
  //#region Branch
  //#region Create
  async create(
    tenantId: number,
    creator: number,
    entity_ref: number,
    payload: CreateBranchDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.branches.findFirst({
        where: {
          tenant_ref: tenantId,
          code: payload.code,
          entity: payload.entity,
          entity_ref,
          app_action: 1,
        },
      });
      if (existing) {
        throw new ConflictException('این شعبه با این کد قبلاً ثبت شده است');
      }
      //#endregion

      //#region اجرای تراکنش برای حفظ انسجام
      await this.prisma.$transaction(async (tx) => {
        //#region ایجاد شعبه (branch)
        const branch = await tx.branches.create({
          data: {
            tenant_ref: tenantId,
            entity: payload.entity,
            entity_ref,
            code: payload.code,
            title: payload.title,
            created_by: creator,
          },
        });
        //#endregion
        //#region ایجاد model
        for (const it of payload.models) {
          await tx.branchModels.create({
            data: {
              branch_ref: branch.id,
              model: it,
              created_by: creator,
            },
          });
        }
        //#endregion
        //#region ایجاد حوزه های کاری
        for (const it of payload.jobFields) {
          await tx.branchFields.create({
            data: {
              branch_ref: branch.id,
              jobFieldTitle_ref: it,
              created_by: creator,
            },
          });
        }
        //#endregion
        //#region بررسی موفقیت همه مراحل
        if (!branch) {
          throw new GoneException('مشکلی در ثبت رخ داده است');
        }
        //#endregion
        return { branch };
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
      throw new GoneException('مشکلی در ثبت رخ داده است');
    }
  }
  //#endregion
  //#region Get
  async get_branches(tenantId: number, entity: string, id: number) {
    try {
      //#region Transaction
      const result = await this.prisma.branches.findMany({
        where: { app_action: 1, tenant_ref: tenantId, entity, entity_ref: id },
        select: {
          id: true,
          code: true,
          title: true,
          bimeh_code: true,
          bimeh_branch: true,
          branchModels: {
            select: {
              id: true,
              model: true,
            },
          },
          branchFields: {
            select: {
              jobFieldTitle_ref: true,
            },
          },
        },
      });
      //#endregion
      //#region Response
      if (result) {
        return result;
      } else {
        throw new NotFoundException('شعبه ای یافت نشد');
      }
      //#endregion
    } catch (e: any) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion
  //#region Update
  async update_branch(
    tenantId: number,
    editor: number,
    id: number,
    payload: CreateBranchDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.branches.findFirst({
        where: {
          id,
          tenant_ref: tenantId,
          app_action: 1,
        },
      });
      if (!existing) {
        throw new ConflictException('شعبه یافت نشد');
      }
      //#endregion

      //#region ویرایش شعبه
      await this.prisma.branches.updateMany({
        where: { id, tenant_ref: tenantId, app_action: 1 },
        data: {
          bimeh_code: payload.bimehCode,
          bimeh_branch: payload.bimehBranch,
          code: payload.code,
          title: payload.title,
          modify_by: editor,
          modify_at: new Date(),
        },
      });
      //#endregion

      //#region حوزه کاری شعبه
      await this.prisma.branchFields.deleteMany({ where: { branch_ref: id } });
      for (const it of payload.jobFields) {
        await this.prisma.branchFields.create({
          data: {
            branch_ref: id,
            jobFieldTitle_ref: it,
            created_by: editor,
          },
        });
      }
      //#endregion

      //#region مدل شعبه
      await this.prisma.branchModels.deleteMany({ where: { branch_ref: id } });
      for (const it of payload.models) {
        await this.prisma.branchModels.create({
          data: {
            branch_ref: id,
            model: it,
            created_by: editor,
          },
        });
      }
      //#endregion

      //#region Response
      return {
        message: 'ویرایش با موفقیت انجام شد',
        statusCode: HttpStatus.OK,
      };
      //#endregion
    } catch (e: any) {
      if (e instanceof ConflictException) {
        throw e;
      }
      throw new GoneException('مشکلی در ویرایش رخ داده است');
    }
  }
  //#endregion
  //#region Delete
  async delete_branch(
    tenantId: number,
    editor: number,
    id: number,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.branches.findFirst({
        where: {
          id,
          tenant_ref: tenantId,
          app_action: 1,
        },
      });
      if (!existing) {
        throw new ConflictException('شعبه یافت نشد');
      } else {
        //#region حذف شعبه
        await this.prisma.branches.updateMany({
          where: { id, tenant_ref: tenantId, app_action: 1 },
          data: {
            app_action: 0,
            modify_by: editor,
            modify_at: new Date(),
          },
        });
        //#endregion
      }
      //#endregion
      //#region Response
      return {
        message: 'حذف با موفقیت انجام شد',
        statusCode: HttpStatus.OK,
      };
      //#endregion
    } catch (e: any) {
      if (e instanceof ConflictException) {
        throw e;
      }
      throw new GoneException('مشکلی در حذف رخ داده است');
    }
  }
  //#endregion
  //#endregion

  //#region Branch : Address
  //#region Get
  async get_branchAddress(tenantId: number, id: number) {
    try {
      //#region Check Exist
      const existing = await this.prisma.branches.findFirst({
        where: { id, tenant_ref: tenantId, app_action: 1 },
      });
      if (!existing) {
        throw new NotFoundException('شعبه یافت نشد');
      }
      else {
        //#region Transaction
        let _id = existing?.address_ref ?  existing.address_ref : 0
        const result = await this.prisma.address.findFirst({
          where: { app_action: 1, id: _id },
          select: {
            id: true,
            village: true,
            street: true,
            alley: true,
            alleyNo: true,
            building: true,
            postalCode: true,
            floor: true,
            plate: true,
            description: true,
            cities: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        });
        if (result) {
          return result;
        }
        //#endregion
      }
      //#endregion

      //#region Response Not Found
      throw new NotFoundException('آدرس ثبت نشده است');
      //#endregion
    } catch (e: any) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion
  //#region Update
  async update_branchAddress(
    tenantId: number,
    editor: number,
    id: number,
    payload: AddressDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.branches.findFirst({
        where: {
          id,
          tenant_ref: tenantId,
          app_action: 1,
        },
      });
      if (!existing) {
        throw new ConflictException('شعبه یافت نشد');
      }
      //#endregion

      //#region ویرایش آدرس
      if (existing.address_ref){
        await this.prisma.address.updateMany({
          where: { id:existing.address_ref, app_action: 1 },
          data: {
            city_ref: payload.city_ref,
            village: payload.village,
            street: payload.street,
            alley: payload.alley,
            alleyNo: payload.alleyNo,
            building: payload.building,
            postalCode: payload.postalCode,
            floor: payload.floor,
            plate: payload.plate,
            description: payload.description,
            modify_by: editor,
            modify_at: new Date(),
          },
        });
      }
      //#endregion
      //#region ثبت آدرس
      else {
        const _address =await this.prisma.address.create({
          data: {
            city_ref: payload.city_ref,
            village: payload.village,
            street: payload.street,
            alley: payload.alley,
            alleyNo: payload.alleyNo,
            building: payload.building,
            postalCode: payload.postalCode,
            floor: payload.floor,
            plate: payload.plate,
            description: payload.description,
            created_by: editor,
          },
        });
        await this.prisma.branches.updateMany({
          where: { id, tenant_ref: tenantId, app_action: 1 },
          data: {
            address_ref: _address.id,
          },
        });
      }
      //#endregion

      //#region Response
      return {
        message: 'ویرایش با موفقیت انجام شد',
        statusCode: HttpStatus.OK,
      };
      //#endregion
    } catch (e: any) {
      if (e instanceof ConflictException) {
        throw e;
      }
      throw new GoneException('مشکلی در ویرایش رخ داده است');
    }
  }
  //#endregion
  //#endregion

  //#region Branch : Phones
    //#region Create
    async create_phones(
      tenantId: number,
      creator: number,
      id: number,
      payload: CreateBranchPhonesDto,
    ): Promise<{ message: string; statusCode: number }> {
      try {
        //#region Check Exist
        const existing = await this.prisma.branches.findFirst({
          where: { id, tenant_ref: tenantId, app_action: 1 },
        });
        if (!existing) {
          throw new NotFoundException('شعبه یافت نشد');
        }

        const existingPhones = await this.prisma.branchPhones.findFirst({
          where: {
            branch_ref: id,
            operator: payload.operator,
            title: payload.title,
            phone: payload.phone,
            app_action: 1,
          },
        });
        if (existingPhones) {
          throw new ConflictException('این اطلاعات را قبلاً ثبت کرده اید');
        }
        //#endregion

        //#region Create
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
    //#region Get
    async get_phones(tenantId: number, id: number) {
      try {
        //#region Check Exist
        const existing = await this.prisma.branches.findFirst({
          where: {
            id,
            tenant_ref: tenantId,
            app_action: 1,
          },
        });
        if (!existing) {
          throw new NotFoundException('شعبه یافت نشد');
        }
        //#endregion
        //#region Transaction
        const result = await this.prisma.branchPhones.findMany({
          where: { app_action: 1, branch_ref: id },
          select: {
            id: true,
            title: true,
            phone: true,
            type: true,
            operator: true,
            created_at: true,
          },
        });
        //#endregion
        //#region Response
        return result;
        //#endregion
      } catch (e: any) {
        if (e instanceof NotFoundException) {
          throw e;
        }
        throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
      }
    }
    //#endregion
    //#region Update
    async update_phones(
      tenantId: number,
      editor: number,
      branch_id: number,
      id: number,
      payload: CreateBranchPhonesDto,
    ): Promise<{ message: string; statusCode: number }> {
      try {
        //#region Check Exist
        const existing = await this.prisma.branches.findFirst({
          where: {
            id:branch_id,
            tenant_ref: tenantId,
            app_action: 1,
          },
        });
        if (!existing) {
          throw new NotFoundException('شعبه یافت نشد');
        }
        //#endregion

        //#region ویرایش
        await this.prisma.branchPhones.updateMany({
          where: { id, app_action: 1 },
          data: {
            title: payload.title,
            type: payload.type,
            phone: payload.phone,
            operator: payload.operator,
            modify_by: editor,
            modify_at: new Date(),
          },
        });
        //#endregion

        //#region Response
        return {
          message: 'ویرایش با موفقیت انجام شد',
          statusCode: HttpStatus.OK,
        };
        //#endregion
      } catch (e: any) {
        if (e instanceof NotFoundException) {
          throw e;
        }
        throw new GoneException('مشکلی در ثبت رخ داده است');
      }
    }
    //#endregion
    //#region Delete
    async delete_phones(
      tenantId: number,
      editor: number,
      branch_id: number,
      id: number,
    ): Promise<{ message: string; statusCode: number }> {
      try {
        //#region Check Exist
        const existing = await this.prisma.branches.findFirst({
          where: {
            id:branch_id,
            tenant_ref: tenantId,
            app_action: 1,
          },
        });
        if (!existing) {
          throw new NotFoundException('شعبه یافت نشد');
        } else {
          //#region حذف
          await this.prisma.branchPhones.updateMany({
            where: { id, app_action: 1 },
            data: {
              app_action: 0,
              modify_by: editor,
              modify_at: new Date(),
            },
          });
          //#endregion
        }
        //#endregion

        //#region Response
        return {
          message: 'حذف با موفقیت انجام شد',
          statusCode: HttpStatus.OK,
        };
        //#endregion
      } catch (e: any) {
        if (e instanceof NotFoundException) {
          throw e;
        }
        throw new GoneException('مشکلی در حذف رخ داده است');
      }
    }
    //#endregion
  //#endregion

  //#region Branch : BankAccount
    //#region Create
    async create_bankAccounts(
      tenantId: number,
      creator: number,
      id: number,
      payload: CreateBranchBankDto,
    ): Promise<{ message: string; statusCode: number }> {
      try {
        //#region Check Exist
        const existing = await this.prisma.branches.findFirst({
          where: { id, tenant_ref: tenantId, app_action: 1 },
        });
        if (!existing) {
          throw new NotFoundException('شعبه یافت نشد');
        }

        const existingAccount = await this.prisma.branchBanks.findFirst({
          where: {
            branch_ref: id,
            bank_ref: payload.bank_ref,
            bankBranch: payload.bankBranch,
            title: payload.title,
            accountNo: payload.accountNo,
            app_action: 1,
          },
        });
        if (existingAccount) {
          throw new ConflictException('این اطلاعات را قبلاً ثبت کرده اید');
        }
        //#endregion

        //#region Add
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
    //#region Get
    async get_bankAccounts(tenantId: number, id: number) {
      try {
        //#region Check Exist
        const existing = await this.prisma.branches.findFirst({
          where: {
            id,
            tenant_ref: tenantId,
            app_action: 1,
          },
        });
        if (!existing) {
          throw new NotFoundException('شعبه یافت نشد');
        }
        //#endregion
        //#region Transaction
        const result = await this.prisma.branchBanks.findMany({
          where: { app_action: 1, branch_ref: id },
          select: {
            id: true,
            bank_ref: true,
            bankBranch: true,
            currency: true,
            type: true,
            title: true,
            accountNo: true,
            shabaNo: true,
            internationalAccountNo: true,
            created_by: true,
            created_at: true,
            banks: {
              select: {
                id: true,
                title: true,
              },
            }
          },
        });
        //#endregion
        //#region Response
        return result;
        //#endregion
      } catch (e: any) {
        if (e instanceof NotFoundException) {
          throw e;
        }
        throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
      }
    }
    //#endregion
    //#region Update
    async update_bankAccounts(
      tenantId: number,
      editor: number,
      branch_id: number,
      id: number,
      payload: CreateBranchBankDto,
    ): Promise<{ message: string; statusCode: number }> {
      try {
        //#region Check Exist
        const existing = await this.prisma.branches.findFirst({
          where: {
            id:branch_id,
            tenant_ref: tenantId,
            app_action: 1,
          },
        });
        if (!existing) {
          throw new NotFoundException('شعبه یافت نشد');
        }
        //#endregion

        //#region ویرایش
        await this.prisma.branchBanks.updateMany({
          where: { id, app_action: 1 },
          data: {
            bank_ref: payload.bank_ref,
            bankBranch: payload.bankBranch,
            currency: payload.currency,
            type: payload.type,
            title: payload.title,
            accountNo: payload.accountNo,
            shabaNo: payload.shabaNo,
            internationalAccountNo: payload.internationalAccountNo,
            modify_by: editor,
            modify_at: new Date(),
          },
        });
        //#endregion

        //#region Response
        return {
          message: 'ویرایش با موفقیت انجام شد',
          statusCode: HttpStatus.OK,
        };
        //#endregion
      } catch (e: any) {
        if (e instanceof NotFoundException) {
          throw e;
        }
        throw new GoneException('مشکلی در ویرایش رخ داده است');
      }
    }
    //#endregion
    //#region Delete
    async delete_bankAccounts(
      tenantId: number,
      editor: number,
      branch_id: number,
      id: number,
    ): Promise<{ message: string; statusCode: number }> {
      try {
        //#region Check Exist
        const existing = await this.prisma.branches.findFirst({
          where: {
            id:branch_id,
            tenant_ref: tenantId,
            app_action: 1,
          },
        });
        if (!existing) {
          throw new NotFoundException('شعبه یافت نشد');
        } else {
          //#region حذف
          await this.prisma.branchBanks.updateMany({
            where: { id, app_action: 1 },
            data: {
              app_action: 0,
              modify_by: editor,
              modify_at: new Date(),
            },
          });
          //#endregion
        }
        //#endregion

        //#region Response
        return {
          message: 'حذف با موفقیت انجام شد',
          statusCode: HttpStatus.OK,
        };
        //#endregion
      } catch (e: any) {
        if (e instanceof NotFoundException) {
          throw e;
        }
        throw new GoneException('مشکلی در حذف رخ داده است');
      }
    }
    //#endregion
  //#endregion

  //#region Branch : Department
  //#region Create
  async create_department(
    tenantId: number,
    creator: number,
    id: number,
    payload: CreateDepartmentDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.branches.findFirst({
        where: {
          id,
          tenant_ref: tenantId,
          app_action: 1,
        },
      });
      if (!existing) {
        throw new NotFoundException('شعبه یافت نشد');
      }

      const existingDepartment = await this.prisma.branchDepartments.findFirst({
        where: {
          branch_ref: id,
          title: payload.title,
          parent_ref: payload.parent_ref,
          app_action: 1,
        },
      });
      if (existingDepartment) {
        throw new ConflictException('این اطلاعات را قبلاً ثبت کرده اید');
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
  //#region Get
  async get_department(tenantId: number, id: number) {
    try {
      //#region Check Exist
      const existing = await this.prisma.branches.findFirst({
        where: {
          id,
          tenant_ref: tenantId,
          app_action: 1,
        },
      });
      if (!existing) {
        throw new NotFoundException('شعبه یافت نشد');
      }
      //#endregion
      //#region Transaction
      const result = await this.prisma.branchDepartments.findMany({
        where: { app_action: 1, branch_ref: id },
        select: {
          id: true,
          title: true,
          parent_ref: true,
        },
      });
      //#endregion
      //#region Response
      return result;
      //#endregion
    } catch (e: any) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion
  //#region Update
  async update_department(
    tenantId: number,
    editor: number,
    branch_id: number,
    id: number,
    payload: CreateDepartmentDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.branches.findFirst({
        where: {
          id:branch_id,
          tenant_ref: tenantId,
          app_action: 1,
        },
      });
      if (!existing) {
        throw new NotFoundException('شعبه یافت نشد');
      }
      //#endregion

      //#region ویرایش
      await this.prisma.branchDepartments.updateMany({
        where: { id, app_action: 1 },
        data: {
          title: payload.title,
          parent_ref: payload.parent_ref,
          modify_by: editor,
          modify_at: new Date(),
        },
      });
      //#endregion

      //#region Response
      return {
        message: 'ویرایش با موفقیت انجام شد',
        statusCode: HttpStatus.OK,
      };
      //#endregion
    } catch (e: any) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در ویرایش رخ داده است');
    }
  }
  //#endregion
  //#region Delete
  async delete_department(
    tenantId: number,
    editor: number,
    branch_id: number,
    id: number,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.branches.findFirst({
        where: {
          id:branch_id,
          tenant_ref: tenantId,
          app_action: 1,
        },
      });
      if (!existing) {
        throw new NotFoundException('شعبه یافت نشد');
      } else {
        //#region حذف
        await this.prisma.branchDepartments.updateMany({
          where: { id, app_action: 1 },
          data: {
            app_action: 0,
            modify_by: editor,
            modify_at: new Date(),
          },
        });
        //#endregion
      }
      //#endregion

      //#region Response
      return {
        message: 'حذف با موفقیت انجام شد',
        statusCode: HttpStatus.OK,
      };
      //#endregion
    } catch (e: any) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در حذف رخ داده است');
    }
  }
  //#endregion
  //#endregion

  //#region Branch : SocialAccounts
  //#region Create
  async create_socialAccounts(
    tenantId: number,
    creator: number,
    id: number,
    payload: CreateBranchSocialAccountsDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.branches.findFirst({
        where: {
          id,
          tenant_ref: tenantId,
          app_action: 1,
        },
      });
      if (!existing) {
        throw new NotFoundException('شعبه یافت نشد');
      }

      const existingDepartment = await this.prisma.branchSocialAccounts.findFirst({
        where: {
          branch_ref: id,
          address: payload.address,
          socialApp: payload.socialApp,
          app_action: 1,
        },
      });
      if (existingDepartment) {
        throw new ConflictException('این اطلاعات را قبلاً ثبت کرده اید');
      }
      //#endregion

      //#region Add Department
      await this.prisma.branchSocialAccounts.create({
        data: {
          branch_ref: id,
          address: payload.address,
          socialApp: payload.socialApp,
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
  //#region Get
  async get_socialAccounts(tenantId: number, id: number) {
    try {
      //#region Check Exist
      const existing = await this.prisma.branches.findFirst({
        where: {
          id,
          tenant_ref: tenantId,
          app_action: 1,
        },
      });
      if (!existing) {
        throw new NotFoundException('شعبه یافت نشد');
      }
      //#endregion
      //#region Transaction
      const result = await this.prisma.branchSocialAccounts.findMany({
        where: { app_action: 1, branch_ref: id },
        select: {
          id: true,
          address: true,
          socialApp: true,
        },
      });
      //#endregion
      //#region Response
      return result;
      //#endregion
    } catch (e: any) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion
  //#region Update
  async update_socialAccounts(
    tenantId: number,
    editor: number,
    branch_id: number,
    id: number,
    payload: CreateBranchSocialAccountsDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.branches.findFirst({
        where: {
          id:branch_id,
          tenant_ref: tenantId,
          app_action: 1,
        },
      });
      if (!existing) {
        throw new NotFoundException('شعبه یافت نشد');
      }
      //#endregion

      //#region ویرایش
      await this.prisma.branchSocialAccounts.updateMany({
        where: { id, app_action: 1 },
        data: {
          address: payload.address,
          socialApp: payload.socialApp,
          modify_by: editor,
          modify_at: new Date(),
        },
      });
      //#endregion

      //#region Response
      return {
        message: 'ویرایش با موفقیت انجام شد',
        statusCode: HttpStatus.OK,
      };
      //#endregion
    } catch (e: any) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در ویرایش رخ داده است');
    }
  }
  //#endregion
  //#region Delete
  async delete_socialAccounts(
    tenantId: number,
    editor: number,
    branch_id: number,
    id: number,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.branches.findFirst({
        where: {
          id:branch_id,
          tenant_ref: tenantId,
          app_action: 1,
        },
      });
      if (!existing) {
        throw new NotFoundException('شعبه یافت نشد');
      } else {
        //#region حذف
        await this.prisma.branchSocialAccounts.updateMany({
          where: { id, app_action: 1 },
          data: {
            app_action: 0,
            modify_by: editor,
            modify_at: new Date(),
          },
        });
        //#endregion
      }
      //#endregion

      //#region Response
      return {
        message: 'حذف با موفقیت انجام شد',
        statusCode: HttpStatus.OK,
      };
      //#endregion
    } catch (e: any) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در حذف رخ داده است');
    }
  }
  //#endregion
  //#endregion

  //#region Branch : Department Employees
  //#region Create
  async create_departmentEmployee(
    creator: number,
    department_id: number,
    payload: CreateBranchDepartmentEmployeesDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.branchDepartments.findFirst({
        where: {
          id:department_id,
          app_action: 1,
        },
      });
      if (!existing) {
        throw new NotFoundException('دپارتمان یافت نشد');
      }

      const existingDepartment = await this.prisma.branchDepartmentEmployees.findFirst({
        where: {
          department_ref: department_id,
          employee_ref: payload.employee_ref,
          post: payload.post,
          app_action: 1,
        },
      });
      if (existingDepartment) {
        throw new ConflictException('این اطلاعات را قبلاً ثبت کرده اید');
      }
      //#endregion

      //#region Add Department
      await this.prisma.branchDepartmentEmployees.create({
        data: {
          department_ref: department_id,
          employee_ref: payload.employee_ref,
          post: payload.post,
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
  //#region Get
  async get_departmentEmployee(department_id: number) {
    try {
      //#region Check Exist
      const existing = await this.prisma.branchDepartments.findFirst({
        where: {
          id:department_id,
          app_action: 1,
        },
      });
      if (!existing) {
        throw new NotFoundException('دپارتمان یافت نشد');
      }
      //#endregion
      //#region Transaction
      const result = await this.prisma.branchDepartmentEmployees.findMany({
        where: { app_action: 1, department_ref: department_id },
        select: {
          id: true,
          post: true,
          users: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              gender: true,
              mobile: true,
            },
          },
        }
      });
      //#endregion
      //#region Response
      return result;
      //#endregion
    } catch (e: any) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion
  //#region Update
  async update_departmentEmployee(
    editor: number,
    department_id: number,
    id: number,
    payload: CreateBranchDepartmentEmployeesDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      const existing = await this.prisma.branchDepartments.findFirst({
        where: {
          id:department_id,
          app_action: 1,
        },
      });
      if (!existing) {
        throw new NotFoundException('دپارتمان یافت نشد');
      }
      //#endregion

      //#region ویرایش
      await this.prisma.branchDepartmentEmployees.updateMany({
        where: { id, app_action: 1 },
        data: {
          department_ref: department_id,
          employee_ref: payload.employee_ref,
          post: payload.post,
          modify_by: editor,
          modify_at: new Date(),
        },
      });
      //#endregion

      //#region Response
      return {
        message: 'ویرایش با موفقیت انجام شد',
        statusCode: HttpStatus.OK,
      };
      //#endregion
    } catch (e: any) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در ویرایش رخ داده است');
    }
  }
  //#endregion
  //#region Delete
  async delete_departmentEmployee(
    editor: number,
    department_id: number,
    id: number,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.branchDepartments.findFirst({
        where: {
          id:department_id,
          app_action: 1,
        },
      });
      if (!existing) {
        throw new NotFoundException('دپارتمان یافت نشد');
      } else {
        //#region حذف
        await this.prisma.branchDepartmentEmployees.updateMany({
          where: { id, app_action: 1 },
          data: {
            app_action: 0,
            modify_by: editor,
            modify_at: new Date(),
          },
        });
        //#endregion
      }
      //#endregion

      //#region Response
      return {
        message: 'حذف با موفقیت انجام شد',
        statusCode: HttpStatus.OK,
      };
      //#endregion
    } catch (e: any) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در حذف رخ داده است');
    }
  }
  //#endregion
  //#endregion

}
