import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/database/entities/category.entity';
import { changeCyrilicE, spaceToHyphen } from 'src/utils';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { GetFilteredCategoriesDto } from './dto/get-filtered-categories.dto';
import { UpdateCategoryDto } from './dto/udate-category.dto';

@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly _categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getCategory({ id, slug }: GetCategoryDto) {
    if (!id && !slug) {
      throw new BadRequestException('Neither id nor slug');
    }

    let category: CategoryEntity;
    if (id) {
      category = await this._categoryRepository.findOneBy({ id });
    } else {
      category = await this._categoryRepository.findOneBy({ slug });
    }
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

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
    const result = {
      description: null,
      ...generated,
      ...dto,
      slug: transformedSlug,
    };
    return result;
  }

  async deleteCategory(id: string): Promise<true> {
    const result = await this._categoryRepository.delete({ id });
    if (result.affected !== 1) {
      throw new InternalServerErrorException('Category not deleted');
    }
    return true;
  }

  async updateCategory(dto: UpdateCategoryDto) {
    const { id } = dto;
    const category = await this._categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const result = await this._categoryRepository.update({ id }, dto);
    if (result.affected !== 1) {
      throw new InternalServerErrorException('Category not updated');
    }
    return { ...category, ...dto };
  }

  async getFilteredCategories(dto: GetFilteredCategoriesDto) {
    const { name, description, search, sort, page, pageSize } = dto;

    const builder =
      await this._categoryRepository.createQueryBuilder('category_entity');

    if ('name' in dto && !dto.search) {
      builder.where(
        'LOWER(category_entity.name) IN (LOWER(:name), LOWER(:cyrilic))',
        { name, cyrilic: changeCyrilicE(name) },
      );
    }

    if ('description' in dto && !dto.search) {
      builder.where(
        'LOWER(category_entity.description) LIKE LOWER(:description) OR LOWER(category_entity.description) LIKE LOWER(:cyrilic)',
        {
          description: `%${description}%`,
          cyrilic: `%${changeCyrilicE(description)}%`,
        },
      );
    }

    if ('active' in dto) {
      // class-validator filter "active" to be one of [ '0', '1', 'true', 'false'
      const active = dto.active === 'true' || dto.active === '1';
      builder.andWhere('category_entity.active = :active', { active });
    }

    return builder.getMany();
  }
}
