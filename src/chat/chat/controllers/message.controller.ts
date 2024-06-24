import {Body, Controller, Delete, Post, Req, UploadedFile, UploadedFiles, UseInterceptors} from '@nestjs/common';
import { SendMessageDTO } from '../dto/send-message.dto';
import {MessageService} from '../services/message/message.service'
import {UpdateMessageDTO} from "../dto/update-message.dto";
import {GetMessagesDTO} from "../dto/get-messages.dto";
import { AccessTokenService } from 'src/modules/auth/services/access-token.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ChatService } from '../services/chat/chat.service';
import { Chat } from 'src/entities/chat.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 } from 'uuid';
import * as fileExtension from 'file-extension';
import * as fs from 'fs';
import { File } from 'src/modules/file/file.entity';

@Controller('message')
export class MessageController {
    fileRepo: Repository<File>;

    constructor(
        private readonly messageService: MessageService,
        private readonly chatService: ChatService,
        @InjectRepository(Chat)
        private readonly chatRepo: Repository<Chat>,
        private readonly tokenService: AccessTokenService,
        // @InjectRepository(File)
        // private readonly fileRepo: Repository<File>,
        private readonly manager: EntityManager
    ) {
        this.fileRepo = manager.getRepository<File>(File);
    }

    @Post("get-messages")
    async getMessages(
        @Body() dto: GetMessagesDTO
    ) {
        return await this.messageService.getAll(dto.chatUUID, {limit: dto.limit, offset: dto.offset});
    }

    @Post("send-message")
    @UseInterceptors(FilesInterceptor('files'))
    async sendMessage(
        @Body() dto: SendMessageDTO, @Req() req: Request,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        console.log(files)
        const token = this.tokenService.getTokenFromHeader(req);
        let createdFiles: File[] = [];

        if(files) {
            let newFiles: File[] = [];
            files.forEach(file => {
                const fileName = v4();
                const extension = fileExtension(file.originalname);
                const path = `${process.cwd()}\\cl_media\\${fileName}.${extension}`;
                fs.createWriteStream(path).write(file.buffer);

                let newFile = new File();
                newFile.uri = `/cl_media/${fileName}.${extension}`;
                console.log(file)
                newFile.name = file.originalname;

                newFiles.push(newFile);
            });
            createdFiles = await this.fileRepo.save(newFiles);
        }

        const message = await this.messageService.create({message: dto.message, files: createdFiles}, token.userUUID, dto.chatUUID);
        await this.chatRepo.update(
            {
                uuid: message.chat.uuid
            },
            {
                lastMessage: message.message
            }
        )
        return await this.messageService.get(message.uuid);
    }

    @Post("edit-message")
    @UseInterceptors(FileInterceptor('files'))
    async editMessage(
        @Body() dto: UpdateMessageDTO,
        @UploadedFile() files: Express.Multer.File
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