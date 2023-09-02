import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/udate-category.dto';

@Controller('/api')
export class ApiController {
  constructor(private readonly _apiService: ApiService) {}

  @Post('/categories/create')
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this._apiService.createCategory(dto);
  }

  @Delete('/categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this._apiService.deleteCategory(id);
  }

  @Put('/categories/update')
  async updateCategory(@Body() dto: UpdateCategoryDto) {
    return this._apiService.updateCategory(dto);
  }
}
