import { Test, TestingModule } from '@nestjs/testing';
import { EdgeConstructorService } from './edge-constructor.service';

describe('EdgeConstructorService', () => {
  let service: EdgeConstructorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EdgeConstructorService],
    }).compile();

    service = module.get<EdgeConstructorService>(EdgeConstructorService);
  });

  it('should be defined', () => {
    const o ={
      a: "a",
      b: [
        {
          c: "c",
          d: [
            {
              e: "e"
            }
          ]
        }
      ]
    }

    const result = {
      a: "a",
      b: {
        edges: [
          {
            node: {
              c: "c",
              d: {
                edges: [
                  {
                    node: {
                      e: "e"
                    }
                  }
                ],
                totalCount: 1
              }
            }
          }
        ],
        totalCount: 1
      }
    }
    expect(service.getEdgeFromEntity(o)).toBe(result);
  });
});
