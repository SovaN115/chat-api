import { Test, TestingModule } from '@nestjs/testing';
import { NewChatGateway } from './new-chat.gateway';

describe('NewChatGateway', () => {
  let gateway: NewChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewChatGateway],
    }).compile();

    gateway = module.get<NewChatGateway>(NewChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
