import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn, ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import {Message} from "./message.entity";
import {ChatUser} from "./chat-user.entity";
import {BaseEntity} from "./base.entity";
import {Instance} from "./instance.entity";

@Entity()
export class Chat extends BaseEntity {

    @JoinColumn([
        {name: "uuid", referencedColumnName: "chat_uuid"}
    ])
    @OneToMany(() => Message, (message) => message.chat)
    messages: Message[];

    @JoinColumn([
        {name: "uuid", referencedColumnName: "chat_uuid"}
    ])
    @OneToMany(() => ChatUser, (chatUser) => chatUser.chat)
    chatUsers: ChatUser[];

    @ManyToOne(() => Instance, (instance) => instance.chats)
    @JoinColumn([
        {name: "chat_uuid", referencedColumnName: "uuid"}
    ])
    instance: Instance[]

}