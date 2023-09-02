import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';
import { onlyLatinRegex } from 'src/utils';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'unique slug, no cyrilic',
    uniqueItems: true,
    required: true,
  })
  @IsString()
  @Matches(onlyLatinRegex, {
    message:
      'slug must contain only latin letters or digits, no cyrilic letters',
  })
  slug: string;

  @ApiProperty({
    description: 'name of the category',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'optional description of the category',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'visibility on the front-end, true by default',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
