import { setServers } from 'node:dns/promises';

try {
  // Force Node.js runtime to bypass local ISP blockers and resolve via Cloudflare/Google DNS
  setServers(['1.1.1.1', '8.8.8.8']);
} catch (e) {
  console.warn('DNS override wrapper unavailable, falling back to system defaults.');
}


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
