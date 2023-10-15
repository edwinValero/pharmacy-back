import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductGroupModel, ProductModel } from 'src/data-access';
import { ProductGroupRepository } from 'src/data-access/productGroup/productGroup.repository';
import { GroupPatchRequestDto } from 'src/entrypoint/api/dto/group.request';
import { ProductGroupPostRequestDto } from 'src/entrypoint/api/dto/product.request';
import { throwErrorsWithUniqueConstraints } from 'src/error-handling/helper';
import { GroupDetail } from 'src/type/groupDetail';
import { DataSource } from 'typeorm';

@Injectable()
export class GroupUseCase {
  constructor(
    private readonly productGroupRepository: ProductGroupRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createGroup(
    group: ProductGroupPostRequestDto,
    productId: number,
  ): Promise<GroupDetail> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    let groupDetail: GroupDetail;
    try {
      if (group.amount <= 0) {
        throw new HttpException(
          'Error: bad arguments, amount can not be 0 or less',
          HttpStatus.BAD_REQUEST,
        );
      }

      const dbProduct = await queryRunner.manager.findOneBy(ProductModel, {
        id: productId,
      });
      if (dbProduct === null) {
        throw new HttpException(
          `Error: bad arguments, productId:${productId} does not exist`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const groupModel = await this.productGroupRepository.createProductGroup(
        { ...group, product: dbProduct },
        queryRunner.manager,
      );

      groupDetail = {
        id: groupModel.id,
        name: groupModel.name,
        amount: groupModel.amount,
        salePrice: groupModel.salePrice,
      };
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throwErrorsWithUniqueConstraints(e, 'ProductGroup');
    } finally {
      await queryRunner.release();
    }
    return groupDetail;
  }

  async getProductGroups(productId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    let groupsDetails: GroupDetail[];
    try {
      const dbProduct = await queryRunner.manager.findOneBy(ProductModel, {
        id: productId,
      });
      if (dbProduct === null) {
        throw new HttpException(
          `Error: bad arguments, productId: ${productId} does not exist`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const groups = await queryRunner.manager
        .createQueryBuilder(ProductGroupModel, 'group')
        .where('group.productId = :productId', { productId: productId })
        .getMany();

      groupsDetails = groups.map((modelGroup) => {
        return {
          id: modelGroup.id,
          name: modelGroup.name,
          amount: modelGroup.amount,
          salePrice: modelGroup.salePrice,
        };
      });
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
    return groupsDetails;
  }

  async patchGroup(
    group: GroupPatchRequestDto,
    groupId: number,
  ): Promise<GroupDetail> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    let groupDetail: GroupDetail;
    try {
      if (group.amount <= 0) {
        throw new HttpException(
          'Error: bad arguments, amount can not be 0 or less',
          HttpStatus.BAD_REQUEST,
        );
      }

      const dbGroup = await queryRunner.manager.findOneBy(ProductGroupModel, {
        id: groupId,
      });
      if (dbGroup === null) {
        throw new HttpException(
          `Error: bad arguments, groupId:${groupId} does not exist`,
          HttpStatus.BAD_REQUEST,
        );
      }

      dbGroup.amount = group.amount;
      dbGroup.name = group.name;
      dbGroup.salePrice = group.salePrice;

      const groupModel = await queryRunner.manager.save(dbGroup);

      groupDetail = {
        id: groupModel.id,
        name: groupModel.name,
        salePrice: groupModel.salePrice,
        amount: groupModel.amount,
      };
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
    return groupDetail;
  }
}
