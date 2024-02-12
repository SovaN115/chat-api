import {DynamicModule, MiddlewareConsumer, Module, NestModule, RequestMethod, Type} from "@nestjs/common";
import { AuthController } from './controllers/auth.controller';
import { TokenDataService } from './services/token-data.service';
import { UserDataService } from './services/user-data.service';
import { AuthUserDataService } from './services/auth-user-data.service';
import { AuthService } from './services/auth.service';
import { AccessTokenService } from './services/access-token.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { AuthMiddleware } from "./middlewares/auth/auth.middleware";
import { AuthUserController } from './controllers/auth-user/auth-user.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthUser } from "./entities/auth-user.entity";
import { User } from "./entities/user.entity";
import { Token } from "./entities/token.entity";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";



@Module({})
export class AuthModule implements NestModule{
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware).exclude(
      {path: "auth/(.*)", method: RequestMethod.ALL}
    ).forRoutes({path: "*", method: RequestMethod.ALL})
  }

  static forRoot(userEntity: EntityClassOrSchema): DynamicModule {
    return {
      imports: [
        TypeOrmModule.forFeature([
          AuthUser,
          User,
          Token
        ])
      ],
      controllers: [AuthController, AuthUserController],
      providers: [TokenDataService, UserDataService, AuthUserDataService, AuthService, AccessTokenService, RefreshTokenService, AuthMiddleware],
      exports: [
          UserDataService
      ],
      module: AuthModule
    };
  }
}
