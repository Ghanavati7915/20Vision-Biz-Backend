import { ApiProperty } from "@nestjs/swagger";
import { FactorType, Entity } from '../../common/enums/enums';

class FactorItemsDto {
  @ApiProperty()
  product_ref: number;

  @ApiProperty()
  count: string;

  @ApiProperty()
  weightType: string;

  @ApiProperty()
  baseFee: string;
  @ApiProperty()
  allFee: string;

  @ApiProperty()
  tax: string;

  @ApiProperty()
  discount: string;

  @ApiProperty()
  sumBeforeDiscount: string;

  @ApiProperty()
  sumAfterDiscount: string;

  @ApiProperty()
  sumFinal: string;

  @ApiProperty()
  description?: string;
}

export class FactorDto {
   @ApiProperty({ enum: Entity })
   entity: string;

   @ApiProperty()
   entity_ref: number;

  @ApiProperty()
  order_ref: number;

  @ApiProperty({ enum: FactorType })
  factor_type: string;

  @ApiProperty()
  code?: number;

  @ApiProperty()
  serial?: number;

  @ApiProperty()
  date: string;

  @ApiProperty()
  sign_state: boolean;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  policies?: string;

   @ApiProperty()
   items: FactorItemsDto[];
}

export class FactorPolicyDto {
  @ApiProperty()
  text: string;

  @ApiProperty()
  is_selected: boolean;

  @ApiProperty()
  position?: number;
}

class OrderItemsDto {
  @ApiProperty()
  product_ref: number;

  @ApiProperty()
  count: string;

  @ApiProperty()
  weightType: string;

  @ApiProperty()
  description?: string;
}

export class OrderDto {
  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  from_date: string;

  @ApiProperty()
  to_date: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  items: OrderItemsDto[];
}

