import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductModel } from 'src/data-access';
import { ProductRepository } from 'src/data-access/product/product.repository';
import { ProductGroupRepository } from 'src/data-access/productGroup/productGroup.repository';
import {
  ProductPatchRequestDto,
  ProductPostRequestDto,
} from 'src/entrypoint/api/dto/product.request';
import { throwErrorsWithUniqueConstraints } from 'src/error-handling/helper';
import { GroupDetail } from 'src/type/groupDetail';
import { ProductDetail } from 'src/type/productDetail';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class ProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productGroupRepository: ProductGroupRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createProductWithGroups(
    product: ProductPostRequestDto,
  ): Promise<ProductDetail> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    let productDetail: ProductDetail;
    try {
      const productModel = await this.createProduct(product, queryRunner);
      const groups = await this.createGroups(
        product,
        productModel,
        queryRunner,
      );

      productDetail = {
        id: productModel.id,
        name: productModel.name,
        tax: productModel.tax,
        barcode: productModel.barcode,
        groups: groups.map((group) => {
          return {
            id: group.id,
            name: group.name,
            amount: group.amount,
            salePrice: group.salePrice,
          };
        }),
      };
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    return productDetail;
  }

  async patchProduct(
    product: ProductPatchRequestDto,
    productId: number,
  ): Promise<ProductDetail> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    let productDetail: ProductDetail;
    try {
      const dbProduct = await queryRunner.manager.findOneBy(ProductModel, {
        id: productId,
      });
      if (dbProduct === null) {
        throw new HttpException(
          `Error: bad arguments, productId:${productId} does not exist`,
          HttpStatus.BAD_REQUEST,
        );
      }

      dbProduct.barcode = product.barcode;
      dbProduct.name = product.name;
      dbProduct.tax = product.tax;

      const productModel = await queryRunner.manager.save(dbProduct);

      productDetail = {
        id: productModel.id,
        name: productModel.name,
        tax: productModel.tax,
        barcode: productModel.barcode,
      };
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
    return productDetail;
  }

  private async createGroups(
    product: ProductPostRequestDto,
    productModel: ProductModel,
    queryRunner: QueryRunner,
  ) {
    try {
      const groups = product.groups.map((group) => {
        if (group.amount <= 0) {
          throw new HttpException(
            'Error: bad arguments, amount can not be 0 or less',
            HttpStatus.BAD_REQUEST,
          );
        }
        const newGroup = {
          name: group.name,
          amount: group.amount,
          salePrice: group.salePrice,
          product: productModel,
        };
        return newGroup;
      });
      const result = await this.productGroupRepository.createProductGroups(
        groups,
        queryRunner.manager,
      );
      return result;
    } catch (e) {
      throwErrorsWithUniqueConstraints(e, 'ProductGroup');
    }
  }

  private async createProduct(
    newProduct: ProductPostRequestDto,
    queryRunner: QueryRunner,
  ) {
    try {
      const result = await this.productRepository.createProduct(
        {
          name: newProduct.name,
          tax: newProduct.tax,
          barcode: newProduct.barcode,
        },
        queryRunner.manager,
      );
      return result;
    } catch (e) {
      throwErrorsWithUniqueConstraints(e, 'Product');
    }
  }

  async getProducts(limit: number, offset: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    let productsDetails: ProductDetail[];
    let total = 0;
    try {
      const products = await this.productRepository.getProductsWithGroups(
        limit,
        offset,
        queryRunner.manager,
      );

      productsDetails = products.map((model) => {
        const groups: GroupDetail[] = model.groups.map((modelGroup) => {
          return {
            id: modelGroup.id,
            name: modelGroup.name,
            amount: modelGroup.amount,
            salePrice: modelGroup.salePrice,
          };
        });

        const product: ProductDetail = {
          id: model.id,
          name: model.name,
          tax: model.tax,
          barcode: model.barcode,
          groups: groups,
        };
        return product;
      });

      total = await this.productRepository.getTotalProducts(
        queryRunner.manager,
      );
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    return {
      count: productsDetails.length,
      total,
      offset,
      limit,
      items: productsDetails,
    };
  }
}
