import { setSeederFactory } from 'typeorm-extension';
import { ProductGroupModel } from './productGroup.model';

const names = ['pastilla', 'tableta', 'caja'];

export default setSeederFactory(ProductGroupModel, (faker) => {
  const productGroup = new ProductGroupModel();
  const name = faker.helpers.arrayElement(names);
  let amount = faker.number.int({
    min: 5,
    max: 50,
  });
  if (['pastilla'].includes(name)) {
    amount = 1;
  }
  const salePrice = faker.number.int({
    min: 5,
    max: 400,
  });
  productGroup.name = name;
  productGroup.amount = amount;
  productGroup.salePrice = salePrice * 100;
  return productGroup;
});
