import {ChatUserInterface} from "../chat-user/chat-user.interface";

export interface MessageInterface {
    message: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
