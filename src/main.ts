import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { credentials: true, origin: '*' },
  });
  const httpAdapterHost = app.get(HttpAdapterHost);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  const port: number = app.get(ConfigService).get('PORT');
  setupSwagger(app);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
      validateCustomDecorators: true,
    }),
  );
  app.useGlobalFilters(
    new GlobalExceptionFilter(new Logger(), httpAdapterHost),
  );
  await app.listen(port);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
