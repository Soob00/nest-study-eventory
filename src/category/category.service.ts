import { Injectable } from '@nestjs/common';
import { CatetoryRepository } from './category.repository';
import { CategoryListDto } from './dto/category.dto';
import { CategoryData } from './type/category-data.type';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CatetoryRepository) {}

  async findAllCategories(): Promise<CategoryListDto> {
    // regionRepository에서 데이터를 받아오는 과정
    const categories: CategoryData[] =
      await this.categoryRepository.findAllCategories();

    // 하지만 배열을 그대로 보내주면 안되고, 원하는 출력 결과의 형식으로 바꿔야함. (ex) from 같은 걸로 포장을 한다고?
    return CategoryListDto.from(categories);
  }
}
