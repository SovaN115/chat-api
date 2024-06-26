import {DynamicModule, MiddlewareConsumer, Module, NestModule, RequestMethod, Type} from "@nestjs/common";
import { AuthController } from './controllers/auth.controller';
import { TokenDataService } from './services/token-data.service';
import { UserDataService } from './services/user-data.service';
import { AuthUserDataService } from './services/auth-user-data.service';
import { AuthService } from './services/auth.service';
import { AccessTokenService } from './services/access-token.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { AuthUserController } from './controllers/auth-user.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthUser } from "./entities/auth-user.entity";
import { User } from "./entities/user.entity";
import { Token } from "./entities/token.entity";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {Role} from "./entities/role.entity";
import {InstanceDataService} from "../../chat/instance/services/instance-data.service";
import {EdgeConstructorService} from "../../services/edge-constructor.service";
import { RoleDataService } from './services/role-data.service';
import { ChatUserService } from "src/chat/chat/services/chat-user/chat-user.service";
import { TokenController } from './controllers/token.controller';

@Module({
  controllers: [TokenController]
})
export class AuthModule implements NestModule{
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware).exclude(
      {path: "auth/(.*)", method: RequestMethod.ALL},
      {path: "cl_media/(.*)", method: RequestMethod.ALL}
    ).forRoutes({path: "*", method: RequestMethod.ALL})
  }

  static forRoot(userEntity: EntityClassOrSchema): DynamicModule {
    return {
      imports: [
        TypeOrmModule.forFeature([
          AuthUser,
          User,
          Token,
          Role
        ])
      ],
      controllers: [AuthController, AuthUserController],
      providers: [TokenDataService, UserDataService, AuthUserDataService, ChatUserService, AuthService, AccessTokenService, RefreshTokenService, AuthMiddleware, InstanceDataService, EdgeConstructorService, RoleDataService],
      exports: [
          UserDataService
      ],
      module: AuthModule
    };
  }
}
