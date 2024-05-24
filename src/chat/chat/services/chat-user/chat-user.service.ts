import { Injectable } from '@nestjs/common';
import {EntityManager, Repository} from "typeorm";
import {ChatUser} from "../../../../entities/chat-user.entity";

@Injectable()
export class ChatUserService {
    private chatUserRepo: Repository<ChatUser>;
    constructor(entityManager: EntityManager) {
        this.chatUserRepo = entityManager.getRepository(ChatUser);
    }

    async create(userUUID) {
        const createdMessage = this.chatUserRepo.create({
            user: {
                uuid: userUUID
            }
        });

        return await this.chatUserRepo.save(createdMessage);
    };

    async createMany(usersUUID: string[], chatUUID: string) {
        const arr = usersUUID.map(item => {
            return {
                user: {
                    uuid: item
                },
                chat: {
                    uuid: chatUUID
                }
            }
        })
        // const createdChatUsers = this.chatUserRepo.create(arr);
        const createdChatUsers = this.chatUserRepo.create(arr);
        return await this.chatUserRepo.save(arr);
    };

    async get(uuid: string) {
        return await this.chatUserRepo.findOne({
            where: {
                uuid: uuid
            },
            relations: {
                chats: true,
            }
        });
    }

    async update(chatUserUUID, chatUUID: string) {
        return await this.chatUserRepo.update({uuid: chatUserUUID}, {chats: [{uuid: chatUUID}]});
    };

    async delete(uuid: string) {
        await this.chatUserRepo.delete({uuid: uuid})
    }

    async softDelete(uuid: string) {
        await this.chatUserRepo.softDelete({uuid: uuid})
    }
}
