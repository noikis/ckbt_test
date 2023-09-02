import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/database/entities/category.entity';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
