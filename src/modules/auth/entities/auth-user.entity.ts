import {
  Column,
  CreateDateColumn,
  Entity, Index, JoinColumn,
  OneToMany, OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Token } from "./token.entity";
import {Inject} from "@nestjs/common";
import {User} from "./user.entity";
@Entity()
export class AuthUser {

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
    length: 100
  })
  login: string;

  @Column("varchar", {
    length: 100
  })
  password: string;

  @OneToMany(() => Token, (token) => token.authUser)
  @JoinColumn([
    {name: "uuid", referencedColumnName: "auth_user_uuid"}
  ])
  tokens: Token[]

  @OneToOne(() => User, (user) => user.authUser)
  user: User;

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