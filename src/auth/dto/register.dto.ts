import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto {
   @ApiProperty()
   mobile: string;

   @ApiProperty()
   password: string;

   @ApiProperty()
   firstname: string;

   @ApiProperty()
   lastname: string;
}

export class RegisterCompanyDto {
   @ApiProperty()
   nationalCode: string;

   @ApiProperty()
   title: string;
}
