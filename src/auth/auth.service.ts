import { GoneException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { TokenPayload } from "./interfaces/token-payload.interface";
import { RegisterCompanyDto, RegisterUserDto } from "./dto/register.dto";
import { Entity, EntityType } from "src/common/enums/enums";
import type { StringValue } from "ms";

@Injectable()
export class AuthService {
   constructor(
      private prisma: PrismaService,
      private jwtService: JwtService,
      private configService: ConfigService,
   ) {}

   async validateUser(username: string, pass: string) {
      try {
         const user = await this.prisma.tenants.findFirst({
            where: { username, app_action: 1 },
         });

         if (!user) return null;
         if (pass != user.password) return null;

         const { password, ...result } = user;
         return result;
      } catch (error) {
         return null;
      }
   }

   async login(mobile: string, password: string) {
      try {
         const tenant = await this.prisma.tenants.findFirst({
            where: { username: mobile, app_action: 1 },
         });

         if (!tenant) throw new GoneException("اطلاعات صحیح نیست");
         if (password != tenant.password) throw new GoneException("رمز عبور صحیح نیست");

         const tokens = await this.getTokens(tenant);
         return tokens;
      } catch (e) {
         if (e instanceof GoneException) {
            throw e;
         }
         throw new GoneException("مشکلی در ثبت رخ داده است");
      }
   }

   async registerUser({ mobile, password, firstname, lastname }: RegisterUserDto) {
      try {
         //#region Check User
         const user = await this.prisma.users.findFirst({
            where: { mobile, app_action: 1 },
         });
         if (user) throw new GoneException("این شماره همراه قبلاً ثبت شده است");
         //#endregion

         //#region Check Tenant
         const tenant = await this.prisma.tenants.findFirst({
            where: { username: mobile, app_action: 1 },
         });
         if (tenant) throw new GoneException("این کاربر قبلاً ثبت شده است");
         //#endregion

         //#region Create User
         const newUser = await this.prisma.users.create({
            data: {
               entityType: EntityType.Primary,
               mobile,
               firstname,
               lastname,
               app_action: 1,
            },
         });
         await this.prisma.users.update({
            where: { id: newUser.id },
            data: { created_by: newUser.id },
         });
         //#endregion

         //#region Create Tenant
         const newTenant = await this.prisma.tenants.create({
            data: {
               username: mobile,
               password,
               title: `${firstname} ${lastname}`,
               entity: Entity.Personal,
               entity_ref: newUser.id,
               app_action: 1,
            },
         });

         await this.prisma.tenants.update({
            where: { id: newTenant.id },
            data: { created_by: newTenant.id },
         });
         await this.prisma.users.update({
            where: { id: newUser.id },
            data: { tenant_ref: newTenant.id },
         });
         //#endregion

         const tokens = await this.getTokens(newTenant);
         return tokens;
      } catch (e) {
         if (e instanceof GoneException) {
            throw e;
         }
         throw new GoneException("مشکلی در ثبت رخ داده است");
      }
   }

   async registerCompany(userId: number, { nationalCode, title }: RegisterCompanyDto) {
      try {
         //#region Check Company
         const company = await this.prisma.companies.findFirst({
            where: { nationalCode, app_action: 1 },
         });
         if (company) throw new GoneException("این شناسه ملی قبلاً ثبت شده است");
         //#endregion

         //#region Check Tenant
         const tenant = await this.prisma.tenants.findFirst({
            where: { username: nationalCode, app_action: 1 },
         });
         if (tenant) throw new GoneException("این شرکت قبلاً ثبت شده است");
         //#endregion

         //#region Create Company
         const newCompany = await this.prisma.companies.create({
            data: {
               entityType: EntityType.Primary,
               title,
               nationalCode,
               created_by: userId,
               app_action: 1,
            },
         });
         //#endregion

         //#region Create Tenant
         const newTenant = await this.prisma.tenants.create({
            data: {
               username: nationalCode,
               password: "123",
               title,
               entity: Entity.Company,
               entity_ref: newCompany.id,
               created_by: userId,
               app_action: 1,
            },
         });
         await this.prisma.companies.update({
            where: { id: newCompany.id },
            data: { tenant_ref: newTenant.id },
         });
         //#endregion

         //#region Connect Employee
         const newEmployee = await this.prisma.employees.createMany({
            data: {
               company_ref: newCompany.id,
               user_ref: userId,
               app_action: 1,
            },
         });
         //#endregion

         //#region Get Token
         const _tenant = await this.prisma.tenants.findFirst({
            where: {
               entity_ref: userId,
               entity: Entity.Personal,
               app_action: 1,
            },
         });
         //#endregion

         const tokens = await this.getTokens(_tenant);
         return tokens;
      } catch (e) {
         console.log(e);
         if (e instanceof GoneException) {
            throw e;
         }
         throw new GoneException("مشکلی در ثبت رخ داده است");
      }
   }

   private async getTokens(tenant: any) {
      let Tokens: any[] = [];

      //#region Access Expire
      const accessExpiresIn = this.configService.get<StringValue>("JWT_EXPIRES_IN");
      const refreshExpiresIn = this.configService.get<StringValue>("JWT_REFRESH_EXPIRES_IN");

      if (!accessExpiresIn || !refreshExpiresIn) {
         throw new Error("Missing JWT_EXPIRES_IN or JWT_REFRESH_EXPIRES_IN in config");
      }
      //#endregion

      //#region Expire Date
      const now = new Date();
      const accessExpireDate = new Date(now.getTime() + this.parseExpiresIn(accessExpiresIn)).getTime();
      const refreshExpireDate = new Date(now.getTime() + this.parseExpiresIn(refreshExpiresIn)).getTime();
      //#endregion

      //#region Generate Token
      const user = await this.prisma.users.findFirst({
         where: { id: tenant.entity_ref, app_action: 1 },
      });
      if (user) {
         //#region User
         let payload: TokenPayload = {
            id: tenant.id,
            userID: user.id,
            isPersonal: true,
            userName: tenant.username,
            title: `${user.firstname} ${user.lastname}`,
            firstName: user.firstname,
            lastName: user.lastname,
            avatar: user.avatar ? `${process.env.BACKEND_DOMAIN}/dl/${user.avatar}` : null,
            permissions: [],
         };
         const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
               secret: this.configService.get<string>("JWT_SECRET")!,
               expiresIn: accessExpiresIn,
            }),
            this.jwtService.signAsync(payload, {
               secret: this.configService.get<string>("JWT_REFRESH_SECRET")!,
               expiresIn: refreshExpiresIn,
            }),
         ]);
         await this.updateRefreshToken(tenant.id, refreshToken);
         Tokens.push({
            access: accessToken,
            refresh: refreshToken,
            accessExpireDate,
            refreshExpireDate,
            title: payload.title,
            isPersonal: payload.isPersonal,
         });
         //#endregion

         //#region Company
         const employees = await this.prisma.employees.findMany({
            where: { user_ref: user.id, app_action: 1 },
            select: {
               company: true,
            },
         });
         if (employees) {
            for (const emp of employees) {
               let payload: TokenPayload = {
                  id: emp.company.tenant_ref ? emp.company.tenant_ref : 0,
                  userID: emp.company.id,
                  isPersonal: false,
                  userName: emp.company.nationalCode,
                  title: emp.company.title,
                  firstName: user.firstname,
                  lastName: user.lastname,
                  avatar: emp.company.logo ? `${process.env.BACKEND_DOMAIN}/dl/${emp.company.logo}` : null,
                  permissions: ["chat", "priceMonitor","factor","product","contact"],
               };
               const [accessToken, refreshToken] = await Promise.all([
                  this.jwtService.signAsync(payload, {
                     secret: this.configService.get<string>("JWT_SECRET")!,
                     expiresIn: accessExpiresIn,
                  }),
                  this.jwtService.signAsync(payload, {
                     secret: this.configService.get<string>("JWT_REFRESH_SECRET")!,
                     expiresIn: refreshExpiresIn,
                  }),
               ]);
               await this.updateRefreshToken(tenant.id, refreshToken);
               Tokens.push({
                  access: accessToken,
                  refresh: refreshToken,
                  accessExpireDate,
                  refreshExpireDate,
                  title: payload.title,
                  isPersonal: payload.isPersonal,
               });
            }
         }
         //#endregion
      } else {
         throw new Error("اطلاعات جهت دریافت توکن ها یافت نشد");
      }
      //#endregion

      return Tokens;
   }

   async logout(id: number) {
      await this.prisma.refreshTokens.deleteMany({
         where: { tenant_ref: id },
      });
   }

   async refreshTokens(id: number, refreshToken: string) {
      const tenant = await this.prisma.tenants.findUnique({
         where: { id: id },
      });
      if (!tenant) throw new UnauthorizedException("Tenant not found");

      const storedToken = await this.prisma.refreshTokens.findFirst({
         where: { tenant_ref: tenant.id, token: refreshToken },
      });

      if (!storedToken || storedToken.expires_at < new Date()) {
         throw new UnauthorizedException("Invalid refresh token");
      }

      const tokens = await this.getTokens(tenant);
      // await this.updateRefreshToken(tenant.id, tokens.refreshToken);
      return tokens;
   }

   private parseExpiresIn(expiresIn: string): number {
      const time = parseInt(expiresIn);
      if (expiresIn.endsWith("ms")) return time;
      if (expiresIn.endsWith("s")) return time * 1000;
      if (expiresIn.endsWith("m")) return time * 60 * 1000;
      if (expiresIn.endsWith("h")) return time * 60 * 60 * 1000;
      if (expiresIn.endsWith("d")) return time * 24 * 60 * 60 * 1000;
      throw new Error(`Unsupported expiresIn format: ${expiresIn}`);
   }

   private async updateRefreshToken(id: number, refreshToken: string) {
      const expires_at = new Date();

      // Get refresh token expiration time with null check
      const refreshExpiresIn = this.configService.get<StringValue>("JWT_REFRESH_EXPIRES_IN");

      if (!refreshExpiresIn) {
         throw new Error("JWT_REFRESH_EXPIRES_IN is not defined in config");
      }

      // Convert expiration time to seconds (remove 's' if present and parse to integer)
      const expiresInSeconds = parseInt(refreshExpiresIn.replace(/s$/, ""), 10);
      if (isNaN(expiresInSeconds)) {
         throw new Error("Invalid JWT_REFRESH_EXPIRES_IN format");
      }

      expires_at.setSeconds(expires_at.getSeconds() + expiresInSeconds);
      expires_at.setTime(expires_at.getTime() + this.parseExpiresIn(refreshExpiresIn));

      await this.prisma.refreshTokens.upsert({
         where: {
            token: refreshToken, // استفاده از فیلد unique
         },
         update: {
            token: refreshToken,
            expires_at,
            tenant_ref: id, // اضافه کردن این خط اگر نیاز است
         },
         create: {
            token: refreshToken,
            tenant_ref: id,
            expires_at,
         },
      });
   }
}
