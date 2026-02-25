import { BadRequestException, ConflictException, GoneException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { isMobile, isNationalCode } from "../common/methods/validator";
import { Entity, BranchTypeModels, PhoneTypes, EntityType, PhoneOperators } from "src/common/enums/enums";
import { Prisma } from "@prisma/client";
import { ContactUserDto, ContactCompanyDto, FilterContactDto, ContactTag } from "./dto/contact.dto";
import { SortOrder, ToggleStateDto } from "src/common/DTOs/shared";

@Injectable()
export class ContactService {
   constructor(private readonly prisma: PrismaService) {}

   // ==============================
   // CREATE USER
   // ==============================
   async createUser(tenantId: number, creator: number, payload: ContactUserDto) {
      this.validateUserPayload(payload);

      try {
         await this.prisma.$transaction(async (tx) => {
           const { title_ref, address , ...restPayload } = payload;
            const user = await tx.users.create({
               data: {
                  entityType: EntityType.Contact,
                  tenant_ref: tenantId,
                 ...restPayload,

                 // relation: title
                 ...(title_ref && {
                   titles: {
                     connect: { id: title_ref },
                   },
                 }),
                  created_by: creator,
               },
               select: { id: true },
            });

            const addressId = await this.createAddress(tx, address, creator);

            await tx.branches.create({
               data: {
                  entity: Entity.Personal,
                  entity_ref: user.id,
                  code: "1",
                  title: "پیشفرض",
                  address_ref: addressId,
                  created_by: creator,

                  branchModels: {
                     create: {
                        model: BranchTypeModels.Home,
                        created_by: creator,
                     },
                  },

                  ...(payload.mobile && {
                     branchPhones: {
                        create: {
                           title: "تلفن همراه",
                           phone: payload.mobile,
                           type: PhoneTypes.Mobile,
                           operator: PhoneOperators.Unknown,
                           created_by: creator,
                        },
                     },
                  }),
               },
            });
         });

         return {
            message: "ثبت با موفقیت انجام شد",
            statusCode: HttpStatus.CREATED,
         };
      } catch (error) {
         this.handlePrismaError(error);
      }
   }

   // ==============================
   // CREATE COMPANY
   // ==============================
   async createCompany(tenantId: number, creator: number, payload: ContactCompanyDto) {
      try {
         await this.prisma.$transaction(async (tx) => {
           const { address , ...restPayload } = payload;
            const company = await tx.companies.create({
               data: {
                  entityType: EntityType.Contact,
                  tenant_ref: tenantId,
                  ...restPayload,
                  created_by: creator,
               },
               select: { id: true },
            });

            const addressId = await this.createAddress(tx, address, creator);

            await tx.branches.create({
               data: {
                  entity: Entity.Company,
                  entity_ref: company.id,
                  code: "1",
                  title: "مرکزی",
                  address_ref: addressId,
                  created_by: creator,

                  branchModels: {
                     create: {
                        model: BranchTypeModels.OfficeCenter,
                        created_by: creator,
                     },
                  },
               },
            });
         });

         return {
            message: "ثبت با موفقیت انجام شد",
            statusCode: HttpStatus.CREATED,
         };
      } catch (error) {
         this.handlePrismaError(error);
      }
   }

   // ==============================
   // COMPANY : Toggle Customer State
   // ==============================
   async toggleCompanyCustomerState(
      tenantId: number,
      editor: number,
      payload: ToggleStateDto,
      id: number,
   ): Promise<{ message: string; statusCode: number }> {
      try {
         const result = await this.prisma.companies.updateMany({
            where: {
               id,
               tenant_ref: tenantId,
               entityType: EntityType.Contact,
               app_action: 1,
            },
            data: {
               isCustomer: payload.state,
               modify_by: editor,
               modify_at: new Date(),
            },
         });

         if (result.count === 0) {
            throw new NotFoundException("شرکتی با این اطلاعات یافت نشد");
         }

         return {
            message: "وضعیت مشتری با موفقیت تغییر یافت",
            statusCode: HttpStatus.OK,
         };
      } catch (error) {
         if (error instanceof NotFoundException) throw error;
         throw new GoneException("مشکلی در عملیات رخ داده است");
      }
   }

   // ==============================
   // User : Toggle Customer State
   // ==============================
   async toggleUserCustomerState(
      tenantId: number,
      editor: number,
      payload: ToggleStateDto,
      id: number,
   ): Promise<{ message: string; statusCode: number }> {
      try {
         const result = await this.prisma.users.updateMany({
            where: {
               id,
               tenant_ref: tenantId,
               entityType: EntityType.Contact,
               app_action: 1,
            },
            data: {
               isCustomer: payload.state,
               modify_by: editor,
               modify_at: new Date(),
            },
         });

         if (result.count === 0) {
            throw new NotFoundException("مخاطبی با این اطلاعات یافت نشد");
         }

         return {
            message: "وضعیت مشتری با موفقیت تغییر یافت",
            statusCode: HttpStatus.OK,
         };
      } catch (error) {
         if (error instanceof NotFoundException) throw error;
         throw new GoneException("مشکلی در عملیات رخ داده است");
      }
   }

   // ==============================
   // Company : Find Sharable Company By NationalCode
   // ==============================
   async findCompanyByNationalCode(nationalCode: string) {
      // پیدا کردن شرکت اصلی فعال
      const company = await this.prisma.companies.findFirst({
         where: {
            nationalCode,
            entityType: EntityType.Primary,
            app_action: 1,
         },
         select: {
            id: true,
            organType: true,
            type: true,
            stateType: true,
            title: true,
            brand: true,
            nationalCode: true,
            insertNumber: true,
            insertDate: true,
            shahabCode: true,
            ecoNumber: true,
            description: true,
         },
      });

      if (!company) {
         throw new NotFoundException("اطلاعاتی یافت نشد");
      }

      // بررسی مجاز بودن اشتراک اطلاعات
      const tenant = await this.prisma.tenants.findFirst({
         where: {
            entity_ref: company.id,
            entity: Entity.Company,
            app_action: 1,
            allowSharing: true,
         },
         select: { id: true },
      });

      // اگر اشتراک مجاز نبود، عمداً مثل حالت نبودن شرکت رفتار می‌کنیم (امنیتی)
      if (!tenant) {
         throw new NotFoundException("اطلاعاتی یافت نشد");
      }

      return company;
   }

   // ==============================
   // User : Find Sharable User By Mobile
   // ==============================
   async findUserByMobile(mobile: string) {
      // پیدا کردن کاربر اصلی فعال
      const person = await this.prisma.users.findFirst({
         where: {
            mobile,
            entityType: EntityType.Primary,
            app_action: 1,
         },
         select: {
            id: true,
            gender: true,
            title_ref: true,
            firstname: true,
            lastname: true,
            mobile: true,
            description: true,
            ecoNumber: true,
         },
      });

      if (!person) {
         throw new NotFoundException("اطلاعاتی یافت نشد");
      }

      // بررسی مجاز بودن اشتراک اطلاعات
      const tenant = await this.prisma.tenants.findFirst({
         where: {
            entity_ref: person.id,
            entity: Entity.Personal,
            app_action: 1,
            allowSharing: true,
         },
         select: { id: true },
      });

      // اگر اشتراک مجاز نبود، عمداً مثل حالت نبودن کاربر رفتار می‌کنیم (امنیتی)
      if (!tenant) {
         throw new NotFoundException("اطلاعاتی یافت نشد");
      }

      return person;
   }

   // ==============================
   // User : Get
   // ==============================
   async getUser(tenantId: number, id: number) {
      return this.fetchEntityWithBranch(tenantId, id, "user");
   }

   // ==============================
   // Company : Get
   // ==============================
   async getCompany(tenantId: number, id: number) {
      return this.fetchEntityWithBranch(tenantId, id, "company");
   }

   // ==============================
   // Get All Contacts (Users + Companies)
   // ==============================
   async getAll(tenantId: number, filter: FilterContactDto) {
      try {
         const { search, order, pagination, tag } = filter;

         // ================== Order ==================
         const allowedOrderFields = ["created_at", "title", "brand", "firstname", "lastname"];
         const orderByField = allowedOrderFields.includes(order?.orderBy) ? order.orderBy : "created_at";
         const direction = order?.order === SortOrder.ASC ? "asc" : "desc";
         const orderByCompanies: Prisma.CompaniesOrderByWithRelationInput = { [orderByField]: direction };
         const orderByUsers: Prisma.UsersOrderByWithRelationInput = { [orderByField]: direction };

         // ================== Pagination ==================
         const currentPage = pagination?.page || 1;
         const pageSize = Math.min(pagination?.pageSize || 10, 100);
         const skip = (currentPage - 1) * pageSize;

         // ================== Where Clauses ==================
         const companyWhere: Prisma.CompaniesWhereInput = {
            app_action: 1,
            entityType: EntityType.Contact,
            tenant_ref: tenantId,
            AND: tag?.includes(ContactTag.Company) || !tag?.length ? {} : undefined,
            OR: search
               ? [
                    { title: { contains: search } },
                    { description: { contains: search } },
                    { nationalCode: { contains: search } },
                    { insertNumber: { contains: search } },
                    { brand: { contains: search } },
                 ]
               : undefined,
         };

         const userWhere: Prisma.UsersWhereInput = {
            app_action: 1,
            entityType: EntityType.Contact,
            tenant_ref: tenantId,
            AND: tag?.includes(ContactTag.User) || !tag?.length ? {} : undefined,
            OR: search
               ? [
                    { firstname: { contains: search } },
                    { lastname: { contains: search } },
                    { description: { contains: search } },
                    { mobile: { contains: search } },
                    { nationalCode: { contains: search } },
                 ]
               : undefined,
         };

         // ================== Transaction ==================
         const [companies, users, totalCompanies, totalUsers] = await this.prisma.$transaction([
            this.prisma.companies.findMany({
               where: companyWhere,
               orderBy: orderByCompanies,
               skip,
               take: pageSize,
               select: {
                  id: true,
                  title: true,
                  description: true,
                  nationalCode: true,
                  brand: true,
                  type: true,
                  stateType: true,
                  organType: true,
                  isCustomer: true,
               },
            }),
            this.prisma.users.findMany({
               where: userWhere,
               orderBy: orderByUsers,
               skip,
               take: pageSize,
               select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                  gender: true,
                  mobile: true,
                  nationalCode: true,
                  ecoNumber: true,
                  description: true,
                  isCustomer: true,
               },
            }),
            this.prisma.companies.count({ where: companyWhere }),
            this.prisma.users.count({ where: userWhere }),
         ]);

         // ================== Merge Results ==================
         const results: any[] = [];
         if (!tag || tag.includes(ContactTag.Company)) results.push(...companies.map((c) => ({ ...c, type: "Company" })));
         if (!tag || tag.includes(ContactTag.User)) results.push(...users.map((u) => ({ ...u, type: "User" })));

         const totalItems = totalCompanies + totalUsers;
         const totalPages = Math.ceil(totalItems / pageSize);

         // ================== Response ==================
         return {
            results,
            totalItems,
            totalPages,
            currentPage,
            message: "موفق",
         };
      } catch (e: any) {
         throw new GoneException("مشکلی در دریافت اطلاعات رخ داده است");
      }
   }

   // ==============================
   // PRIVATE METHODS
   // ==============================

   private validateUserPayload(payload: ContactUserDto) {
      if (payload.mobile) {
         const check = isMobile(payload.mobile);
         if (!check.status) throw new BadRequestException(check.message);
      }

      if (payload.nationalCode) {
         const check = isNationalCode(payload.nationalCode);
         if (!check.status) throw new BadRequestException(check.message);
      }
   }

   private async createAddress(tx: Prisma.TransactionClient, address: any, creator: number): Promise<number | undefined> {
      if (!address) return undefined;

      const created = await tx.address.create({
         data: {
            ...address,
            created_by: creator,
         },
         select: { id: true },
      });

      return created.id;
   }

   private handlePrismaError(error: any): never {
     console.log('error : ' , error)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
         const target = (error.meta as any)?.target;

         if (target?.includes("mobile")) throw new ConflictException("شماره موبایل تکراری است");

         if (target?.includes("nationalCode")) throw new ConflictException("کد ملی تکراری است");

         if (target?.includes("title")) throw new ConflictException("عنوان تکراری است");

         throw new ConflictException("اطلاعات تکراری است");
      }

      throw new GoneException("مشکلی در ثبت رخ داده است");
   }

   // ==============================
   // Private helper: Fetch entity with branch info
   // ==============================
   private async fetchEntityWithBranch(tenantId: number, id: number, type: "user" | "company") {
      if (type === "user") {
         // کاربران
         const user = await this.prisma.users.findFirst({
            where: { id, tenant_ref: tenantId, app_action: 1, entityType: EntityType.Contact },
            select: {
               title_ref: true,
               firstname: true,
               lastname: true,
               gender: true,
               avatar: true,
               mobile: true,
               nationalCode: true,
               ecoNumber: true,
               description: true,
               isCustomer: true,
            },
         });

         if (!user) throw new NotFoundException("مخاطبی با این اطلاعات یافت نشد");

         const branch = await this.prisma.branches.findFirst({
            where: { entity_ref: id, entity: Entity.Personal, app_action: 1 },
            select: { code: true, title: true },
         });

         return { ...user, branch };
      } else {
         // شرکت‌ها
         const company = await this.prisma.companies.findFirst({
            where: { id, tenant_ref: tenantId, app_action: 1, entityType: EntityType.Contact },
            select: {
               title_ref: true,
               title: true,
               logo: true,
               description: true,
               nationalCode: true,
               insertNumber: true,
               insertDate: true,
               brand: true,
               ecoNumber: true,
               shahabCode: true,
               type: true,
               stateType: true,
               organType: true,
               isCustomer: true,
            },
         });

         if (!company) throw new NotFoundException("شرکتی با این اطلاعات یافت نشد");

         const branch = await this.prisma.branches.findFirst({
            where: { entity_ref: id, entity: Entity.Company, app_action: 1 },
            select: { code: true, title: true },
         });

         return { ...company, branch };
      }
   }
}
