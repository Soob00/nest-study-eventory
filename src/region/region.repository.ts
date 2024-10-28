import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { RegionData } from './type/region-data.type';

@Injectable()
export class RegionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllRegions(): Promise<RegionData[]> {
    // prisma에서 뭔갈 가져오는 구문
    return this.prisma.region.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
}

// DB와 상호작용하는 로직 담당.
// 여기에 거의 모든 내용을 포함하기 때문에 STACK을 바꿔도 SERVICE 건들일 필요가 없어짐.