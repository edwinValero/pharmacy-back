import { setSeederFactory } from 'typeorm-extension';
import { ProductModel } from './product.model';

const taxes = [0, 5, 19, 12.5];

export default setSeederFactory(ProductModel, (faker) => {
  const product = new ProductModel();
  const name = faker.commerce.productName();
  const barcode = faker.number.bigInt({
    min: 1111111111111,
    max: 9999999999999n,
  });
  const tax = faker.helpers.arrayElement(taxes);
  product.name = name;
  product.barcode = `${barcode}`;
  product.tax = tax;
  return product;
});
