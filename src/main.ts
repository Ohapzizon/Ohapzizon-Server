import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port: number = app.get(ConfigService).get('PORT');
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  setupSwagger(app);
  await app.listen(port);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
