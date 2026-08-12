import { Module } from '@nestjs/common';
import { BaselaboratoryService } from './baselaboratory.service';
import { BaselaboratoryController } from './baselaboratory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Baselaboratory } from './entities/baselaboratory.entity';

@Module({
   imports:[TypeOrmModule.forFeature([Baselaboratory])],
  controllers: [BaselaboratoryController],
  providers: [BaselaboratoryService],
  exports:[BaselaboratoryService]
})
export class BaselaboratoryModule {}
