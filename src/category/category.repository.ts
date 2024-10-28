import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CategoryData } from './type/category-data.type';

@Injectable()
export class CatetoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCategories(): Promise<CategoryData[]> {
    // prisma에서 뭔갈 가져오는 구문
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
}