import { Test, TestingModule } from '@nestjs/testing';
import { BaselaboratoryService } from './baselaboratory.service';

describe('BaselaboratoryService', () => {
  let service: BaselaboratoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaselaboratoryService],
    }).compile();

    service = module.get<BaselaboratoryService>(BaselaboratoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
