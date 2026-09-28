import { Module } from '@nestjs/common';
import { SanminService } from './sanmin.service';
import { SanminController } from './sanmin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sanmin } from './entities/sanmin.entity';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sanmin]),CompanyModule],
  controllers: [SanminController],
  providers: [SanminService],

})
export class SanminModule {}
