import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { Role } from '../entities/role.entity';
import { Chat } from '../../../entities/chat.entity';

@Injectable()
export class UserDataService {
    private readonly userRepo: Repository<User>
    private readonly roleRepo: Repository<Role>
    private readonly chatRepo: Repository<Chat>
    constructor(entityManager: EntityManager) {
        this.userRepo = entityManager.getRepository(User);
        this.roleRepo = entityManager.getRepository(Role);
        this.chatRepo = entityManager.getRepository(Chat);
    }

    async create(dto: CreateUserDTO) {
        const createdUser = this.userRepo.create({
            authUser: {
                uuid: dto.authUserUUID
            },
            phone: dto.phone,
            email: dto.email,
            firstName: dto.firstName,
            lastName: dto.lastName,
            middleName: dto.middleName,
            
        });
        return await this.userRepo.save(createdUser);
    }
    async get(uuid: string) {
        return await this.userRepo.findOne({
            where: {
                uuid: uuid
            },
            relations: {
                authUser: true
            }
        });
    }

    async getContacts(uuid: string) {
        const chats =  await this.chatRepo.find({
            where: {
                chatUsers: {
                    user: {
                        uuid: uuid
                    }
                }
            },
            relations: {
                chatUsers: {
                    user: true
                }
            }
        });

        console.log(uuid, chats)

        return chats
    }

    async update(dto: UpdateUserDTO) {
        return await this.userRepo.update({uuid: dto.uuid},dto);
    }

    async delete(uuid: string) {
        await this.userRepo.delete({uuid: uuid})
    }

    async softDelete(uuid: string) {
        await this.userRepo.softDelete({uuid: uuid})
    }
}
