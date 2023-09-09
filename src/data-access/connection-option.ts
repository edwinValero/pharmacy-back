import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const connectionOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  port: Number.parseInt(process.env.DATA_BASE_PORT) || 5432,
  synchronize: false,
  host: process.env.DATA_BASE_PORT,
  username: process.env.DATA_BASE_PORT,
  password: process.env.DATA_BASE_PORT,
  database: process.env.DATA_BASE_PORT,
  entities: [],
};
