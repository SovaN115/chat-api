import { Module } from '@nestjs/common';
import { InstanceController } from './controllers/instance.controller';
import { InstanceService } from './services/instance.service';
import { InstanceDataService } from './services/instance-data.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Instance} from "../../entities/instance.entity";
import {AccessTokenService} from "../../modules/auth/services/access-token.service";
import {EdgeConstructorService} from "../../services/edge-constructor.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Instance
    ]),
  ],
  controllers: [InstanceController],
  providers: [InstanceService, InstanceDataService, AccessTokenService, EdgeConstructorService]
})
export class InstanceModule {}
