import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('/api')
export class ApiController {
  constructor(private readonly _apiService: ApiService) {}

  @Post('/categories/create')
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this._apiService.createCategory(dto);
  }

  @Delete('/categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this._apiService.deleteCategory(id);
  }
}
