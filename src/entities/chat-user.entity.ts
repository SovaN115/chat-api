import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn, ManyToMany, ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import {Message} from "./message.entity";
import {Chat} from "./chat.entity";
import {User} from "../modules/auth/entities/user.entity";
import {BaseEntity} from "./base.entity";

@Entity()
export class ChatUser extends BaseEntity {
    @JoinColumn([
        {name: "user_uuid", referencedColumnName: "uuid"},
    ])
    @OneToOne(() => User, (user) => user.chatUsers)
    user: User;

    @OneToMany(() => Message, (message) => message.chatUser)
    @JoinColumn([
        {name: "uuid", referencedColumnName: "chat_user_uuid"}
    ])
    messages: Message[];

    @ManyToMany(() => Chat, (chat) => chat.chatUsers)
    chats: Chat[];
}