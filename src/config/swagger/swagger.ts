import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const setupSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('땡겨')
    .setDescription('Team 오합지존의 땡겨 프로젝트를 위한 API 문서')
    .addTag('Ohapzizon')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};
