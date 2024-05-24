import { File } from '../../../modules/file/file.entity';

export class SendMessageDTO {
  chatUUID: string;
  userUUID: string;
  message: string;
  files: File[];
}