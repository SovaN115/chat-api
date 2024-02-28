import { Injectable } from '@nestjs/common';
import {RoleEnum} from "./modules/auth/enums/role.enum";

@Injectable()
export class AppService {

  getHello(): string {

    return 'Hello World!';
  }
}
