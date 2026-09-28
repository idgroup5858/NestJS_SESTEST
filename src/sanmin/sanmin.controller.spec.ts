import { Test, TestingModule } from '@nestjs/testing';
import { SanminController } from './sanmin.controller';
import { SanminService } from './sanmin.service';

describe('SanminController', () => {
  let controller: SanminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SanminController],
      providers: [SanminService],
    }).compile();

    controller = module.get<SanminController>(SanminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
