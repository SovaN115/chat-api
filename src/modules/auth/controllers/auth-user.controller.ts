import { Controller, Get, Post, Body } from "@nestjs/common";
import { AuthUserDataService } from "../services/auth-user-data.service";

@Controller('auth-user')
export class AuthUserController {
  constructor(
    private authUserDataService: AuthUserDataService
  ) {
  }

  @Get("auth-users")
  async users() {
    return await this.authUserDataService.getAuthUsers()
  }

  @Get("auth-user")
  async authUsers(

  ) {
    // return await this.authUserDataService.getAuthUserByUUID();
  }

  @Post("delete-auth-user")
  async deleteAuthUser(
    @Body() body: {authUserUUID: string}
  ) {
    return await this.authUserDataService.deleteAuthUserByUUID(body.authUserUUID)
  }
}
