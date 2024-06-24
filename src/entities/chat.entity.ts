import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn, JoinTable, ManyToMany, ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import {Message} from "./message.entity";
import {ChatUser} from "./chat-user.entity";
import {BaseEntity} from "./base.entity";
import {Instance} from "./instance.entity";
import { ChatType } from "src/chat/chat/enums/role.enum";

@Entity()
export class Chat extends BaseEntity {

    @Column({
        type: 'enum',
        enum: ChatType
    })
    type: ChatType;

    @Column({
        type: 'varchar',
        length: 255,
        default: "Новый групповой чат"
    })
    name: string;

    @Column({
        type: 'text',
        default: null
    })
    lastMessage: string;

    @JoinColumn([
        {name: "uuid", referencedColumnName: "chat_uuid"}
    ])
    @OneToMany(() => Message, (message) => message.chat)
    messages: Message[];

    @JoinTable()
    @OneToMany(() => ChatUser, (chatUser) => chatUser.chat)
    chatUsers: ChatUser[];

    // @ManyToOne(() => Instance, (instance) => instance.chats)
    // @JoinColumn([
    //     {name: "chat_uuid", referencedColumnName: "uuid"}
    // ])
    // instance: Instance[]

}