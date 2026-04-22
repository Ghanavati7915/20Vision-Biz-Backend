import { ApiProperty } from "@nestjs/swagger";



export class CreateProductDto {
    @ApiProperty()
    title: string;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    properties?: string;

}

export class CreateJobFieldTitleDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description?: string;
}