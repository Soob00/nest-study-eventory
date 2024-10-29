import { ApiProperty } from '@nestjs/swagger';
import { RegionData } from '../type/region-data.type';

export class RegionDto {
  // 얘는 name과 id 두 개의 attribute? 를 가짐. 그걸 만들어 준 것.
  // response 보면 나오는 형식으로 보면 됨.
  @ApiProperty({
    description: '지역 ID',
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: '지역 이름(특별시/광역시/도)',
    type: String,
  })
  name!: string;

  static from(region: RegionData): RegionDto {
    return {
      id: region.id,
      name: region.name,
    };
  }

  static fromArray(regions: RegionData[]): RegionDto[] {
    return regions.map((region) => this.from(region));
  }
}

// return Data가 어떻게 보이는지.
export class RegionListDto {
  @ApiProperty({
    description: '지역 목록',
    type: [RegionDto],
  })
  regions!: RegionDto[]; // regions라는 애가 regionDto라는 배열을 가지고 있는다는 뜻

  static from(regions: RegionData[]): RegionListDto {
    return {
      regions: RegionDto.fromArray(regions),
    };
  }
}
