import { Controller, Get } from "@nestjs/common";
import { AuthUserDataService } from "../../services/auth-user-data.service";

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
}
