import { Test, TestingModule } from '@nestjs/testing';
import { BaseanalysisController } from './baseanalysis.controller';
import { BaseanalysisService } from './baseanalysis.service';

describe('BaseanalysisController', () => {
  let controller: BaseanalysisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaseanalysisController],
      providers: [BaseanalysisService],
    }).compile();

    controller = module.get<BaseanalysisController>(BaseanalysisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
