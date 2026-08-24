import { forwardRef, Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { UserModule } from 'src/user/user.module';
import { LaboratoryModule } from 'src/laboratory/laboratory.module';
import { AnalysisModule } from 'src/analysis/analysis.module';
import { OrderModule } from 'src/order/order.module';
import { PatientModule } from 'src/patient/patient.module';

@Module({
  imports:[UserModule,LaboratoryModule,AnalysisModule,OrderModule,PatientModule],
  controllers: [GeminiController],
  providers: [GeminiService],
})
export class GeminiModule {}
