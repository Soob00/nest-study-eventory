import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryListDto } from './dto/category.dto';

@Controller('categories')
@ApiTags('Category API')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: '모든 카테고리 리스트' })
  @ApiOkResponse({ type: CategoryListDto })
  async findAllCategories(): Promise<CategoryListDto> { // 나중에 promise 따로 찾아보세요
    return this.categoryService.findAllCategories();
  }
}