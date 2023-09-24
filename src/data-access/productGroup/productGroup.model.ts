import { ApiResponseProperty } from '@nestjs/swagger';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { ProductModel } from '../product/product.model';

@Entity({ name: 'productGroup' })
export class ProductGroupModel extends BaseEntity {
  @ApiResponseProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiResponseProperty()
  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @ApiResponseProperty()
  @Column({ name: 'amount', type: 'int' })
  amount: number;

  @ApiResponseProperty()
  @Column({ name: 'salePrice', type: 'decimal' })
  salePrice: number;

  @ManyToOne(() => ProductModel, (product) => product.groups, {
    nullable: false,
  })
  product: ProductModel;

  @ApiResponseProperty()
  @CreateDateColumn({ name: 'createdDate', type: 'timestamptz' })
  createdDate!: Date;

  @ApiResponseProperty()
  @UpdateDateColumn({ name: 'updatedDate', type: 'timestamptz' })
  updatedDate!: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamptz' })
  deletedAt!: Date;
}
