import {Body, Controller, Get, Post, Req} from '@nestjs/common';
import {ChatService} from "../services/chat/chat.service";
import {CreateChatDTO} from "../dto/create-chat.dto";
import {ChatUserService} from "../services/chat-user/chat-user.service";
import {UserDataService} from "../../../modules/auth/services/user-data.service";
import {AccessTokenService} from "../../../modules/auth/services/access-token.service";

@Controller('chat')
export class ChatController {

    constructor(
        private readonly chatService: ChatService,
        private readonly chatUserService: ChatUserService,
        private readonly userService: UserDataService,
        private readonly accessTokenService: AccessTokenService
    ) {}

    @Post("get-or-create-chat")
    async getOrCreateChat(
        @Body() dto: CreateChatDTO
    ) {
        const chat = await this.chatService.checkIfExist(dto.usersUUID, dto.type);

        if(chat) {
            return chat; 
        } else {
            const chat = await this.chatService.create(dto.usersUUID, dto.type);
            return await this.chatService.get(chat.uuid);
        }
    }

    @Post("get-chat")
    async getChat(
        @Body() dto: {chatUUID: string}
    ) {
        return await this.chatService.get(dto.chatUUID, true);
    }

    @Post("create-chat")
    async createChat(
        @Body() dto: CreateChatDTO
    ) {
        const chat = await this.chatService.create(dto.usersUUID, dto.type);
        return await this.chatService.get(chat.uuid);
    }

    @Post("add-user-to-chat")
    async adUserToChat(
        @Body() dto: CreateChatDTO
    ) {
        // const chat = await this.chatService.create(dto.usersUUID, dto.type);
        // return await this.chatService.get(chat.uuid);
    }

    @Get("get-chats")
    async getContacts(
        @Req() req: Request
    ) {
        const jwt = this.accessTokenService.getTokenFromHeader(req);
        // console.log(jwt)
        return await this.chatService.getByUserUUID(jwt.userUUID);
    }

    @Post("delete-chat")
    async deleteChat(
        @Body() dto: {uuid: string}
    ) {
        return await this.chatService.softDelete(dto.uuid)
    }

}
