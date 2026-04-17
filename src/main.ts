import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { CustomValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:3000', 'https://rent-eazy.netlify.app'],
    credentials: true,
  });

  // Enable global validation pipes with custom error formatting
  app.useGlobalPipes(new CustomValidationPipe());

  // Enable global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Set global prefix for API routes
  app.setGlobalPrefix('api/v1');

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
void bootstrap();
