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
import { CategoryType } from 'src/types';
import { ApiService } from './api.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { GetFilteredCategoriesDto } from './dto/get-filtered-categories.dto';
import { UpdateCategoryDto } from './dto/udate-category.dto';

@Controller('/api')
export class ApiController {
  constructor(private readonly _apiService: ApiService) {}

  @Get('/category')
  async getCategory(@Query() query: GetCategoryDto): Promise<CategoryType> {
    return this._apiService.getCategory(query);
  }

  @Post('/categories/create')
  async createCategory(@Body() body: CreateCategoryDto): Promise<CategoryType> {
    return this._apiService.createCategory(body);
  }

  @Delete('/categories/:id')
  async deleteCategory(@Param('id') id: string): Promise<true> {
    return this._apiService.deleteCategory(id);
  }

  @Put('/categories/update')
  async updateCategory(@Body() body: UpdateCategoryDto): Promise<CategoryType> {
    return this._apiService.updateCategory(body);
  }

  @Get('/categories')
  async getFilteredCategories(
    @Query() query: GetFilteredCategoriesDto,
  ): Promise<CategoryType[]> {
    return this._apiService.getFilteredCategories(query);
  }
}
