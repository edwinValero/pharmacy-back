import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { ProductGroupModel } from './productGroup.model';
import { ProductModel } from '../product/product.model';

export default class ProductGroupSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const groupFactory = factoryManager.get(ProductGroupModel);
    const products = await dataSource.manager.find(ProductModel);

    const groups = [];
    for (const product of products) {
      const group = await groupFactory.make({
        product,
        name: 'pastilla',
        amount: 1,
      });
      groups.push(group);
      const group2 = await groupFactory.make({
        product,
        name: 'caja',
        amount: 50,
      });
      groups.push(group2);
      const group3 = await groupFactory.make({
        product,
        name: 'tableta',
        amount: 10,
      });
      groups.push(group3);
    }

    await dataSource.manager.save(groups);
  }
}
