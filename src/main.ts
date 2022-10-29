import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setSwaggerDocs } from './config/swagger/swagger';
import { setNestApp } from './config/app/set-nest.app';
import dataSource from './config/database/data-source';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port: number = +process.env.PORT;
  setSwaggerDocs(app);
  setNestApp(app);
  dataSource
    .initialize()
    .then(() => {
      console.log('DataSource has been initialized');
    })
    .catch((err) =>
      console.error('Error during Data Source initialization', err),
    );
  await app
    .listen(port)
    .then(async () =>
      console.log(`Application is running on: ${await app.getUrl()}`),
    );
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
