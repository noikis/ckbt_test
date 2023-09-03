import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsString,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { generateNumbersStringified } from 'src/utils';

@ValidatorConstraint()
export class IsStringifiedInteger implements ValidatorConstraintInterface {
  validate(str: string) {
    const num = parseInt(str);
    const isNumber = !isNaN(num);
    const isPositive = num >= 0;
    return isNumber && isPositive;
  }

  defaultMessage() {
    return 'the value is either not an integer or is negative';
  }
}

export class GetFilteredCategoriesDto {
  @ApiProperty({
    description: 'name of the category',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'description of the category, can be null',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'visibility on the front-end, true by default',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsIn(['0', '1', 'true', 'false'])
  active?: string;

  @ApiProperty({
    description:
      'search in name and description. If set the the previous two queries are ignored',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'number of ressources by page',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsIn(generateNumbersStringified(9))
  @IsOptional()
  pageSize?: string;

  @ApiProperty({
    description: 'the number of the page taken ressources from',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Validate(IsStringifiedInteger)
  page?: string;

  @ApiProperty({
    description:
      'order by attribute the ressources. Example "?sort=active" => ASC by active and "?sort=-name" => DESC by name',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  sort?: string;
}
