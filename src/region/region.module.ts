import { forwardRef, Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from './entities/region.entity';
import { District } from './entities/district.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[TypeOrmModule.forFeature([Region,District]), forwardRef(() => UserModule)],
  controllers: [RegionController],
  providers: [RegionService],
  exports:[RegionService]
})
export class RegionModule {}
