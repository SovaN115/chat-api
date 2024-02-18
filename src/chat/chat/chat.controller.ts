import {Body, Controller, Post} from '@nestjs/common';
import {ChatService} from "./services/chat/chat.service";
import {CreateChatDTO} from "./dto/create-chat.dto";
import {ChatUserService} from "./services/chat-user/chat-user.service";
import {UserDataService} from "../../modules/auth/services/user-data.service";
import { SendMessageDTO } from './dto/send-message.dto';
import {MessageService} from './services/message/message.service'

@Controller('chat')
export class ChatController {

    constructor(
        private readonly chatService: ChatService,
        private readonly chatUserService: ChatUserService,
        private readonly userService: UserDataService,
        private readonly messageService: MessageService
    ) {}

    @Post("get-or-create-chat")
    async getOrCreateChat(
        @Body() dto: CreateChatDTO
    ) {
        const isExist = await this.chatService.checkIfExist(dto.usersUUID);

        if(isExist) {
            return await this.chatService.getByUsersUUID(dto.usersUUID)
        } else {
            const chat = await this.chatService.create();
            await this.chatUserService.createMany(dto.usersUUID, chat.uuid);
            return await this.chatService.get(chat.uuid);
        }

    }

    @Post("send-message")
    async sendMessage(
      @Body() dto: SendMessageDTO
    ) {
        return await this.messageService.create({message: dto.message, files: dto.files}, dto.chatUserUUID, dto.chatUUID)
    }

    @Post("edit-message")
    async editMessage(
      @Body() dto: any
    ) {

    }

    @Post("edit-message")
    async deleteMessage(
      @Body() dto: CreateChatDTO
    ) {
        const isExist = await this.chatService.checkIfExist(dto.usersUUID);

        if(isExist) {
            return await this.chatService.getByUsersUUID(dto.usersUUID)
        } else {
            const chat = await this.chatService.create();
            await this.chatUserService.createMany(dto.usersUUID, chat.uuid);
            return await this.chatService.get(chat.uuid);
        }

    }

    @Post("get-contacts")
    async getContacts(
        @Body() dto: {uuid: string}
    ) {
        return await this.userService.getContacts(dto.uuid)
    }

}
