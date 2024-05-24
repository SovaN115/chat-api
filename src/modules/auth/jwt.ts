import { Role } from "./entities/role.entity";

export type JWT = {
    authUserUUID: string;
    userUUID: string;
    roles: Role[];
}