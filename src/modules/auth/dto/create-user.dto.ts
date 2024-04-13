import { Roles } from '../roles';
import { RoleEnum } from '../enums/role.enum';

export class CreateUserDTO {
    authUserUUID: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    middleName: string;
    // instanceUUID: string;
}