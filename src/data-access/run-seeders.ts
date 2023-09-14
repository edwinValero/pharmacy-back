import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { ProductModel } from './';
import ProductSeeder from './product/product.seeder';
import productFactory from './product/product.factory';

(async () => {
  const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: 'localhost',
    username: 'root',
    password: 'root',
    database: 'pharmacy',
    port: Number.parseInt(process.env.DATA_BASE_PORT) || 5432,
    entities: [ProductModel],
    seeds: [ProductSeeder],
    factories: [productFactory],
  };

  const dataSource = new DataSource(options);
  await dataSource.initialize();

  runSeeders(dataSource);
})();
