import { Body, Controller, Get, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenService } from 'src/modules/auth/services/access-token.service';
import { RefreshTokenService } from 'src/modules/auth/services/refresh-token.service';
import { UserService } from 'src/services/user/user.service';
import * as fs from 'fs';
import { v4 } from 'uuid';
import * as fileExtension from 'file-extension';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { EntityManager, Repository } from 'typeorm';
import { AuthUser } from 'src/modules/auth/entities/auth-user.entity';

@Controller('user')
export class UserController {
    authRepo: Repository<AuthUser>;
    constructor(
        private readonly userService: UserService,
        private readonly manager: EntityManager,
        private readonly accessTokenService: AccessTokenService,
        private readonly refreshTokenService: RefreshTokenService,
    ) {
        this.authRepo = manager.getRepository(AuthUser);
    }

    @Get('user')
    async getUser(
        @Req() req: Request
    ) {
        //@ts-ignore
        const jwt = this.accessTokenService.getTokenFromHeader(req);
        // const refreshToken = req.cookies["jwt"];
        // const data = this.refreshTokenService.decode(refreshToken);
        // //@ts-ignore
        // console.log(data.exp)
        // //@ts-ignore
        // const endTime = new Date(data.exp)
        // console.log(`смерть куки в ${endTime}`)
        // console.log(`смерть куки в ${endTime}`)
        
        const user = await this.userService.getUser(jwt.userUUID);
        const authuser = await this.authRepo.findOne({
            where: {
                user: {
                    uuid: user.uuid
                }
            },
            relations: {
                roles: true
            }
        })
        const data = Object.assign(user, {roles: authuser.roles})
        console.log(data)
        return data;
    }

    @Post('users')
    async getUsers(
        @Body() body: {withDeleted: boolean},
        @Req() req: Request
    ) {
        // const jwt = this.accessTokenService.getTokenFromHeader(req);
        // console.log(jwt)
        return await this.userService.getUsers(body.withDeleted);
    }

    @Post('edit-user')
    @UseInterceptors(FileInterceptor('avatar'))
    async editUser(
        @Body() body: any,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request
    ) {
        const jwt = this.accessTokenService.getTokenFromHeader(req);
        body.userUUID = jwt.userUUID;

        if(file) {
            const fileName = v4();
            const extension = fileExtension(file.originalname);
            const path = `${process.cwd()}\\cl_media\\${fileName}.${extension}`;
            fs.createWriteStream(path).write(file.buffer);
            body.avatarURI = `/cl_media/${fileName}.${extension}`;
        }
        // console.log(file)
        // console.log()
        // const fileName = v4();
        // const extension = fileExtension(file.originalname);
        // const path = `${process.cwd()}\\cl_media\\${fileName}.${extension}`;
        // fs.createWriteStream(path).write(file.buffer);

        // // const jwt = this.accessTokenService.getTokenFromHeader(req);
        // console.log(`${process.cwd()}\\cl_media\\${fileName}.${extension}`)
        // console.log(body.text)
        // body.avatarURI = `/cl_media/${fileName}.${extension}`;
        // console.log(`/cl_media/${fileName}.${extension}`)
        // console.log(body)
        return await this.userService.editUser(body);
    }
}
