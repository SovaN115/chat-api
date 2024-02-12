import {MessageInterface} from "../message/message.interface";
import {BaseEntityInterface} from "../base-entity/base-entity.interface";

export interface ChatUserInterface extends BaseEntityInterface {
    name: string;
    lastName: string;
    middleName: string;
    nickname: string;
}
