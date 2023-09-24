import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { ProductModel } from './product.model';

export default class ProductSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const productFactory = factoryManager.get(ProductModel);
    // save 5 factory generated entities, to the database
    await productFactory.saveMany(5);
  }
}
