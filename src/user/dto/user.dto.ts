import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../../common/enums/enums';
import { IsEnum, IsString, Length, IsOptional, Matches } from 'class-validator';

export class UserDto {
  @ApiProperty({
    enum: Gender,
    enumName: 'Gender',
    description: 'جنسیت کاربر. باید یکی از مقادیر تعریف‌شده در enum Gender باشد.',
    example: Gender.Male,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'نام کاربر',
    example: 'احمد',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  firstname: string;

  @ApiProperty({
    description: 'نام خانوادگی کاربر',
    example: 'قنواتی',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  lastname: string;

  @ApiPropertyOptional({
    description:
      'کد ملی کاربر (۱۰ رقم). در صورت ارسال باید معتبر باشد و تکراری نباشد.',
    example: '0012345678',
    nullable: true,
  })
  @IsOptional()
  @Matches(/^\d{10}$/, {
    message: 'کد ملی باید دقیقاً ۱۰ رقم باشد',
  })
  nationalCode?: string;
}

export class UserAvatarDto {
  @ApiProperty()
  path: string;
}
