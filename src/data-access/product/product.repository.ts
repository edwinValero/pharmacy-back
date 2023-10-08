import { Injectable, Logger } from '@nestjs/common';
import { ProductModel } from './product.model';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ProductDetail } from 'src/type/productDetail';

export class CreateProductParams {
  name: string;
  tax: number;
  barcode: string;
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
    transactionManager: EntityManager = null,
  ): Promise<ProductModel> {
    this.logger.debug(
      `About to create a new product: ${JSON.stringify(productParams)}`,
    );

    const mgr: EntityManager = transactionManager
      ? transactionManager
      : this.productRepository.manager;

    const newProduct = new ProductModel();
    newProduct.name = productParams.name;
    newProduct.tax = productParams.tax;
    newProduct.barcode = productParams.barcode;

    return mgr.save(newProduct);
  }

  async getProducts(
    limit: number,
    offset: number,
    transactionManager: EntityManager = null,
  ): Promise<ProductDetail[]> {
    this.logger.debug(`About to get products limit ${limit} offset ${offset}`);

    const mgr: EntityManager = transactionManager
      ? transactionManager
      : this.productRepository.manager;

    const query = `
      SELECT id, name, tax, barcode
      FROM product
      WHERE "deletedAt" IS NULL
      ORDER BY id
      LIMIT $1
      OFFSET $2;
    `;

    const results = await mgr.query(query, [limit, offset]);

    return results;
  }

  async getProductsWithGroups(
    limit: number,
    offset: number,
    transactionManager: EntityManager = null,
  ): Promise<ProductModel[]> {
    this.logger.debug(
      `About to get products with groups limit ${limit} offset ${offset}`,
    );

    const mgr: EntityManager = transactionManager
      ? transactionManager
      : this.productRepository.manager;

    const results = await mgr
      .createQueryBuilder(ProductModel, 'product')
      .leftJoinAndSelect('product.groups', 'productGroup')
      .where('product.deletedAt IS NULL')
      .skip(offset)
      .take(limit)
      .getMany();

    return results;
  }

  async getTotalProducts(
    transactionManager: EntityManager = null,
  ): Promise<number> {
    this.logger.debug(`About to get total product`);

    const mgr: EntityManager = transactionManager
      ? transactionManager
      : this.productRepository.manager;

    const total = await mgr
      .createQueryBuilder(ProductModel, 'product')
      .leftJoinAndSelect('product.groups', 'productGroup')
      .where('product.deletedAt IS NULL')
      .getCount();

    return total;
  }
}
