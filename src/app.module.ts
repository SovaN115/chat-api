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
       username: process.env.DATABASE_USER,
       password: process.env.DATABASE_PASS,
       database: 'chat',
       synchronize: true,
       autoLoadEntities: true,
       logging: ["query", "error"],
       migrations: ["./src/migrations/*.js"],
       migrationsTableName: "migrations",
     }),
    AuthModule.forRoot(User),
    FileModule,
    ChatModule,
    InstanceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EdgeConstructorService,
  ],
})
export class AppModule {

}
