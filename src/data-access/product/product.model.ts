import { ApiResponseProperty } from '@nestjs/swagger';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'product' })
export class ProductModel extends BaseEntity {
  @ApiResponseProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiResponseProperty()
  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @ApiResponseProperty()
  @Column({ name: 'tax', type: 'decimal' })
  tax: number;

  @ApiResponseProperty()
  @Column({ name: 'barcode', type: 'varchar' })
  barcode: string;

  @ApiResponseProperty()
  @CreateDateColumn({ name: 'createdDate', type: 'timestamptz' })
  createdDate!: Date;

  @ApiResponseProperty()
  @UpdateDateColumn({ name: 'updatedDate', type: 'timestamptz' })
  updatedDate!: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamptz' })
  deletedAt!: Date;
}
