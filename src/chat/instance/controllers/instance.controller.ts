import {Body, Controller, Get, Post, Req} from '@nestjs/common';
import {CreateChatDTO} from "../../chat/dto/create-chat.dto";
import {InstanceDataService} from "../services/instance-data.service";
import {AccessTokenService} from "../../../modules/auth/services/access-token.service";
import {CreateInstanceDTO} from "../dto/create-instance.dto";

@Controller('instance')
export class InstanceController {
    constructor(
        private readonly instanceDataService: InstanceDataService,
        private readonly accessTokenService: AccessTokenService
    ) {}

    // @Get("get-instance")
    // async get(
    //     @Req() req: Request
    // ) {
    //     const jwt = this.accessTokenService.getTokenFromHeader(req);
    //     return await this.instanceDataService.get(jwt.uuid);
    // }
    //
    // @Post("create-instance")
    // async create(
    //     @Body() dto: CreateInstanceDTO
    // ) {
    //     await this.instanceDataService.create(dto);
    // }
}
