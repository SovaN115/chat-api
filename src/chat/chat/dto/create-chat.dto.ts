import { ChatType } from "../enums/role.enum"

export class CreateChatDTO {
    usersUUID: string[];
    type: ChatType;
}

export class CreateGroupChatDTO {
    usersUUID: string[];
    type: ChatType;
    name: string;
}