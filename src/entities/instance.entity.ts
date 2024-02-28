import {Column, Entity, JoinColumn, OneToMany} from "typeorm";
import {BaseEntity} from "./base.entity";
import {Chat} from "./chat.entity";
import {User} from "../modules/auth/entities/user.entity";

@Entity()
export class Instance extends BaseEntity {
    @Column({
        type: "varchar",
        length: 50
    })
    name: string

    @OneToMany(() => Chat, chat => chat.instance)
    @JoinColumn([
        {name: "uuid", referencedColumnName: "chat_uuid"}
    ])
    chats: Chat[]

    @OneToMany(() => User, user => user.instance)
    @JoinColumn([
        {name: "uuid", referencedColumnName: "user_uuid"}
    ])
    users: User[]
}