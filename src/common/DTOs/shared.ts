import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, Min, IsOptional, IsString, IsNotEmpty, MaxLength, IsEnum, IsBoolean } from "class-validator";
import { Type } from "class-transformer";

/* ======================================================
   Pagination DTO
====================================================== */

export class PaginationDto {
   @ApiProperty({
      description: "شماره صفحه (شروع از 1)",
      example: 1,
      minimum: 1,
   })
   @Type(() => Number)
   @IsInt()
   @Min(1)
   page: number;

   @ApiProperty({
      description: "تعداد آیتم در هر صفحه",
      example: 10,
      minimum: 1,
   })
   @Type(() => Number)
   @IsInt()
   @Min(1)
   pageSize: number;
}

/* ======================================================
   Order DTO
====================================================== */

export enum SortOrder {
   ASC = "asc",
   DESC = "desc",
}

export class OrderDto {
   @ApiProperty({
      description: "نام فیلدی که باید مرتب‌سازی شود",
      example: "created_at",
   })
   @IsString()
   @IsNotEmpty()
   orderBy: string;

   @ApiProperty({
      enum: SortOrder,
      enumName: "SortOrder",
      description: "جهت مرتب‌سازی",
      example: "desc",
   })
   @IsEnum(SortOrder)
   order: SortOrder;
}

/* ======================================================
   Filter DTO
====================================================== */

export class FilterDto {
   @ApiPropertyOptional({
      description: "عبارت جستجو برای فیلتر نتایج",
      example: "احمد",
   })
   @IsOptional()
   @IsString()
   @MaxLength(100)
   search?: string;

   @ApiPropertyOptional({
      description: "نوع فیلتر ( با توجه به فرم )",
      example: "Sent",
   })
   @IsOptional()
   @IsString()
   type?: string;

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
}

/* ======================================================
   Address DTO
====================================================== */

export class AddressDto {
   @ApiProperty({
      description: "شناسه شهر از جدول Cities",
      example: 1,
   })
   @Type(() => Number)
   @IsInt()
   city_ref: number;

   @ApiPropertyOptional({
      description: "نام روستا",
      example: "قاسم‌آباد",
   })
   @IsOptional()
   @IsString()
   village?: string;

   @ApiPropertyOptional({
      description: "نام خیابان",
      example: "خیابان آزادی",
   })
   @IsOptional()
   @IsString()
   street?: string;

   @ApiPropertyOptional({
      description: "نام کوچه",
      example: "کوچه گل‌ها",
   })
   @IsOptional()
   @IsString()
   alley?: string;

   @ApiPropertyOptional({
      description: "شماره کوچه",
      example: "12",
   })
   @IsOptional()
   @IsString()
   alleyNo?: string;

   @ApiPropertyOptional({
      description: "نام ساختمان",
      example: "برج سپهر",
   })
   @IsOptional()
   @IsString()
   building?: string;

   @ApiPropertyOptional({
      description: "طبقه",
      example: "3",
   })
   @IsOptional()
   @IsString()
   floor?: string;

   @ApiPropertyOptional({
      description: "پلاک",
      example: "25",
   })
   @IsOptional()
   @IsString()
   plate?: string;

   @ApiPropertyOptional({
      description: "کد پستی (۱۰ رقم)",
      example: "1234567890",
   })
   @IsOptional()
   @IsString()
   @MaxLength(10)
   postalCode?: string;

   @ApiPropertyOptional({
      description: "توضیحات تکمیلی آدرس",
      example: "واحد شمالی، زنگ دوم",
   })
   @IsOptional()
   @IsString()
   @MaxLength(500)
   description?: string;
}

export class ToggleStateDto {
   @ApiPropertyOptional({
      description: "وضعیت جدید",
      example: true,
   })
   @IsBoolean()
   state: boolean;
}
