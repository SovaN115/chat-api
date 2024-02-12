import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { FileService } from './file.service';
import {File} from './file.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([File])
    ],
    providers: [
        FileService
    ]
})
export class FileModule {}
