import {
  Column,
  CreateDateColumn,
  Entity, Index,
  JoinColumn, ManyToOne,
  OneToMany, OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn, Timestamp, UpdateDateColumn
} from "typeorm";
import { Token } from "./token.entity";
import { AuthUser } from "./auth-user.entity";
import {ChatUser} from "../../../entities/chat-user.entity";
import {Instance} from "../../../entities/instance.entity";

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

  @OneToOne(() => ChatUser, (chatUser) => chatUser.user)
  chatUsers: ChatUser;

  // @ManyToOne(() => Instance, (instance) => instance.users)
  // @JoinColumn([
  //   {name: "uuid", referencedColumnName: "user_uuid"}
  // ])
  // instance: Instance

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

  @Column({
    type: "boolean",
    default: false
  })
  isDeleted: boolean

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