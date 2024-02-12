import { Injectable } from '@nestjs/common';
import {EntityManager, Repository} from "typeorm";
import {User} from "../entities/user.entity";
import {CreateUserDTO} from "../dto/create-user.dto";
import {UpdateUserDTO} from "../dto/update-user.dto";

@Injectable()
export class UserDataService {
    private readonly userRepo: Repository<User>
    constructor(entityManager: EntityManager) {
        this.userRepo = entityManager.getRepository(User)
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
            middleName: dto.middleName
        });
        return await this.userRepo.save(createdUser);
    }
    async get(uuid: string) {
        await this.userRepo.find({
            where: {
                uuid: uuid
            }
        });
    }

    async getContacts(uuid: string) {
        return this.userRepo.find({
            where: {
                uuid: uuid,
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
