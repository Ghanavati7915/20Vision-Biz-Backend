import { GoneException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Entity } from "src/common/enums/enums";
import { ChatCreateDto, ChatMessageCreateDto, ChatMessageDto, ChatsDto } from "./dto/chat.dto";

@Injectable()
export class ChatService {
   constructor(private prisma: PrismaService) {}

   //#region Create
   async create(my_tenant_ref: number, userID: number, { tenant_ref }: ChatCreateDto) {
      try {
         //#region Check
         const check = await this.prisma.chats.findMany({
            where: {
               app_action: 1,
               OR: [
                  { fromTenant_ref: my_tenant_ref, toTenant_ref: tenant_ref },
                  { fromTenant_ref: tenant_ref, toTenant_ref: my_tenant_ref },
               ],
            },
         });
         console.log("check : ", check);

         if (check.length > 0) throw new GoneException("این گفتگو قبلاً ایجاد شده است");
         //#endregion

         //#region Create Chat
         const _chat = await this.prisma.chats.create({
            data: {
               fromTenant_ref: my_tenant_ref,
               toTenant_ref: tenant_ref,
               app_action: 1,
               created_by: userID,
            },
         });
         //#endregion

         return {
            chat_ref: _chat.id,
         };
      } catch (e) {
         if (e instanceof GoneException) {
            throw e;
         }
         throw new GoneException("مشکلی در ثبت رخ داده است");
      }
   }
   //#endregion

   //#region Create Chat Message
   async createMessage(my_tenant_ref: number, userID: number, { chat_ref, message, file }: ChatMessageCreateDto) {
      try {
         //#region Check
         const check = await this.prisma.chats.findMany({
            where: {
               id: chat_ref,
               OR: [{ fromTenant_ref: my_tenant_ref }, { toTenant_ref: my_tenant_ref }],
               app_action: 1,
            },
         });
         if (!check) throw new GoneException("این گفتگو یافت نشد");
         //#endregion

         //#region Create Chat
         const _chat = await this.prisma.chatMessages.create({
            data: {
               chat_ref: chat_ref,
               message: message,
               file: file,
               created_by: userID,
               app_action: 1,
            },
         });
         //#endregion

         return { message: "انجام شد", id: _chat.id, statusCode: HttpStatus.OK };
      } catch (e) {
         if (e instanceof GoneException) {
            throw e;
         }
         throw new GoneException("مشکلی در ثبت رخ داده است");
      }
   }
   //#endregion

   //#region Get All
   async getAll(my_tenant_ref: number) {
      try {
         //#region Transaction
         const results = await this.prisma.chats.findMany({
            where: {
               app_action: 1,
               OR: [{ fromTenant_ref: my_tenant_ref }, { toTenant_ref: my_tenant_ref }],
            },
            select: {
               id: true,
               fromTenant_ref: true,
               toTenant_ref: true,
               created_at: true,
               created_by: true,
            },
         });
         //#endregion
         let responses: ChatsDto[] = [];

         for (const it of results) {
            let lastMessage: ChatMessageDto | null = null;
            const lastResult = await this.prisma.chatMessages.findFirst({
               where: { chat_ref: it.id, app_action: 1 },
               orderBy: { created_at: "desc" },
            });
            if (lastResult) {
               lastMessage = {
                  id: lastResult.id,
                  message: lastResult.message ? lastResult.message : "",
                  file: lastResult.file ? lastResult.file : "",
                  createdAt: lastResult.created_at ? new Date(lastResult.created_at).toString() : new Date().toString(),
                  createdBy: lastResult.created_by ? lastResult.created_by : 0,
               };
            }

            let _tenant_ref: any = null;

            if (it.fromTenant_ref == my_tenant_ref) {
               _tenant_ref = it.toTenant_ref;
            } else {
               _tenant_ref = it.fromTenant_ref;
            }

            const _tenant = await this.prisma.tenants.findFirst({
               where: { id: _tenant_ref, app_action: 1 },
            });
            if (_tenant) {
               if (_tenant.entity == Entity.Company) {
                  const result = await this.prisma.companies.findFirst({ where: { id: _tenant.entity_ref, app_action: 1 } });
                  if (result) {
                     responses.push({
                        id: it.id,
                        title: result.title,
                        avatar: result.logo ? result.logo : "",
                        entity: _tenant.entity,
                        entity_ref: _tenant.entity_ref,
                        lastMessage: lastMessage,
                     });
                  }
               } else if (_tenant.entity == Entity.Personal) {
                  const result = await this.prisma.users.findFirst({ where: { id: _tenant.entity_ref, app_action: 1 } });
                  if (result) {
                     responses.push({
                        id: it.id,
                        title: `${result.firstname} ${result.lastname}`,
                        avatar: result.avatar ? result.avatar : "",
                        entity: _tenant.entity,
                        entity_ref: _tenant.entity_ref,
                        lastMessage: lastMessage,
                     });
                  }
               }
            }
         }

         //#region Response
         return { results: responses };
         //#endregion
      } catch (e: any) {
         throw new GoneException("مشکلی در دریافت اطلاعات رخ داده است");
      }
   }
   //#endregion

   //#region Get By ID
   async getByID(my_tenant_ref: number, id: number) {
      try {
         //#region Check
         const check = await this.prisma.chats.findMany({
            where: {
               id: +id,
               app_action: 1,
               OR: [{ fromTenant_ref: my_tenant_ref }, { toTenant_ref: my_tenant_ref }],
            },
         });
         if (!check) throw new GoneException("این گفتگو متعلق به شما نیست");
         //#endregion

         //#region Transaction
         const results = await this.prisma.chatMessages.findMany({
            where: {
               chat_ref: +id,
               app_action: 1,
            },
            select: {
               id: true,
               message: true,
               file: true,
               created_by: true,
               created_at: true,
            },
         });
         //#endregion

         //#region Response
         return results;
         //#endregion
      } catch (e: any) {
         if (e instanceof GoneException) {
            throw e;
         }
         throw new GoneException("مشکلی در دریافت اطلاعات رخ داده است");
      }
   }
   //#endregion
}
