import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ProductGroupPostRequestDto {
  @ApiProperty({
    description: 'Should be a name',
    required: true,
    type: String,
    name: 'name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Should be a amount',
    required: true,
    type: Number,
    name: 'amount',
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Should be a sale price',
    required: true,
    type: Number,
    name: 'salePrice',
  })
  @IsNumber()
  @IsNotEmpty()
  salePrice: number;
}

export class ProductPostRequestDto {
  @ApiProperty({
    description: 'Should be a name',
    required: true,
    type: String,
    name: 'name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Should be a tax',
    required: true,
    type: Number,
    name: 'tax',
  })
  @IsNumber()
  @IsNotEmpty()
  tax: number;

  @ApiProperty({
    description: 'Should be a bar code',
    required: true,
    type: String,
    name: 'barcode',
  })
  @IsString()
  @IsNotEmpty()
  barcode: string;

  @ApiProperty({
    description: 'Should be an object with assetInfo defined',
    required: true,
    type: ProductGroupPostRequestDto,
    name: 'groups',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductGroupPostRequestDto)
  groups: ProductGroupPostRequestDto[];
}

export class ProductPatchRequestDto {
  @ApiProperty({
    description: 'Should be a name',
    required: true,
    type: String,
    name: 'name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Should be a tax',
    required: true,
    type: Number,
    name: 'tax',
  })
  @IsNumber()
  @IsNotEmpty()
  tax: number;

  @ApiProperty({
    description: 'Should be a bar code',
    required: true,
    type: String,
    name: 'barcode',
  })
  @IsString()
  @IsNotEmpty()
  barcode: string;
}

export class ProductPathRequest {
  @IsNotEmpty()
  productId: number;
}
