import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProductModel } from './product/product.model';
import { ProductGroupModel } from './productGroup/productGroup.model';

export const connectionOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  port: Number.parseInt(process.env.DB_PORT) || 5432,
  synchronize: true,
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USERNAME || 'dummy_user',
  password: process.env.DB_PASSWORD || 'dummy_password',
  database: process.env.DB_NAME || 'dummy_db_name',
  entities: [ProductModel, ProductGroupModel],
};
