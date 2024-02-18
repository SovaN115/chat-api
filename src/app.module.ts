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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true
    }),
     TypeOrmModule.forRoot({
       type: 'mysql',
       host: 'localhost',
       port: 3306,
       username: process.env.DB_USER,
       password: process.env.DB_PASSWORD,
       database: 'chat',
       synchronize: true,
       autoLoadEntities: true,
       logging: ["query", "error"]
     }),
    AuthModule.forRoot(User),
    FileModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {

}
