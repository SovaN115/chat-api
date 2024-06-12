import {
  MessageBody,
  OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as console from 'node:console';
import { ChatService } from '../services/chat/chat.service';
import { AccessTokenService } from '../../../modules/auth/services/access-token.service';
import { JWT } from '../../../modules/auth/jwt';
import { MessageService } from '../services/message/message.service';
import { ChatUserService } from '../services/chat-user/chat-user.service';
import { ClientRequest } from 'node:http';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server = new Server();

  constructor(
    private readonly chatDataService: ChatService,
    private readonly accessTokenService: AccessTokenService,
    private readonly messageService: MessageService,
    private readonly chatUserService: ChatUserService
  ) {
  }

  @SubscribeMessage('message')
  async handleEvent(
    client: Socket,
    payload: any
  ) {
    console.log('dfdf',client)
    // console.log(this.server, payload);
    // console.log(client.request.headers.authorization.split(' ')[1])
    // const jwt: JWT = this.accessTokenService.decode(client.request.headers.authorization.split(' ')[1]) as JWT;
    // const chatUser = await this.chatUserService.get(payload.chatUserUUID);
    // let message = await this.messageService.create(payload.message, payload.chatUserUUID, chatUser.chat.uuid);
    // message = await this.messageService.get(message.uuid);
    // console.log(message);
    this.server.to(payload.chatUUID).emit('message', payload.message); // broadcast messages
    return payload;
  }

  @SubscribeMessage('message-subscribe')
  async handleSubsctibeToMessages(client: Socket) {
    // console.log(client.request)
    // console.log(payload)
    // const jwt: JWT = this.accessTokenService.decode(client.request.headers.authorization) as JWT;
    // const chats = await this.chatDataService.getByUserUUID(jwt.userUUID);

    // console.log(chats[0].chatUsers);

    // chats.forEach((chat) => {
    //   client.join(chat.uuid)
    // })
  }

  // @SubscribeMessage('message-subscribe')
  // async handleSendMessage(client: Socket): Promise<void> {
  //   console.log(client)
  // }

  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    // console.log(client.request.headers.authorization.split(' ')[1])
    const jwt: JWT = this.accessTokenService.getPayload(client.request.headers.authorization.split(' ')[1]);
    const chats = await this.chatDataService.getByUserUUID(jwt.userUUID);
    // console.log(jwt)
    // console.log(chats[0].chatUsers);

    // console.log(chats)

    chats.forEach((chat) => {
      client.join(chat.uuid);
    })
  }

  handleDisconnect(client: Socket): any {
    console.log('Client disconnected');
  }
}
