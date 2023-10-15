import { Injectable, Logger } from '@nestjs/common';
import { ProductGroupModel } from './productGroup.model';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ProductModel } from '../product/product.model';

export class CreateProductGroupParams {
  name: string;
  amount: number;
  salePrice: number;
  product: ProductModel;
}

@Injectable()
export class ProductGroupRepository {
  private readonly logger = new Logger(ProductGroupRepository.name);
  constructor(
    @InjectRepository(ProductGroupModel)
    private readonly productGroupRepository: Repository<ProductGroupModel>,
  ) {}

  async createProductGroups(
    productGroups: CreateProductGroupParams[],
    transactionManager: EntityManager = null,
  ): Promise<ProductGroupModel[]> {
    this.logger.debug(
      `About to create a new groups: ${JSON.stringify(productGroups)}`,
    );

    const mgr: EntityManager = transactionManager
      ? transactionManager
      : this.productGroupRepository.manager;

    const newGroups = productGroups.map((group) => {
      const newProductGroup = new ProductGroupModel();
      newProductGroup.name = group.name;
      newProductGroup.amount = group.amount;
      newProductGroup.salePrice = group.salePrice;
      newProductGroup.product = group.product;
      return newProductGroup;
    });

    return mgr.save(ProductGroupModel, newGroups);
  }

  async createProductGroup(
    productGroup: CreateProductGroupParams,
    transactionManager: EntityManager = null,
  ): Promise<ProductGroupModel> {
    this.logger.debug(
      `About to create a new group: ${JSON.stringify(productGroup)}`,
    );

    const mgr: EntityManager = transactionManager
      ? transactionManager
      : this.productGroupRepository.manager;

    const newProductGroup = new ProductGroupModel();
    newProductGroup.name = productGroup.name;
    newProductGroup.amount = productGroup.amount;
    newProductGroup.salePrice = productGroup.salePrice;
    newProductGroup.product = productGroup.product;

    return mgr.save(newProductGroup);
  }
}
