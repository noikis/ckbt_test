import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/database/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        return {
          type: 'mysql',
          host: configService.getOrThrow('HOST'),
          port: configService.getOrThrow('MYSQL_PORT'),
          username: configService.getOrThrow('MYSQL_ROOT_USER'),
          password: configService.getOrThrow('MYSQL_ROOT_PASSWORD'),
          database: configService.getOrThrow('MYSQL_DATABASE'),
          entities: [CategoryEntity],
          synchronize: configService.getOrThrow('NODE_ENV') !== 'production',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
