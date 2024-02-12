import { Injectable } from '@nestjs/common';
import {EntityManager, Repository} from "typeorm";
import {CreateFileDTO} from "./dto/createFile.dto";
import {File} from "./file.entity";
import {UpdateFileDTO} from "./dto/updateFile.dto";
@Injectable()
export class FileService {

    private fileRepo: Repository<File>;
    constructor(entityManager: EntityManager) {
        this.fileRepo = entityManager.getRepository(File);
    }
    async create(file: CreateFileDTO) {
        const createdMessage = this.fileRepo.create({
            name: file.name,
            uri: file.uri
        });

        return await this.fileRepo.save(createdMessage);
    };

    async get(uuid: string) {
        await this.fileRepo.find({
            where: {
                uuid: uuid
            }
        });
    }

    async update(file: UpdateFileDTO) {
        return await this.fileRepo.update({uuid: file.uuid}, file);
    };

    async delete(uuid: string) {
        await this.fileRepo.delete({uuid: uuid})
    }

    async softDelete(uuid: string) {
        await this.fileRepo.softDelete({uuid: uuid})
    }
}
