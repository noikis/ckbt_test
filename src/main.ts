import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const host = process.env.HOST || 'localhost';

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));

  const docsConfig = new DocumentBuilder()
    .setTitle('Coding Test Совкомбанк')
    .setDescription('Реализовать запросы для работы с категориями')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, docsConfig);
  document.servers = [{ url: '/api' }];
  SwaggerModule.setup('api/documentation', app, document);

  await app.listen(port, host, () => {
    Logger.log(`server started on ${host}:${port}`);
  });
}

bootstrap();
