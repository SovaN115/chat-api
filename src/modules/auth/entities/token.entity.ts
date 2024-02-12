import {
  Column,
  CreateDateColumn,
  Entity, Index, JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { AuthUser } from "./auth-user.entity";

@Entity()
export class Token {
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

  @Column("mediumtext")
  token: string;

  @ManyToOne(() => AuthUser, (authUser) => authUser.tokens)
  @JoinColumn([
    {name: "auth_user_uuid", referencedColumnName: "uuid"}
  ])
  authUser: AuthUser;

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