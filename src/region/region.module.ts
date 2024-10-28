import { Module } from '@nestjs/common';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';
import { RegionRepository } from './region.repository';

@Module({
  // 여기에 있어야 실행 가능.
  controllers: [RegionController],
  providers: [RegionService, RegionRepository],
})
export class RegionModule {}
