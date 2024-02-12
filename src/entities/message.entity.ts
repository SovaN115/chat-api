import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany,

} from "typeorm";
import {ChatUser} from "./chat-user.entity";
import {Chat} from "./chat.entity";
import {BaseEntity} from "./base.entity";
import {File} from "../modules/file/file.entity"
@Entity()
export class Message extends BaseEntity {

    @Column({
        type: "text",
    })
    message: string

    @JoinColumn([
        {name: "chat_uuid", referencedColumnName: "uuid"}
    ])
    @ManyToOne(() => Chat, chat => chat.messages)
    chat: Chat;

    @JoinColumn([
        {name: "chat_user_uuid", referencedColumnName: "uuid"}
    ])
    @ManyToOne(() => ChatUser, chatUser => chatUser.messages)
    chatUser: ChatUser;

    @JoinTable()
    @ManyToMany(() => File)
    files: File[]
}