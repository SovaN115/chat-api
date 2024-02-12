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
        return this.chatRepo.exist({
            where: {
                chatUsers: [
                    {
                        user: {
                            uuid: "736b3955-8cb3-4808-88b0-2c7b6b2a256c"
                        }
                    },
                    {
                        user: {
                            uuid: "e8d376f4-ede4-4dfe-b0aa-0ae1c51cdaa3"
                        }
                    }
                ]
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
