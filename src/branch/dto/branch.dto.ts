import { ApiProperty } from "@nestjs/swagger";
import { SocialApps,PhoneTypes, PhoneOperators, CurrencyTypes, BankAccountTypes, Entity,BranchTypeModels } from '../../common/enums/enums';

export class CreateBranchDto {
  @ApiProperty({ enum: Entity })
  entity: string;

  @ApiProperty({ enum: BranchTypeModels })
  models: string[];

  @ApiProperty()
  bimehCode?: string;

  @ApiProperty()
  bimehBranch?: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  jobFields: number[];

}

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

export class CreateBranchSocialAccountsDto {
  @ApiProperty({ enum: SocialApps })
  socialApp: string;

  @ApiProperty()
  address: string;

}

export class CreateBranchDepartmentEmployeesDto {
  @ApiProperty()
  employee_ref: number;

  @ApiProperty()
  post: string;

}
