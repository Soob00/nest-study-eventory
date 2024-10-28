import { ApiProperty } from '@nestjs/swagger';
import { CategoryData } from '../type/category-data.type';

export class CategoryDto {
  // 얘는 name과 id 두 개의 attribute? 를 가짐. 그걸 만들어 준 것.
  // response 보면 나오는 형식으로 보면 됨.
  @ApiProperty({
    description: '카테고리 ID',
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: '카테고리 이름',
    type: String,
  })
  name!: string;

  static from(category: CategoryData): CategoryDto {
    return {
      id: category.id,
      name: category.name,
    };
  }

  static fromArray(categories: CategoryData[]): CategoryDto[] {
    return categories.map((category) => this.from(category));
  }
}

// return Data가 어떻게 보이는지.
export class CategoryListDto {
  @ApiProperty({
    description: '카테고리 목록',
    type: [CategoryDto],
  })
  categories!: CategoryDto[]; // regions라는 애가 regionDto라는 배열을 가지고 있는다는 뜻

  static from(categories: CategoryData[]): CategoryListDto {
    return {
      categories: CategoryDto.fromArray(categories),
    };
  }
}
