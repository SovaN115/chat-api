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
    chatUserRepo: Repository<ChatUser>;
    constructor(entityManager: EntityManager) {
        this.messageRepo = entityManager.getRepository(Message);
        this.userRepo = entityManager.getRepository(User);
        this.chatUserRepo = entityManager.getRepository(ChatUser);
    }

    async create(message: CreateMessageDTO, userUUID: string, chatUUID: string) {

        const chatUser = await this.chatUserRepo.findOne({
            where: {
                chat: {
                    uuid: chatUUID
                },
                user: {
                    uuid: userUUID
                }
            }
        });

        const createdMessage = await this.messageRepo.create({
            message: message.message,
            files: message.files,
            chatUser: {
                uuid: chatUser.uuid
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
                },
                files: true
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
            relations: {
                chatUser: {
                    user: true
                },
                files: true
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
