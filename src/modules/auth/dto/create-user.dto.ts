export class CreateUserDTO {
    authUserUUID: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    middleName: string;
}