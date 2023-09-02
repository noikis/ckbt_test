import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/database/entities/category.entity';
import { spaceToHyphen } from 'src/utils';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly _categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createCategory(dto: CreateCategoryDto) {
    const transformedSlug = spaceToHyphen(dto.slug);
    const categoryWithSameSlug = await this._categoryRepository.count({
      where: { slug: transformedSlug },
    });

    if (categoryWithSameSlug > 0) {
      const errorMessage = `Category with the slug: "${categoryWithSameSlug}" already exists`;
      throw new ConflictException(errorMessage);
    }
    const createdEntity = await this._categoryRepository.insert(dto);
    const [generated] = createdEntity.generatedMaps;
    const result = { ...generated, ...dto, slug: transformedSlug };
    return result;
  }

  async deleteCategory(id: string): Promise<true> {
    const result = await this._categoryRepository.delete({ id });
    if (result.affected !== 1) {
      throw new InternalServerErrorException('Category not deleted');
    }
    return true;
  }
}
