import {Body, Controller, Delete, Post} from '@nestjs/common';
import { SendMessageDTO } from '../dto/send-message.dto';
import {MessageService} from '../services/message/message.service'
import {UpdateMessageDTO} from "../dto/update-message.dto";
import {GetMessagesDTO} from "../dto/get-messages.dto";

@Controller('message')
export class MessageController {

    constructor(
        private readonly messageService: MessageService
    ) {}

    @Post("get-messages")
    async getMessages(
        @Body() dto: GetMessagesDTO
    ) {
        return await this.messageService.getAll(dto.chatUUID, {limit: dto.limit, offset: dto.offset});
    }

    @Post("send-message")
    async sendMessage(
        @Body() dto: SendMessageDTO
    ) {
        return await this.messageService.create({message: dto.message, files: dto.files}, dto.chatUserUUID, dto.chatUUID)
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