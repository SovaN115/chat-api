import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import * as process from "process";
import {User} from "./modules/auth/entities/user.entity";
import {ChatModule} from "./chat/chat/chat.module";
import { FileModule } from './modules/file/file.module';
import { InstanceModule } from './chat/instance/instance.module';
import { EdgeConstructorService } from './services/edge-constructor.service';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { AccessTokenService } from "./modules/auth/services/access-token.service";
import { RefreshTokenService } from "./modules/auth/services/refresh-token.service";
import { TokenDataService } from "./modules/auth/services/token-data.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { OnlineStatusGateway } from './gateways/online-status/online-status.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true
    }),
    ServeStaticModule.forRoot({
      serveStaticOptions: {
        index: false,
        redirect: false
      },
      rootPath: join(__dirname, '..', '..', 'cl_media'),
      serveRoot: '/cl_media',
    }),
     TypeOrmModule.forRoot({
       type: 'mysql',
       host: 'localhost',
       port: 3306,
       username: process.env.DATABASE_USER,
       password: process.env.DATABASE_PASS,
       database: 'chat',
       synchronize: true,
       autoLoadEntities: true,
       logging: [ "log"],
       migrations: ["./src/migrations/*.js"],
       migrationsTableName: "migrations",
     }),
    AuthModule.forRoot(User),
    FileModule,
    ChatModule,
    InstanceModule,
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    EdgeConstructorService,
    UserService,
    AccessTokenService,
    TokenDataService,
    RefreshTokenService,
    OnlineStatusGateway
  ],
})
export class AppModule {}
