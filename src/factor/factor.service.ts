import {
  ConflictException,
  GoneException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FactorDto, FactorPolicyDto, OrderDto } from './dto/factor.dto';
import { FilterDto, SortOrder } from 'src/common/DTOs/shared';
import { Prisma } from '@prisma/client';
import { FactorType } from '../common/enums/enums';
@Injectable()
class FactorService {
  constructor(private readonly prisma: PrismaService) {}

  //#region Factor
  //#region Create Factor
  async createFactor(
    tenantId: number,
    creator: number,
    payload: FactorDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      if (payload.factor_type == FactorType.Master) {
        const existing = await this.prisma.factors.findFirst({
          where: { tenant_ref: tenantId, code: payload.code, app_action: 1 },
        });
        if (existing) {
          throw new ConflictException('شناسه فاکتور تکراری است');
        }
      }
      const existing_2 = await this.prisma.factors.findFirst({
        where: { tenant_ref: tenantId, serial: payload.serial, app_action: 1 },
      });
      if (existing_2) {
        throw new ConflictException('سریال ( ردیف ) فاکتور تکراری است');
      }
      //#endregion

      //#region Create Factor
      const _factor = await this.prisma.factors.create({
        data: {
          tenant_ref: tenantId,
          order_ref: +payload.order_ref,
          entity: payload.entity,
          entity_ref: +payload.entity_ref,
          factor_type: payload.factor_type,
          code: payload.code ? +payload.code : 0,
          serial: payload.serial,
          date: new Date(payload.date),
          sign_state: payload.sign_state,
          description: payload.description,
          policies: payload.policies,
          created_by: creator,
        },
      });
      //#endregion

      if (_factor) {
        for (const it of payload.items) {
          await this.prisma.factorItems.create({
            data: {
              factor_ref: _factor.id,
              product_ref: it.product_ref,
              count: it.count.toString(),
              weightType: it.weightType,
              baseFee: it.baseFee.toString(),
              allFee: it.allFee.toString(),
              sumBeforeDiscount: it.sumBeforeDiscount.toString(),
              sumAfterDiscount: it.sumAfterDiscount.toString(),
              sumFinal: it.sumFinal.toString(),
              tax: it.tax.toString(),
              discount: it.discount.toString(),
              description: it.description,
              created_by: creator,
            },
          });
        }
      } else {
        throw new GoneException('مشکلی در ثبت رخ داده است');
      }

      //#region Response
      return {
        message: 'ثبت با موفقیت انجام شد',
        statusCode: HttpStatus.CREATED,
      };
      //#endregion
    } catch (e: any) {
      console.log(e);
      if (e instanceof ConflictException) {
        throw e;
      }
      if (e instanceof GoneException) {
        throw e;
      }
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در ثبت رخ داده است');
    }
  }
  //#endregion
  //#region Update Factor
  async updateFactor(
    tenantId: number,
    editor: number,
    factorId: number,
    payload: FactorDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.factors.findFirst({
        where: { tenant_ref: tenantId, id: factorId, app_action: 1 },
      });
      if (!existing) {
        throw new GoneException('فاکتور یافت نشد');
      }
      //#endregion

      //#region Check Code
      const existingCode = await this.prisma.factors.findFirst({
        where: {
          tenant_ref: tenantId,
          code: payload.code,
          id: { not: factorId },
          app_action: 1,
        },
      });
      if (existingCode) {
        throw new ConflictException('شماره فاکتور تکراری است');
      }
      const existing_2 = await this.prisma.factors.findFirst({
        where: {
          tenant_ref: tenantId,
          serial: payload.serial,
          id: { not: factorId },
          app_action: 1,
        },
      });
      if (existing_2) {
        throw new ConflictException('سریال ( ردیف ) فاکتور تکراری است');
      }
      //#endregion

      //#region Update Factor
      const _factor = await this.prisma.factors.updateMany({
        where: {
          id: factorId,
        },
        data: {
          entity: payload.entity,
          entity_ref: +payload.entity_ref,
          factor_type: payload.factor_type,
          code: payload.code ? +payload.code : 0,
          serial: payload.serial,
          date: new Date(payload.date),
          sign_state: payload.sign_state,
          description: payload.description,
          policies: payload.policies,
          modify_by: editor,
          modify_at: new Date(),
        },
      });
      //#endregion

      if (_factor) {
        await this.prisma.factorItems.deleteMany({
          where: { factor_ref: factorId },
        });
        for (const it of payload.items) {
          await this.prisma.factorItems.create({
            data: {
              factor_ref: factorId,
              product_ref: it.product_ref,
              count: it.count.toString(),
              weightType: it.weightType,
              baseFee: it.baseFee.toString(),
              allFee: it.allFee.toString(),
              sumBeforeDiscount: it.sumBeforeDiscount.toString(),
              sumAfterDiscount: it.sumAfterDiscount.toString(),
              sumFinal: it.sumFinal.toString(),
              tax: it.tax.toString(),
              discount: it.discount.toString(),
              description: it.description,
              created_by: editor,
            },
          });
        }
      } else {
        throw new GoneException('مشکلی در ویرایش رخ داده است');
      }

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
      if (e instanceof GoneException) {
        throw e;
      }
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در ثبت رخ داده است');
    }
  }
  //#endregion
  //#region Delete Factor
  async deleteFactor(
    tenantId: number,
    editor: number,
    factorId: number,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.factors.findFirst({
        where: { tenant_ref: tenantId, id: factorId, app_action: 1 },
      });
      if (!existing) {
        throw new GoneException('فاکتور یافت نشد');
      }
      //#endregion

      //#region Update Factor
      const _factor = await this.prisma.factors.updateMany({
        where: {
          id: factorId,
        },
        data: {
          app_action: 0,
          modify_by: editor,
          modify_at: new Date(),
        },
      });
      //#endregion

      if (_factor) {
        await this.prisma.factorItems.updateMany({
          where: { factor_ref: factorId },
          data: {
            app_action: 0,
            modify_by: editor,
            modify_at: new Date(),
          },
        });
      } else {
        throw new GoneException('مشکلی در حذف رخ داده است');
      }

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
      if (e instanceof GoneException) {
        throw e;
      }
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در ثبت رخ داده است');
    }
  }
  //#endregion
  //#region Get Factor
  async getFactor(tenantId: number, factorId: number) {
    try {
      //#region Check Exist
      const existing = await this.prisma.factors.findFirst({
        where: { tenant_ref: tenantId, id: factorId, app_action: 1 },
        select: {
          id: true,
          entity: true,
          entity_ref: true,
          factor_type: true,
          serial: true,
          code: true,
          description: true,
          sign_state: true,
          policies: true,
          date: true,
          created_at: true,
          created_by: true,
          FactorItems: true,
        },
      });
      if (!existing) {
        throw new GoneException('فاکتور یافت نشد');
      } else {
        return existing;
      }
      //#endregion
    } catch (e: any) {
      if (e instanceof ConflictException) {
        throw e;
      }
      if (e instanceof GoneException) {
        throw e;
      }
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در دریافت رخ داده است');
    }
  }
  //#endregion
  //#region Get Factor By Order ID
  async getFactorByOrderID(tenantId: number, orderId: number) {
    try {
      //#region Check Exist
      const existing = await this.prisma.factors.findMany({
        where: { tenant_ref: tenantId, order_ref: orderId, app_action: 1 },
        select: {
          id: true,
          entity: true,
          entity_ref: true,
          factor_type: true,
          serial: true,
          code: true,
          description: true,
          sign_state: true,
          policies: true,
          date: true,
          created_at: true,
          created_by: true,
          FactorItems: true,
        },
      });
      if (!existing) {
        throw new GoneException('فاکتور یافت نشد');
      } else {
        return existing;
      }
      //#endregion
    } catch (e: any) {
      if (e instanceof ConflictException) {
        throw e;
      }
      if (e instanceof GoneException) {
        throw e;
      }
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در دریافت رخ داده است');
    }
  }
  //#endregion
  //#region Get All Factors
  async getAll(tenantId: number, filter: FilterDto) {
    try {
      //#region Payload
      const { search, order, pagination } = filter;
      //#endregion

      //#region Where
      const where: Prisma.FactorsWhereInput = search
        ? {
            app_action: 1,
            tenant_ref: tenantId,
          }
        : { app_action: 1, tenant_ref: tenantId };
      //#endregion
      //#region Order
      const allowedOrderFields = ['created_at'];
      const orderByField = allowedOrderFields.includes(order?.orderBy)
        ? order.orderBy
        : 'created_at';
      // @ts-ignore
      const direction = order?.order == 1 ? SortOrder.ASC : SortOrder.DESC;

      const orderBy: Prisma.FactorsOrderByWithRelationInput = {
        [orderByField]: direction,
      };
      //#endregion
      //#region Pagination
      const currentPage = pagination?.page || 1;
      const pageSize = Math.min(pagination?.pageSize || 10, 100); // حداکثر 100
      const skip = (currentPage - 1) * pageSize;
      //#endregion
      //#region Transaction
      const [results, totalItems] = await this.prisma.$transaction([
        this.prisma.factors.findMany({
          where,
          orderBy,
          skip,
          take: pageSize,
          select: {
            id: true,
            entity: true,
            entity_ref: true,
            factor_type: true,
            code: true,
            serial: true,
            date: true,
            created_at: true,
            created_by: true,
            FactorItems: true,
          },
        }),
        this.prisma.factors.count({ where }),
      ]);
      const totalPages = Math.ceil(totalItems / pageSize);
      //#endregion
      //#region Response
      return {
        results,
        totalItems,
        totalPages,
        currentPage,
        message: 'موفق',
      };
      //#endregion
    } catch (e: any) {
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion
  //#endregion

  //#region Factor Policy
  //#region Create Factor Policy
  async createFactorPolicy(
    creator: number,
    payload: FactorPolicyDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Create Factor
      const _factor = await this.prisma.factorPolicies.create({
        data: {
          text: payload.text,
          is_selected: payload.is_selected,
          position: payload.position,
          created_by: creator,
        },
      });
      //#endregion
      if (!_factor) {
        throw new GoneException('مشکلی در ثبت رخ داده است');
      }

      //#region Response
      return {
        message: 'ثبت با موفقیت انجام شد',
        statusCode: HttpStatus.CREATED,
      };
      //#endregion
    } catch (e: any) {
      console.log(e);
      if (e instanceof ConflictException) {
        throw e;
      }
      if (e instanceof GoneException) {
        throw e;
      }
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در ثبت رخ داده است');
    }
  }
  //#endregion
  //#region Update Factor Policy
  async updateFactorPolicy(
    editor: number,
    id: number,
    payload: FactorPolicyDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.factorPolicies.findFirst({
        where: { id, app_action: 1 },
      });
      if (!existing) {
        throw new GoneException('گزینه یافت نشد');
      }
      //#endregion

      //#region Update Factor
      const _factor = await this.prisma.factorPolicies.updateMany({
        where: { id },
        data: {
          text: payload.text,
          is_selected: payload.is_selected,
          position: payload.position,
          modify_by: editor,
          modify_at: new Date(),
        },
      });
      //#endregion

      if (!_factor) {
        throw new GoneException('مشکلی در ویرایش رخ داده است');
      }

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
      if (e instanceof GoneException) {
        throw e;
      }
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در ثبت رخ داده است');
    }
  }
  //#endregion
  //#region Delete Factor Policy
  async deletePolicyFactor(
    editor: number,
    id: number,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.factorPolicies.findFirst({
        where: { id, app_action: 1 },
      });
      if (!existing) {
        throw new GoneException('گزینه یافت نشد');
      }
      //#endregion

      //#region Update Factor
      const _factor = await this.prisma.factorPolicies.updateMany({
        where: {
          id,
        },
        data: {
          app_action: 0,
          modify_by: editor,
          modify_at: new Date(),
        },
      });
      //#endregion

      if (!_factor) {
        throw new GoneException('مشکلی در حذف رخ داده است');
      }

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
      if (e instanceof GoneException) {
        throw e;
      }
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در ثبت رخ داده است');
    }
  }
  //#endregion
  //#region Get All Factor Policies
  async getAllPolicies(filter: FilterDto) {
    try {
      //#region Payload
      const { search, order, pagination } = filter;
      //#endregion

      //#region Where
      const where: Prisma.FactorPoliciesWhereInput = search
        ? {
            app_action: 1,
          }
        : { app_action: 1 };
      //#endregion
      //#region Order
      const allowedOrderFields = ['position'];
      const orderByField = allowedOrderFields.includes(order?.orderBy)
        ? order.orderBy
        : 'position';
      // @ts-ignore
      const direction = order?.order == 1 ? SortOrder.ASC : SortOrder.DESC;

      const orderBy: Prisma.FactorPoliciesOrderByWithRelationInput = {
        [orderByField]: direction,
      };
      //#endregion
      //#region Pagination
      const currentPage = pagination?.page || 1;
      const pageSize = Math.min(pagination?.pageSize || 10, 100); // حداکثر 100
      const skip = (currentPage - 1) * pageSize;
      //#endregion
      //#region Transaction
      const [results, totalItems] = await this.prisma.$transaction([
        this.prisma.factorPolicies.findMany({
          where,
          orderBy,
          skip,
          take: pageSize,
          select: {
            id: true,
            text: true,
            position: true,
            is_selected: true,
          },
        }),
        this.prisma.factorPolicies.count({ where }),
      ]);
      const totalPages = Math.ceil(totalItems / pageSize);
      //#endregion
      //#region Response
      return {
        results,
        totalItems,
        totalPages,
        currentPage,
        message: 'موفق',
      };
      //#endregion
    } catch (e: any) {
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion
  //#endregion

  //#region Order
  //#region Create Order
  async createOrder(
    creator: number,
    payload: OrderDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Create Order
      const availableCount = await this.prisma.orders.count();
      const _order = await this.prisma.orders.create({
        data: {
          from: payload.from,
          to: payload.to,
          code: availableCount + 1,
          from_date: new Date(payload.from_date),
          to_date: new Date(payload.to_date),
          description: payload.description,
          created_by: creator,
        },
      });
      //#endregion

      if (_order) {
        let counter = 0;
        for (const it of payload.items) {
          counter += 1;
          await this.prisma.orderItems.create({
            data: {
              order_ref: _order.id,
              product_ref: it.product_ref,
              code: counter,
              count: it.count.toString(),
              weightType: it.weightType,
              description: it.description,
              created_by: creator,
            },
          });
        }
      } else {
        throw new GoneException('مشکلی در ثبت رخ داده است');
      }

      //#region Response
      return {
        message: 'ثبت با موفقیت انجام شد',
        statusCode: HttpStatus.CREATED,
      };
      //#endregion
    } catch (e: any) {
      console.log(e);
      if (e instanceof ConflictException) {
        throw e;
      }
      if (e instanceof GoneException) {
        throw e;
      }
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در ثبت رخ داده است');
    }
  }
  //#endregion
  //#region Update Order
  async updateOrder(
    editor: number,
    nationalCode: string,
    orderId: number,
    payload: OrderDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.orders.findFirst({
        where: {
          OR: [{ from: nationalCode }, { to: nationalCode }],
          id: orderId,
          app_action: 1,
        },
      });
      if (!existing) {
        throw new GoneException('سفارش یافت نشد');
      }
      //#endregion

      //#region Update Factor
      const _factor = await this.prisma.orders.updateMany({
        where: {
          id: orderId,
        },
        data: {
          from: payload.from,
          to: payload.to,
          from_date: new Date(payload.from_date),
          to_date: new Date(payload.to_date),
          description: payload.description,
          modify_by: editor,
          modify_at: new Date(),
        },
      });
      //#endregion

      if (_factor) {
        await this.prisma.orderItems.deleteMany({
          where: { order_ref: orderId },
        });
        for (const it of payload.items) {
          await this.prisma.orderItems.create({
            data: {
              order_ref: orderId,
              product_ref: it.product_ref,
              count: it.count.toString(),
              weightType: it.weightType,
              description: it.description,
              created_by: editor,
            },
          });
        }
      } else {
        throw new GoneException('مشکلی در ویرایش رخ داده است');
      }

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
      if (e instanceof GoneException) {
        throw e;
      }
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در ثبت رخ داده است');
    }
  }
  //#endregion
  //#region Delete Order
  async deleteOrder(
    nationalCode: string,
    editor: number,
    orderId: number,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.orders.findFirst({
        where: { from: nationalCode, id: orderId, app_action: 1 },
      });
      if (!existing) {
        throw new GoneException('سفارش یافت نشد');
      }
      //#endregion

      //#region Update Order
      const _order = await this.prisma.orders.updateMany({
        where: {
          id: orderId,
        },
        data: {
          app_action: 0,
          modify_by: editor,
          modify_at: new Date(),
        },
      });
      //#endregion

      if (_order) {
        await this.prisma.orderItems.updateMany({
          where: { order_ref: orderId },
          data: {
            app_action: 0,
            modify_by: editor,
            modify_at: new Date(),
          },
        });
      } else {
        throw new GoneException('مشکلی در حذف رخ داده است');
      }

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
      if (e instanceof GoneException) {
        throw e;
      }
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در حذف رخ داده است');
    }
  }
  //#endregion
  //#region Get Order
  async getOrder(nationalCode: string, orderId: number) {
    try {
      //#region Check Exist
      const existing = await this.prisma.orders.findFirst({
        where: {
          id: orderId,
          OR: [{ from: nationalCode }, { to: nationalCode }],
          app_action: 1,
        },
        select: {
          id: true,
          from: true,
          to: true,
          code: true,
          description: true,
          from_date: true,
          to_date: true,
          created_at: true,
          created_by: true,
          OrderItems: true,
        },
      });
      if (!existing) {
        throw new GoneException('سفارش یافت نشد');
      } else {
        return existing;
      }
      //#endregion
    } catch (e: any) {
      if (e instanceof ConflictException) {
        throw e;
      }
      if (e instanceof GoneException) {
        throw e;
      }
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در دریافت رخ داده است');
    }
  }
  //#endregion
  //#region Get All Factors
  async getAllOrders(
    tenantId: number,
    nationalCode: string,
    filter: FilterDto,
  ) {
    try {
      //#region Payload
      const { search, type, order, pagination } = filter;
      //#endregion

      //#region Where
      const where: Prisma.OrdersWhereInput = {
        app_action: 1,
        OR: (() => {
          // شرط اول: بررسی type برای فیلتر کردن بر اساس from یا to
          if (type === 'Sent') {
            return [{ from: nationalCode }];
          } else if (type === 'Received') {
            return [{ to: nationalCode }];
          }

          // شرط دوم: اگر search وجود داشت، جستجو در code انجام می‌شود
          // توجه: چون فیلد code عددی است، از contains استفاده نمی‌کنیم و باید برابری را چک کنیم
          if (search) {
            // اگر search رشته است، باید به عدد تبدیل شود تا با فیلد عددی code مطابقت داشته باشد
            const codeNumber = Number(search);
            if (!isNaN(codeNumber)) {
              return [{ code: codeNumber }];
            }
          }

          // حالت پیش‌فرض: اگر شرطی برقرار نبود
          return [];
        })(),
      };
      //#endregion
      //#region Order
      const allowedOrderFields = ['created_at'];
      const orderByField = allowedOrderFields.includes(order?.orderBy)
        ? order.orderBy
        : 'created_at';
      // @ts-ignore
      const direction = order?.order == 1 ? SortOrder.ASC : SortOrder.DESC;

      const orderBy: Prisma.OrdersOrderByWithRelationInput = {
        [orderByField]: direction,
      };
      //#endregion
      //#region Pagination
      const currentPage = pagination?.page || 1;
      const pageSize = Math.min(pagination?.pageSize || 10, 100); // حداکثر 100
      const skip = (currentPage - 1) * pageSize;
      //#endregion
      //#region Transaction
      const [results, totalItems] = await this.prisma.$transaction([
        this.prisma.orders.findMany({
          where,
          orderBy,
          skip,
          take: pageSize,
          select: {
            id: true,
            from: true,
            to: true,
            code: true,
            from_date: true,
            to_date: true,
            description: true,
            created_at: true,
            created_by: true,
            OrderItems: true,
          },
        }),
        this.prisma.orders.count({ where }),
      ]);
      const totalPages = Math.ceil(totalItems / pageSize);
      //#endregion

      //#region Add Customer Titles
      const [CS_Companies, CS_Users, CS_Tenants, Factors] = await Promise.all([
        this.prisma.companies.findMany({
          where: { tenant_ref: tenantId, app_action: 1 },
          select: { nationalCode: true, title: true },
        }),
        this.prisma.users.findMany({
          where: { tenant_ref: tenantId, app_action: 1 },
          select: { nationalCode: true, firstname: true, lastname: true },
        }),
        this.prisma.tenants.findMany({
          where: { app_action: 1 },
          select: { nationalCode: true, title: true },
        }),
        this.prisma.factors.findMany({
          where: {
            app_action: 1,
            order_ref: { in: results.map((ib: any) => ib.id)},
          },
          select: { order_ref: true,  factor_type: true, FactorItems: {select : {count:true,product_ref:true}} }
        }),
      ]);

      //#region ساخت Map برای جستجوی سریع‌تر
      const companyMap = new Map(
        CS_Companies.map((c) => [c.nationalCode, c.title]),
      );
      const userMap = new Map(
        CS_Users.map((u) => [u.nationalCode, `${u.firstname} ${u.lastname}`]),
      );
      const tenantMap = new Map(
        CS_Tenants.map((t) => [t.nationalCode, t.title]),
      );
      //#endregion

      //#region تابع کمکی برای دریافت نام
      const getSideName = (nationalCode: string): string => {
        return (
          companyMap.get(nationalCode) ||
          userMap.get(nationalCode) ||
          tenantMap.get(nationalCode) ||
          ''
        );
      };

      //#endregion
      results.forEach((rs: any) => {
        rs.fromSide = getSideName(rs.from);
        rs.toSide = getSideName(rs.to);
        rs.factors = Factors.filter((iz:any) => iz.order_ref == rs.id);
      });
      //#endregion

      //#region Response
      return {
        results,
        totalItems,
        totalPages,
        currentPage,
        message: 'موفق',
      };
      //#endregion
    } catch (e: any) {
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion
  //#endregion
}

export default FactorService;
