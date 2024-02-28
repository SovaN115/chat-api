import {
    Column,
    CreateDateColumn,
    Entity, Index, ManyToOne,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./user.entity";
import {Roles} from "../roles";
import {AuthUser} from "./auth-user.entity";
import {RoleEnum} from "../enums/role.enum";
@Entity()
export class Role {

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

    @Column({
        type: "enum",
        enum: RoleEnum,
    })
    role: Roles;

    @ManyToOne(() => AuthUser, (user) => user.roles)
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