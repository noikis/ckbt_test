import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { onlyLatinRegex } from 'src/utils';

export class GetCategoryDto {
  @ApiProperty({
    description: 'primary key (uuid)',
    uniqueItems: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  id?: string;

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
}
