import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setSwaggerDocs } from './config/swagger/swagger';
import { setNestApp } from './config/app/set-nest.app';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port = +configService.get<number>('PORT');
  setSwaggerDocs(app);
  setNestApp(app);
  await app
    .listen(port)
    .then(async () =>
      app
        .get(Logger)
        .log(`Application is running on: ${await app.getUrl()}`, 'Ohapzizon'),
    );
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
      app.close();
    });
  }
}
bootstrap();
