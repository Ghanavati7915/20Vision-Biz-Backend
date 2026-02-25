import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Gender, OrganType, CompanyType, CompanyStateType } from "../../common/enums/enums";
import { AddressDto, OrderDto, PaginationDto } from "src/common/DTOs/shared";
import {
   IsEnum,
   IsString,
   IsNotEmpty,
   MinLength,
   MaxLength,
   IsOptional,
   IsInt,
   Length,
   Matches,
   ValidateNested,
   IsArray,
   ArrayUnique,
} from "class-validator";
import { Type,Transform } from "class-transformer";

export class ContactUserDto {
   @ApiProperty({
      enum: Gender,
      enumName: "Gender",
      description: "جنسیت کاربر. باید یکی از مقادیر تعریف‌شده در enum Gender باشد.",
      example: Gender.Male,
   })
   @IsEnum(Gender)
   gender: Gender;

   @ApiPropertyOptional({
      description: "شناسه عنوان (مانند آقا، خانم، دکتر و ...). مقدار باید از جدول titles ارسال شود.",
      example: 1,
      nullable: true,
   })
   @IsOptional()
   @IsInt()
   title_ref?: number;

   @ApiProperty({
      description: "نام کاربر",
      example: "احمد",
      minLength: 2,
      maxLength: 100,
   })
   @IsString()
   @Length(2, 100)
   firstname: string;

   @ApiProperty({
      description: "نام خانوادگی کاربر",
      example: "قنواتی",
      minLength: 2,
      maxLength: 100,
   })
   @IsString()
   @Length(2, 100)
   lastname: string;

   @ApiPropertyOptional({
      description: "کد ملی کاربر (۱۰ رقم). در صورت ارسال باید معتبر باشد و تکراری نباشد.",
      example: "0012345678",
      nullable: true,
   })
   @Transform(({ value }) => value === "" ? undefined : value)
   @IsOptional()
   @Matches(/^\d{10}$/, {
      message: "کد ملی باید دقیقاً ۱۰ رقم باشد",
   })
   nationalCode?: string;

   @ApiPropertyOptional({
      description: "شماره تلفن همراه کاربر. فرمت استاندارد ایران (مثال: 09121234567). در صورت ارسال باید معتبر و یکتا باشد.",
      example: "09121234567",
      nullable: true,
   })
   @IsOptional()
   @Matches(/^09\d{9}$/, {
      message: "شماره موبایل معتبر نیست",
   })
   mobile?: string;

   @ApiPropertyOptional({
      description: "توضیحات تکمیلی درباره کاربر",
      example: "مشتری ویژه با سابقه همکاری ۵ ساله",
      maxLength: 500,
      nullable: true,
   })
   @IsOptional()
   @IsString()
   @MaxLength(500)
   description?: string;

   @ApiPropertyOptional({
      description: "کد اقتصادی (در صورت وجود برای اشخاص حقوقی یا حقیقی دارای فعالیت اقتصادی)",
      example: "411111111111",
      nullable: true,
   })
   @Transform(({ value }) => value === "" ? undefined : value)
   @IsOptional()
   @IsString()
   @Length(12, 12)
   ecoNumber?: string;

   @ApiPropertyOptional({
      type: AddressDto,
      description: "اطلاعات آدرس کاربر (اختیاری)",
   })
   @IsOptional()
   @ValidateNested()
   @Type(() => AddressDto)
   address?: AddressDto;
}

export class ContactCompanyDto {
   /* ======================================================
     نوع مالکیت شرکت
  ====================================================== */
   @ApiProperty({
      enum: OrganType,
      enumName: "OrganType",
      description: "نوع مالکیت شرکت (سهامی خاص، مسئولیت محدود، تعاونی و ...)",
      example: OrganType.LimitedLiability,
   })
   @IsEnum(OrganType)
   organType: OrganType;

   /* ======================================================
     نوع شرکت (حقیقی / حقوقی و ...)
  ====================================================== */
   @ApiProperty({
      enum: CompanyType,
      enumName: "CompanyType",
      description: "نوع شخصیت حقوقی (حقیقی، حقوقی، مشارکت مدنی، اتباع خارجی و ...)",
      example: CompanyType.Legal,
   })
   @IsEnum(CompanyType)
   type: CompanyType;

   /* ======================================================
     وضعیت شرکت
  ====================================================== */
   @ApiProperty({
      enum: CompanyStateType,
      enumName: "CompanyStateType",
      description: "وضعیت فعالیت شرکت (خصوصی، دولتی، هلدینگ، چندملیتی و ...)",
      example: CompanyStateType.Private,
   })
   @IsEnum(CompanyStateType)
   stateType: CompanyStateType;

   /* ======================================================
     نام رسمی شرکت
  ====================================================== */
   @ApiProperty({
      description: "نام رسمی ثبت‌شده شرکت",
      example: "شرکت توسعه فناوری آینده",
      minLength: 2,
      maxLength: 200,
   })
   @IsString()
   @IsNotEmpty()
   @MinLength(2)
   @MaxLength(200)
   title: string;

   /* ======================================================
     برند تجاری
  ====================================================== */
   @ApiPropertyOptional({
      description: "نام برند تجاری (در صورت تفاوت با نام رسمی)",
      example: "FutureTech",
   })
   @IsOptional()
   @IsString()
   @MaxLength(200)
   brand?: string;

   /* ======================================================
     شناسه ملی شرکت
  ====================================================== */
   @ApiPropertyOptional({
      description: "شناسه ملی شرکت (در صورت وجود). باید یکتا باشد.",
      example: "14001234567",
      minLength: 11,
      maxLength: 11,
   })
   @IsString()
   @MinLength(11)
   @MaxLength(11)
   nationalCode: string;

   /* ======================================================
     شماره ثبت
  ====================================================== */
   @ApiPropertyOptional({
      description: "شماره ثبت شرکت",
      example: "123456",
   })
   @IsOptional()
   @IsString()
   @MaxLength(50)
   insertNumber?: string;

   /* ======================================================
     تاریخ ثبت
  ====================================================== */
   @ApiPropertyOptional({
      description: "تاریخ ثبت شرکت (فرمت پیشنهادی: YYYY-MM-DD یا تاریخ شمسی استاندارد)",
      example: "2020-05-20",
   })
   @IsOptional()
   @IsString()
   insertDate?: string;

   /* ======================================================
     توضیحات
  ====================================================== */
   @ApiPropertyOptional({
      description: "توضیحات تکمیلی درباره شرکت",
      example: "فعال در حوزه صادرات و واردات تجهیزات صنعتی",
   })
   @IsOptional()
   @IsString()
   @MaxLength(1000)
   description?: string;

   /* ======================================================
     کد شهاب
  ====================================================== */
   @ApiPropertyOptional({
      description: "کد شهاب (در صورت ثبت در سامانه بانکی)",
      example: "SH123456789",
   })
   @IsOptional()
   @IsString()
   @MaxLength(100)
   shahabCode?: string;

   /* ======================================================
     کد اقتصادی
  ====================================================== */
   @ApiPropertyOptional({
      description: "کد اقتصادی شرکت",
      example: "411111111111",
   })
   @IsOptional()
   @IsString()
   @MaxLength(20)
   ecoNumber?: string;

   /* ======================================================
     آدرس شرکت
  ====================================================== */
   @ApiPropertyOptional({
      type: AddressDto,
      description: "اطلاعات آدرس شرکت (اختیاری)",
   })
   @IsOptional()
   address?: AddressDto;
}

export enum ContactTag {
   User = "User",
   Company = "Company",
   Customer = "Customer",
}
export class FilterContactDto {
   @ApiPropertyOptional({
      description: "عبارت جستجو برای فیلتر نتایج",
      example: "رضا",
   })
   @IsOptional()
   @IsString()
   @MaxLength(100)
   search?: string;

   @ApiProperty({
      type: OrderDto,
      description: "تنظیمات مرتب‌سازی",
   })
   order: OrderDto;

   @ApiProperty({
      type: PaginationDto,
      description: "تنظیمات صفحه‌بندی",
   })
   pagination: PaginationDto;

   @ApiPropertyOptional({
      description: "نوع مخاطب. می‌تواند یک یا چند مورد از User, Company, Customer باشد.",
      enum: ContactTag,
      isArray: true,
      example: [ContactTag.User, ContactTag.Company],
   })
   @IsOptional()
   @IsArray()
   @ArrayUnique()
   @IsEnum(ContactTag, { each: true })
   tag?: ContactTag[];
}
