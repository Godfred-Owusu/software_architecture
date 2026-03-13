import { SeedService } from './modules/shared/database/seed.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { SeedService } from "src/modules/shared/database/database.module"

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  try {
    // We manually call the logic here
    await seedService.onApplicationBootstrap();
    console.log('Seed execution finished successfully.');
  } catch (error) {
    console.error('Seed execution failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
