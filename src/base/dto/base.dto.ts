import { ApiProperty } from "@nestjs/swagger";



export class CreateProductDto {
    @ApiProperty()
    title: string;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    properties?: string;

}