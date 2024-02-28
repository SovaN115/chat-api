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
        const isExist = await this.chatService.checkIfExist(dto.usersUUID);

        if(isExist) {
            return await this.chatService.getByUsersUUID(dto.usersUUID)
        } else {
            const chat = await this.chatService.create();
            await this.chatUserService.createMany(dto.usersUUID, chat.uuid);
            return await this.chatService.get(chat.uuid);
        }

    }

    @Get("get-contacts")
    async getContacts(
        @Req() req: Request
    ) {
        const jwt = this.accessTokenService.getTokenFromHeader(req);
        return await this.userService.getContacts(jwt.uuid);
    }

    @Post("delete-chat")
    async deleteChat(
        @Body() dto: {uuid: string}
    ) {
        return await this.chatService.softDelete(dto.uuid)
    }

}
