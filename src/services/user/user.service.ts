import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/auth/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserService {
    userRepo: Repository<User>;
    constructor(entityManager: EntityManager) {
        this.userRepo = entityManager.getRepository<User>(User);
    }

    async getUser(userUUID: string) {
        return await this.userRepo.findOne({
            where: {
                uuid: userUUID
            }
        })
    }

    async getUsers() {
        return await this.userRepo.find({})
    }
    
    async editUser(input: any) {
        // console.log({
        //     firstName: input?.firstName,
        //     lastName: input?.lastName,
        //     middleName: input?.middleName,
        //     phone: input?.phone,
        //     isOnline: input?.isOnline
        // })
        await this.userRepo.update(
            {
                uuid: input.userUUID
            },
            {
                firstName: input?.firstName,
                lastName: input?.lastName,
                middleName: input?.middleName,
                phone: input?.phone,
                isOnline: input?.isOnline
            }
        )

        return await this.getUser(input.userUUID);
    }

}