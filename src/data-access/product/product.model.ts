import { ApiResponseProperty } from '@nestjs/swagger';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ProductGroupModel } from '../productGroup/productGroup.model';

@Entity({ name: 'product' })
export class ProductModel extends BaseEntity {
  @ApiResponseProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiResponseProperty()
  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @ApiResponseProperty()
  @Index()
  @Column({ name: 'tax', type: 'decimal' })
  tax: number;

  @ApiResponseProperty()
  @Column({ name: 'barcode', type: 'varchar', unique: true })
  barcode: string;

  @OneToMany(
    () => ProductGroupModel,
    (productGroupModel) => productGroupModel.product,
    { cascade: true },
  )
  groups: ProductGroupModel[];

  @ApiResponseProperty()
  @CreateDateColumn({ name: 'createdDate', type: 'timestamptz' })
  createdDate!: Date;

  @ApiResponseProperty()
  @UpdateDateColumn({ name: 'updatedDate', type: 'timestamptz' })
  updatedDate!: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamptz' })
  deletedAt!: Date;
}
