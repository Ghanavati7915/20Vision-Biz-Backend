import { ApiProperty } from '@nestjs/swagger';

export class paginationDto {
  @ApiProperty()
  page: number;
  @ApiProperty()
  pageSize: number;
}
export class orderDto {
  @ApiProperty()
  order: number;
  @ApiProperty()
  orderBy: string;
}
export class FilterDto {
  @ApiProperty()
  search: string;

  @ApiProperty()
  order: orderDto;

  @ApiProperty()
  pagination: paginationDto;
}
