import { Injectable } from '@nestjs/common';
import {EntityManager, Repository} from "typeorm";
import {Chat} from "../../../../entities/chat.entity";
import {Message} from "../../../../entities/message.entity";
import {CreateMessageDTO} from "../../dto/create-message.dto";
import {UpdateMessageDTO} from "../../dto/update-message.dto";

@Injectable()
export class ChatService {
    chatRepo: Repository<Chat>;
    constructor(entityManager: EntityManager) {
        this.chatRepo = entityManager.getRepository<Chat>(Chat);
    }

    async create() {
        return await this.chatRepo.save({});
    };

    async checkIfExist(chatUsersUUID: string[]) {
        const arr = chatUsersUUID.map(item => {
            return {
                user: {
                    uuid: item
                }
            }
        });
        return await this.chatRepo.exist({
            where: {
                chatUsers: arr
            }
        });

    };

    async get(uuid: string) {

        return await this.chatRepo.find({
            where: {
                uuid: uuid
            },
            relations : {
                chatUsers: {
                    user: true
                }
            }
        });
    }

    async getByUsersUUID(chatUsersUUID: string[]) {
        const arr = chatUsersUUID.map(item => {
            return {
                user: {
                    uuid: item
                }
            }
        });
        return await this.chatRepo.findOne({
            where: {
                chatUsers: arr
            },
            relations: {
                chatUsers: {
                    user: true
                }
            }
        });
    }

    async getByUserUUID(userUUID: string) {
        const chats =  await this.chatRepo.find({
            where: {
                chatUsers: {
                    user: {
                        uuid: userUUID
                    }
                }
            },
            relations: {
                chatUsers: {
                    user: true
                }
            }
        });

        console.log(userUUID, chats)

        return chats
    }

    async update(message: UpdateMessageDTO) {
        return await this.chatRepo.update({uuid: message.uuid}, message);
    };

    async delete(uuid: string) {
        await this.chatRepo.delete({uuid: uuid})
    }

    async softDelete(uuid: string) {
        await this.chatRepo.softDelete({uuid: uuid})
    }
}
