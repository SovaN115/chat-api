import { Test, TestingModule } from '@nestjs/testing';
import { OnlineStatusGateway } from './online-status.gateway';

describe('OnlineStatusGateway', () => {
  let gateway: OnlineStatusGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnlineStatusGateway],
    }).compile();

    gateway = module.get<OnlineStatusGateway>(OnlineStatusGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
