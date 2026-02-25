import { ApiProperty } from "@nestjs/swagger";

export class MonitorDto {
   @ApiProperty()
   title?: string;

   @ApiProperty()
   data: string;
}
