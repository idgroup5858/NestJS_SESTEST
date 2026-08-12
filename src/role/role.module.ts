import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { CompanyModule } from 'src/company/company.module';
import { RegionModule } from 'src/region/region.module';

@Module({
  imports:[TypeOrmModule.forFeature([Role]),CompanyModule,RegionModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports:[RoleService]
})
export class RoleModule {}
