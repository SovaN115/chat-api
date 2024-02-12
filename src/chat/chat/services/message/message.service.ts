import { Injectable } from '@nestjs/common';
import {EntityManager, Repository} from "typeorm";
import {Chat} from "../../../../entities/chat.entity";
import {Message} from "../../../../entities/message.entity";
import {ChatUser} from "../../../../entities/chat-user.entity";
import {CreateMessageDTO} from "../../dto/create-message.dto";
import {UpdateMessageDTO} from "../../dto/update-message.dto";

@Injectable()
export class MessageService {
    private messageRepo: Repository<Message>;
    constructor(entityManager: EntityManager) {
        this.messageRepo = entityManager.getRepository(Message);
    }

    async create(message: CreateMessageDTO, chatUserUUID: string) {
        const createdMessage = this.messageRepo.create({
            message: message.message,
            files: message.files,
            chatUser: {
                uuid: chatUserUUID
            }
        });

        return await this.messageRepo.save(createdMessage);
    };

    async get(uuid: string) {
        await this.messageRepo.find({
            where: {
                uuid: uuid
            }
        });
    }

    async update(message: UpdateMessageDTO) {
        return await this.messageRepo.update({uuid: message.uuid}, message);
    };

    async delete(uuid: string) {
        await this.messageRepo.delete({uuid: uuid})
    }

    async softDelete(uuid: string) {
        await this.messageRepo.softDelete({uuid: uuid})
    }
}
