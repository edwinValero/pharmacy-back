import { Injectable, Logger } from '@nestjs/common';
import { ProductModel } from './product.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class CreateProductParams {
  name: string;
  tax: number;
  barCode: string;
}

@Injectable()
export class ProductRepository {
  private readonly logger = new Logger(ProductRepository.name);
  constructor(
    @InjectRepository(ProductModel)
    private readonly productRepository: Repository<ProductModel>,
  ) {}

  async createProduct(
    productParams: CreateProductParams,
    @TransactionManager() transactionManager: EntityManager = null,
  ): Promise<ProductModel> {
    this.logger.debug(
      `About to create a new product: ${JSON.stringify(productParams)}`,
    );

    const newProduct = new ProductModel();
    newProduct.name = productParams.name;
    newProduct.tax = productParams.tax;
    newProduct.barcode = productParams.barCode;
  }
}
