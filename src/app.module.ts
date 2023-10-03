import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionOptions } from './data-access/connection-option';
import { ProductGroupModel, ProductModel } from './data-access';
import { ProductController } from './entrypoint/api/product.controllet';
import { ProductUseCase } from './domain/use-case/product';
import { ProductRepository } from './data-access/product/product.repository';
import { ProductGroupRepository } from './data-access/productGroup/productGroup.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot(connectionOptions),
    TypeOrmModule.forFeature([ProductModel, ProductGroupModel]),
  ],
  controllers: [ProductController],
  providers: [ProductUseCase, ProductRepository, ProductGroupRepository],
})
export class AppModule {}
