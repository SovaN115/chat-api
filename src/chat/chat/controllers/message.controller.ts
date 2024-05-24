import {Body, Controller, Delete, Post, Req} from '@nestjs/common';
import { SendMessageDTO } from '../dto/send-message.dto';
import {MessageService} from '../services/message/message.service'
import {UpdateMessageDTO} from "../dto/update-message.dto";
import {GetMessagesDTO} from "../dto/get-messages.dto";
import { AccessTokenService } from 'src/modules/auth/services/access-token.service';

@Controller('message')
export class MessageController {

    constructor(
        private readonly messageService: MessageService,
        private readonly tokenService: AccessTokenService,
    ) {}

    @Post("get-messages")
    async getMessages(
        @Body() dto: GetMessagesDTO
    ) {
        return await this.messageService.getAll(dto.chatUUID, {limit: dto.limit, offset: dto.offset});
    }

    @Post("send-message")
    async sendMessage(
        @Body() dto: SendMessageDTO, @Req() req: Request
    ) {
        const token = this.tokenService.getTokenFromHeader(req);
        const message = await this.messageService.create({message: dto.message, files: dto.files}, token.userUUID, dto.chatUUID);
        return await this.messageService.get(message.uuid);
    }

    @Post("edit-message")
    async editMessage(
        @Body() dto: UpdateMessageDTO
    ) {
        return await this.messageService.update(dto);
    }

    @Post("delete-message")
    async deleteMessage(
        @Body() dto: {uuid: string}
    ) {
        return await this.messageService.softDelete(dto.uuid);
    }

}