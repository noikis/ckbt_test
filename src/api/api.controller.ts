import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetFilteredCategoriesDto } from './dto/get-filtered-categories.dto';
import { UpdateCategoryDto } from './dto/udate-category.dto';

@Controller('/api')
export class ApiController {
  constructor(private readonly _apiService: ApiService) {}

  @Get('/category')
  async getCategory(@Query() query) {
    return this._apiService.getCategory(query);
  }

  @Post('/categories/create')
  async createCategory(@Body() body: CreateCategoryDto) {
    return this._apiService.createCategory(body);
  }

  @Delete('/categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this._apiService.deleteCategory(id);
  }

  @Put('/categories/update')
  async updateCategory(@Body() body: UpdateCategoryDto) {
    return this._apiService.updateCategory(body);
  }

  @Get('/categories')
  async getFilteredCategories(@Query() query: GetFilteredCategoriesDto) {
    return this._apiService.getFilteredCategories(query);
  }
}
