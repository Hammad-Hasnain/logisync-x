import { setServers } from 'node:dns/promises';

try {
  // Force Node.js runtime to bypass local ISP blockers and resolve via Cloudflare/Google DNS
  setServers(['1.1.1.1', '8.8.8.8']);
} catch (e) {
  console.warn('DNS override wrapper unavailable, falling back to system defaults.');
}


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            
      forbidNonWhitelisted: true, 
      transform: true,            
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
