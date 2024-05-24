import { Injectable } from '@nestjs/common';
import {EntityManager, Repository, UpdateResult} from "typeorm";
import {Chat} from "../../../../entities/chat.entity";
import {Message} from "../../../../entities/message.entity";
import {ChatUser} from "../../../../entities/chat-user.entity";
import {CreateMessageDTO} from "../../dto/create-message.dto";
import {UpdateMessageDTO} from "../../dto/update-message.dto";
import {GetOptionsInterface} from "../../../../core/interfaces/get-options.interface";
import { User } from 'src/modules/auth/entities/user.entity';

@Injectable()
export class MessageService {
    private messageRepo: Repository<Message>;
    userRepo: Repository<User>;
    constructor(entityManager: EntityManager) {
        this.messageRepo = entityManager.getRepository(Message);
        this.userRepo = entityManager.getRepository(User);
    }

    async create(message: CreateMessageDTO, userUUID: string, chatUUID: string) {

        const user = await this.userRepo.findOne({
            where: {
                uuid: userUUID
            },
            relations: {
                chatUsers: true
            }
        })

        const createdMessage = await this.messageRepo.create({
            message: message.message,
            files: message.files,
            chatUser: {
                uuid: user.chatUsers.uuid
            },
            chat: {
                uuid: chatUUID
            }
        });

        return await this.messageRepo.save(createdMessage);
    };

    async get(messageUUID: string) {
        return await this.messageRepo.findOne({
            where: {
                uuid: messageUUID
            },
            relations: {
                chatUser: {
                    user: true
                }
            }
        });
    }

    async getAll(chatUUID: string, options: GetOptionsInterface) {
        return await this.messageRepo.find({
            where: {
                chat: {
                    uuid: chatUUID
                }
            },
            take: options.limit,
            skip: options.offset
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
