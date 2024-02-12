import {Column, CreateDateColumn, Index, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

export abstract class BaseEntity {

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