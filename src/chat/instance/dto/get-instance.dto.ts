import {BaseEntity} from "../../../entities/base.entity";
import {Edge} from "../../../core/interfaces/edge/edge.interface";
import {Chat} from "../../../entities/chat.entity";
import {User} from "../../../modules/auth/entities/user.entity";

export class GetInstanceDTO extends BaseEntity {
    name: string;
    chats: Edge<Chat>;
    users: Edge<User>
}