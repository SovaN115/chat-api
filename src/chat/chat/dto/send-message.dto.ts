import { File } from '../../../modules/file/file.entity';

export class SendMessageDTO {
  chatUUID: string;
  chatUserUUID: string;
  message: string;
  files: File[];
}