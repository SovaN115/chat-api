import {
  MessageBody,
  OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as console from 'node:console';
import { ChatService } from '../../chat/chat/services/chat/chat.service';
import { AccessTokenService } from '../../modules/auth/services/access-token.service';
import { JWT } from '../../modules/auth/jwt';
import { MessageService } from '../../chat/chat/services/message/message.service';
import { ChatUserService } from '../../chat/chat/services/chat-user/chat-user.service';
import { ClientRequest } from 'node:http';
import { UserService } from 'src/services/user/user.service';
import { OnlineStatus } from 'src/modules/auth/enums/online-status.enum';

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
    private readonly chatUserService: ChatUserService,
    private readonly userService: UserService
  ) {
  }

  @SubscribeMessage('message')
  async handleEvent(
    client: Socket,
    payload: any
  ) {
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
    const jwt: JWT = this.accessTokenService.getPayload(client.handshake.auth.token);
    const chats = await this.chatDataService.getByUserUUID(jwt.userUUID); 
    await this.userService.editUser({userUUID: jwt.userUUID ,onlineStatus: OnlineStatus.Online});

    //@ts-ignore
    // this.server.engine.clients.forEach((client: Socket) => {
    //   client.join(jwt.userUUID);
    // })
    this.server.sockets.sockets.forEach((socket: Socket) => {
      socket.join(jwt.userUUID);
    })

    this.server.to(jwt.userUUID).emit("online-statuses", {userUUID: jwt.userUUID, onlineStatus: OnlineStatus.Online});

    if(chats) {
      chats.forEach((chat) => {
        client.join(chat.uuid);
      })
    }
  }

  async handleDisconnect(client: Socket): Promise<any> {
    const jwt: JWT = this.accessTokenService.getPayload(client.handshake.auth.token);
    await this.userService.editUser({userUUID: jwt.userUUID ,onlineStatus: OnlineStatus.Offline});
    console.log(jwt.userUUID)
    this.server.to(jwt.userUUID).emit("online-statuses", {userUUID: jwt.userUUID, onlineStatus: OnlineStatus.Offline});
    console.log('Client disconnected');
  }
}
