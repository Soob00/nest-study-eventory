import { Injectable } from '@nestjs/common';
import { RegionRepository } from './region.repository';
import { RegionListDto } from './dto/region.dto';
import { RegionData } from './type/region-data.type';

@Injectable()
export class RegionService {
  constructor(private readonly regionRepository: RegionRepository) {}

  async findAllRegions(): Promise<RegionListDto> {
    // regionRepository에서 데이터를 받아오는 과정
    const regions: RegionData[] = await this.regionRepository.findAllRegions();

    // 하지만 배열을 그대로 보내주면 안되고, 원하는 출력 결과의 형식으로 바꿔야함. (ex) from 같은 걸로 포장을 한다고?
    return RegionListDto.from(regions);
  }
}
// 끝. 제일 간단하게. sudo code 느낌으로.
