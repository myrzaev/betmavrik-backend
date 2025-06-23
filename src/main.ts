import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exeption.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })

  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
