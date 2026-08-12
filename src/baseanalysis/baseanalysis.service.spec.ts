import { Test, TestingModule } from '@nestjs/testing';
import { BaseanalysisService } from './baseanalysis.service';

describe('BaseanalysisService', () => {
  let service: BaseanalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseanalysisService],
    }).compile();

    service = module.get<BaseanalysisService>(BaseanalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
