import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { ProductGroupModel, ProductModel } from './';
import ProductSeeder from './product/product.seeder';
import productFactory from './product/product.factory';
import ProductGroupSeeder from './productGroup/productGroup.seeder';
import productGroupFactory from './productGroup/productGroup.factory';

(async () => {
  const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: 'localhost',
    username: 'root',
    password: 'root',
    database: 'pharmacy',
    port: Number.parseInt(process.env.DATA_BASE_PORT) || 5432,
    entities: [ProductModel, ProductGroupModel],
    seeds: [ProductSeeder, ProductGroupSeeder],
    factories: [productFactory, productGroupFactory],
  };

  const dataSource = new DataSource(options);
  await dataSource.initialize();

  runSeeders(dataSource);
})();
