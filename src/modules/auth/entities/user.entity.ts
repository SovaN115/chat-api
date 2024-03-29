import {
  Column,
  CreateDateColumn,
  Entity, Index,
  JoinColumn,
  OneToMany, OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn, Timestamp, UpdateDateColumn
} from "typeorm";
import { Token } from "./token.entity";
import { AuthUser } from "./auth-user.entity";
import {ChatUser} from "../../../entities/chat-user.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @PrimaryColumn({
    type: "char",
    length: 36,
    generated: 'uuid',
    unique: true
  })
  uuid: string;

  @Column("varchar", {
    length: 45
  })
  firstName: string;

  @Column("varchar", {
    length: 45
  })
  lastName: string;

  @Column("varchar", {
    length: 45
  })
  middleName: string;

  @Column("varchar", {
    length: 100,
    nullable: true
  })
  email: string;

  @Column("varchar", {
    length: 15,
    nullable: true
  })
  phone: string;

  @OneToOne(() => AuthUser, (authUser) => authUser.user)
  @JoinColumn([
    {name: "auth_user_uuid", referencedColumnName: "uuid"}
  ])
  authUser: AuthUser

  @OneToMany(() => ChatUser, (chatUser) => chatUser.user)
  @JoinColumn([
    {name: "uuid", referencedColumnName: "chat_user_uuid"}
  ])
  chatUsers: ChatUser[]

  @Column({
    type: "timestamp",
    nullable: true
  })
  lastOnline: Date;

  @Column({
    type: "boolean",
    nullable: true
  })
  isOnline: boolean

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)"
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)"
  })
  updatedAt: Date;
}