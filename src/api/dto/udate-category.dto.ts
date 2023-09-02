import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';
import { onlyLatinRegex } from 'src/utils';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'primary key (uuid)',
    uniqueItems: true,
    required: true,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'unique slug, no cyrilic',
    uniqueItems: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(onlyLatinRegex, {
    message:
      'slug must contain only latin letters or digits, no cyrilic letters',
  })
  slug?: string;

  @ApiProperty({
    description: 'name of the category',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'visibility on the front-end, true by default',
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
