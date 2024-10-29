import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CatetoryRepository } from './category.repository';

@Module({
  // 여기에 있어야 실행 가능.
  controllers: [CategoryController],
  providers: [CategoryService, CatetoryRepository],
})
export class CategoryModule {}
