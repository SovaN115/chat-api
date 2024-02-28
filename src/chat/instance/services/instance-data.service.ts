import { Injectable } from '@nestjs/common';
import {EntityManager, Repository} from "typeorm";
import {Instance} from "../../../entities/instance.entity";
import {Edge} from "../../../core/interfaces/edge/edge.interface";
import {EdgeConstructorService} from "../../../services/edge-constructor.service";

@Injectable()
export class InstanceDataService {
    instanceRepo: Repository<Instance>
    constructor(
        entityManager: EntityManager,
        private readonly edgeConstructorService: EdgeConstructorService
    ) {
        this.instanceRepo = entityManager.getRepository(Instance)
    }

    async get(uuid: string) {
        const instances = await this.instanceRepo.findOne({
            where: {
                uuid: uuid
            }
        })
    }

    async create(instance: Partial<Instance>) {
        return await this.instanceRepo.save(instance);
    }
}
