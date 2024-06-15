import { Module } from '@nestjs/common';
import { ChatController } from './controllers/chat.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Chat} from "../../entities/chat.entity";
import {ChatUser} from "../../entities/chat-user.entity";
import {Message} from "../../entities/message.entity";
import { ChatService } from './services/chat/chat.service';
import { MessageService } from './services/message/message.service';
import { ChatUserService } from './services/chat-user/chat-user.service';
import { UserDataService } from '../../modules/auth/services/user-data.service';
import {MessageController} from "./controllers/message.controller";
import {AccessTokenService} from "../../modules/auth/services/access-token.service";
import {InstanceModule} from "../instance/instance.module";
import { MessageGateway } from './message/message.gateway';
import { UserService } from 'src/services/user/user.service';

@Module({
  imports: [
      TypeOrmModule.forFeature([
          Chat,
          ChatUser,
          Message
      ]),
  ],
  controllers: [
      ChatController,
      MessageController
  ],
  providers: [ChatService, MessageService, ChatUserService, UserDataService, AccessTokenService, UserService , MessageGateway]
})
export class ChatModule {}
