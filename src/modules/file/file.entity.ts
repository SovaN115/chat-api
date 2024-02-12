import {
    Column,
    Entity,
} from "typeorm";
import {BaseEntity} from "../../entities/base.entity";

@Entity()
export class File extends BaseEntity {

    @Column({
        type: "varchar",
        length: 100
    })
    name: string;

    @Column({
        type: "text"
    })
    uri: string;

}