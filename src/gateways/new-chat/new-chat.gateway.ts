import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat/services/chat/chat.service';
import { Chat } from 'src/entities/chat.entity';
import { OnlineStatus } from 'src/modules/auth/enums/online-status.enum';
import { JWT } from 'src/modules/auth/jwt';
import { AccessTokenService } from 'src/modules/auth/services/access-token.service';
import { UserService } from 'src/services/user/user.service';
import { EntityManager, Repository } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NewChatGateway {
  @WebSocketServer() server: Server = new Server();
  private readonly chatRepo: Repository<Chat>

  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly userService: UserService,
    private readonly manager: EntityManager
  ) {
    this.chatRepo = manager.getRepository(Chat);
  }

  @SubscribeMessage('new-chat')
  async handleMessage(client: any, payload: {chatUUID: string}): Promise<any> {
    const jwt: JWT = this.accessTokenService.getPayload(client.handshake.auth.token);
    const chat = await this.chatRepo.findOne({
      where: {
        uuid: payload.chatUUID
      },
      relations: {
        chatUsers: {
          user: true
        }
      }
    });

    chat.chatUsers.forEach(chatUser => {
      this.server.to(chatUser.user.uuid + 'chat').emit('new-chat', chat);
    })

    // await this.userService.editUser({userUUID: jwt.userUUID, onlineStatus: payload});
    // this.server.emit("online-statuses", {userUUID: jwt.userUUID, onlineStatus: payload});
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    const jwt: JWT = this.accessTokenService.getPayload(client.handshake.auth.token);
    client.join(jwt.userUUID + 'chat');
    // await this.userService.editUser({userUUID: jwt.userUUID ,onlineStatus: OnlineStatus.Online});
    // this.server.emit("online-statuses", {userUUID: jwt.userUUID, onlineStatus: OnlineStatus.Online});
  }

  async handleDisconnect(client: Socket): Promise<any> {
    // const jwt: JWT = this.accessTokenService.getPayload(client.handshake.auth.token);
    // await this.userService.editUser({userUUID: jwt.userUUID ,onlineStatus: OnlineStatus.Offline});
    // console.log(jwt.userUUID)
    // this.server.emit("online-statuses", {userUUID: jwt.userUUID, onlineStatus: OnlineStatus.Offline});
    // console.log('Client disconnected');
  }
}
