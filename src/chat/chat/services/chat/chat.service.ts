import { Injectable } from '@nestjs/common';
import {EntityManager, Repository} from "typeorm";
import {Chat} from "../../../../entities/chat.entity";
import {Message} from "../../../../entities/message.entity";
import {CreateMessageDTO} from "../../dto/create-message.dto";
import {UpdateMessageDTO} from "../../dto/update-message.dto";
import { ChatUser } from 'src/entities/chat-user.entity';
import { ChatType } from '../../enums/role.enum';

@Injectable()
export class ChatService {
    chatRepo: Repository<Chat>;
    chatUserRepo: Repository<ChatUser>;

    constructor(entityManager: EntityManager) {
        this.chatRepo = entityManager.getRepository<Chat>(Chat);
        this.chatUserRepo = entityManager.getRepository<ChatUser>(ChatUser);
    }

    async create(usersUUID: string[], type: ChatType) {
        const chat = new Chat();
        const uuids = usersUUID.map(item => ({uuid: item}))
        const chatUsers = await this.chatUserRepo.find({
            where: {
                user: uuids
            }
        })

        // console.log(chatUsers);
        // console.log(uuids)

        chat.chatUsers = chatUsers;
        chat.type = type;
        return await this.chatRepo.save(chat);
    };

    async checkIfExist(usersUUID: string[], type: ChatType) {
        const arr = usersUUID.map(item => {
            return {
                uuid: item
            }
        });

        const chatUsers = await this.chatUserRepo.find({
            where: {
                user: arr
            }
        })

        const chatUsersArr = chatUsers.map(item => ({uuid: item.uuid}));

        const chats = await this.chatRepo.find({
            where: {
                chatUsers: chatUsersArr,
                type: type
            },
            relations: {
                chatUsers: {
                    user: true
                }
            }
        })

        let exists: boolean = false;
        let result: Chat;

        chats.forEach(chat => {
            let chatUsersCount: number = 0;
            // console.log(chatUsersCount)
            if(!exists) {
                usersUUID.forEach(userUUID => {
                    chat.chatUsers.forEach(chatUser => {
                        // console.log(chatUser.user.uuid, userUUID)
                        if(chatUser.user.uuid == userUUID) {
                            ++chatUsersCount;
                        }
                    })
                });
                // console.log(chatUsersCount)
                if(chatUsersCount == usersUUID.length) {
                    exists = true;
                    result = chat;
                }
            }
        })
        
        return result;
    };

    async get(uuid: string, withMessages: boolean = false) {
        let messages;

        if(withMessages) {
            messages = {
                chatUser: {
                    user: true
                }
            }
        } else {
            messages = false;
        }

        return await this.chatRepo.findOne({
            where: {
                uuid: uuid
            },
            relations : {
                chatUsers: {
                    user: true
                },
                messages: messages
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
        const chatUser = await this.chatUserRepo.findOne({
            where: {
                user: {
                    uuid: userUUID
                }
            },
            relations: {
                chats: {
                    chatUsers: {
                        user: true
                    }
                }
            }
        })

        console.log(1, chatUser)
        console.log(userUUID)

        const chats = chatUser?.chats;

        return chats;
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
