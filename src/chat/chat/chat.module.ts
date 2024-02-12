import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Chat} from "../../entities/chat.entity";
import {ChatUser} from "../../entities/chat-user.entity";
import {Message} from "../../entities/message.entity";
import { ChatService } from './services/chat/chat.service';
import { MessageService } from './services/message/message.service';
import { ChatUserService } from './services/chat-user/chat-user.service';

@Module({
  imports: [
      TypeOrmModule.forFeature([
          Chat,
          ChatUser,
          Message
      ])
  ],
  controllers: [ChatController],
  providers: [ChatService, MessageService, ChatUserService]
})
export class ChatModule {}
