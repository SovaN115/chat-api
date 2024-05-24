import { ChatType } from "../enums/role.enum"

export class CreateChatDTO {
    usersUUID: string[];
    type: ChatType;
}