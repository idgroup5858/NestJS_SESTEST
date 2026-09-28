import { Test, TestingModule } from '@nestjs/testing';
import { SanminService } from './sanmin.service';

describe('SanminService', () => {
  let service: SanminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SanminService],
    }).compile();

    service = module.get<SanminService>(SanminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
