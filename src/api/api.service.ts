import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/database/entities/category.entity';
import { CategoryType } from 'src/types';
import { changeCyrilicE, sortByCategory, spaceToHyphen } from 'src/utils';
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

  async getCategory({ id, slug }: GetCategoryDto): Promise<CategoryType> {
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

  async createCategory(dto: CreateCategoryDto): Promise<CategoryType> {
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
    return result as CategoryType;
  }

  async deleteCategory(id: string): Promise<true> {
    const result = await this._categoryRepository.delete({ id });
    if (result.affected !== 1) {
      throw new InternalServerErrorException('Category not deleted');
    }
    return true;
  }

  async updateCategory(dto: UpdateCategoryDto): Promise<CategoryType> {
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

  async getFilteredCategories(
    dto: GetFilteredCategoriesDto,
  ): Promise<CategoryType[]> {
    const { name, description, search } = dto;
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
        `LOWER(category_entity.description) LIKE LOWER(:description)
         OR LOWER(category_entity.description) LIKE LOWER(:cyrilic)`,
        {
          description: `%${description}%`,
          cyrilic: `%${changeCyrilicE(description)}%`,
        },
      );
    }

    if (dto.search) {
      builder.where(
        `LOWER(category_entity.name) LIKE LOWER(:search)
         OR LOWER(category_entity.name) LIKE LOWER(:cyrilic) 
         OR LOWER(category_entity.description) LIKE LOWER(:search)
         OR LOWER(category_entity.description) LIKE LOWER(:cyrilic)`,
        {
          search: `%${search}%`,
          cyrilic: `%${changeCyrilicE(search)}%`,
        },
      );
    }

    if ('active' in dto) {
      // class-validator filter "active" to be one of [ '0', '1', 'true', 'false'
      const active = dto.active === 'true' || dto.active === '1';
      builder.andWhere('category_entity.active = :active', { active });
    }

    // pagination
    const pageSize = dto.pageSize ? parseInt(dto.pageSize) : 2;
    builder.take(pageSize);

    // dto.page = [ '0' , ... , 'n']
    const page = !dto.page || dto.page === '0' ? 1 : parseInt(dto.page);
    builder.skip(pageSize * (page - 1));

    // sorting
    const sort = dto.sort ?? '-createdAt';
    const { attribute, order } = sortByCategory(sort);
    builder.orderBy(`category_entity.${attribute}`, order);

    return builder.getMany();
  }
}
