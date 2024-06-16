import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnlineStatus } from 'src/modules/auth/enums/online-status.enum';
import { JWT } from 'src/modules/auth/jwt';
import { AccessTokenService } from 'src/modules/auth/services/access-token.service';
import { UserService } from 'src/services/user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class OnlineStatusGateway {
  @WebSocketServer() server: Server = new Server();

  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly userService: UserService
  ) {
  }

  @SubscribeMessage('online-status')
  async handleMessage(client: any, payload: any): Promise<any> {
    const jwt: JWT = this.accessTokenService.getPayload(client.handshake.auth.token);
    await this.userService.editUser({userUUID: jwt.userUUID, onlineStatus: payload});
    this.server.emit("online-statuses", {userUUID: jwt.userUUID, onlineStatus: payload});
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    const jwt: JWT = this.accessTokenService.getPayload(client.handshake.auth.token);
    await this.userService.editUser({userUUID: jwt.userUUID ,onlineStatus: OnlineStatus.Online});
    this.server.emit("online-statuses", {userUUID: jwt.userUUID, onlineStatus: OnlineStatus.Online});
  }

  async handleDisconnect(client: Socket): Promise<any> {
    const jwt: JWT = this.accessTokenService.getPayload(client.handshake.auth.token);
    await this.userService.editUser({userUUID: jwt.userUUID ,onlineStatus: OnlineStatus.Offline});
    console.log(jwt.userUUID)
    this.server.emit("online-statuses", {userUUID: jwt.userUUID, onlineStatus: OnlineStatus.Offline});
    console.log('Client disconnected');
  }
}
