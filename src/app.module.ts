import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionOptions } from './data-access/connection-option';
import { ProductGroupModel, ProductModel } from './data-access';
import { ProductController } from './entrypoint/api/product.controller';
import { ProductUseCase } from './domain/use-case/product';
import { ProductRepository } from './data-access/product/product.repository';
import { ProductGroupRepository } from './data-access/productGroup/productGroup.repository';
import { GroupController } from './entrypoint/api/group.controller';
import { GroupUseCase } from './domain/use-case/group';
import { AuthzModule } from './authz/authz.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(connectionOptions),
    TypeOrmModule.forFeature([ProductModel, ProductGroupModel]),
    AuthzModule,
  ],
  controllers: [ProductController, GroupController],
  providers: [
    ProductUseCase,
    ProductRepository,
    ProductGroupRepository,
    GroupUseCase,
  ],
})
export class AppModule {}
