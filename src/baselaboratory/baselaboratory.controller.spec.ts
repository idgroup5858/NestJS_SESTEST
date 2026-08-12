import { Test, TestingModule } from '@nestjs/testing';
import { BaselaboratoryController } from './baselaboratory.controller';
import { BaselaboratoryService } from './baselaboratory.service';

describe('BaselaboratoryController', () => {
  let controller: BaselaboratoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaselaboratoryController],
      providers: [BaselaboratoryService],
    }).compile();

    controller = module.get<BaselaboratoryController>(BaselaboratoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
