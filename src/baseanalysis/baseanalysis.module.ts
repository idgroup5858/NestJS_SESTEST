import { Module } from '@nestjs/common';
import { BaseanalysisService } from './baseanalysis.service';
import { BaseanalysisController } from './baseanalysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Baseanalysis } from './entities/baseanalysis.entity';
import { BaselaboratoryModule } from 'src/baselaboratory/baselaboratory.module';

@Module({
  imports:[TypeOrmModule.forFeature([Baseanalysis]),BaselaboratoryModule],
  controllers: [BaseanalysisController],
  providers: [BaseanalysisService],
})
export class BaseanalysisModule {}
