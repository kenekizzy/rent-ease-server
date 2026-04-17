import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables matching app.module.ts logic
const envPath = process.env.NODE_ENV === 'production' 
  ? '.env.development.prod' 
  : '.env.development.local';

config({ path: path.resolve(process.cwd(), envPath) });

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
