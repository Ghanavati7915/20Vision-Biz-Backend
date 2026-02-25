import { ApiProperty } from "@nestjs/swagger";

export class ChatCreateDto {
   @ApiProperty()
   tenant_ref: number;
}

export class ChatMessageCreateDto {
   @ApiProperty()
   chat_ref: number;

   @ApiProperty()
   message?: string;

   @ApiProperty()
   file?: string;
}

export class ChatsDto {
   @ApiProperty()
   id: number;

   @ApiProperty()
   title?: string;

   @ApiProperty()
   avatar?: string;

   @ApiProperty()
   entity?: string;

   @ApiProperty()
   entity_ref?: number;

   @ApiProperty()
   lastMessage: ChatMessageDto | null;
}

export class ChatMessageDto {
   @ApiProperty()
   id: number;

   @ApiProperty()
   message?: string;

   @ApiProperty()
   file?: string;

   @ApiProperty()
   createdAt?: string;

   @ApiProperty()
   createdBy?: number;
}
