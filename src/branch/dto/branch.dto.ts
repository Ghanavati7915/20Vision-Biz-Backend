import { ApiProperty } from "@nestjs/swagger";
import { PhoneTypes, PhoneOperators, CurrencyTypes, BankAccountTypes } from '../../common/enums/enums';

export class CreateBranchPhonesDto {
   @ApiProperty({ enum: PhoneTypes })
   type: string;

   @ApiProperty({ enum: PhoneOperators })
   operator: string;

   @ApiProperty()
   title: string;

   @ApiProperty()
   phone: string;
}

export class CreateDepartmentDto {
   @ApiProperty()
   branch_ref: number;

   @ApiProperty()
   title: string;

   @ApiProperty()
   parent_ref?: number;
}

export class CreateBranchBankDto {
  @ApiProperty()
  bank_ref: number;

   @ApiProperty()
   bankBranch?: string;

   @ApiProperty({ enum: CurrencyTypes })
   currency: string;

   @ApiProperty({ enum: BankAccountTypes })
   type: string;

   @ApiProperty()
   title: string;

   @ApiProperty()
   accountNo?: string;

   @ApiProperty()
   shabaNo?: string;

   @ApiProperty()
   internationalAccountNo?: string;
}
