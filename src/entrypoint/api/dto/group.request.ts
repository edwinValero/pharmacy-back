import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GroupRequest {
  @IsNotEmpty()
  productId: number;
}

export class GroupPatchRequest {
  @IsNotEmpty()
  groupId: number;
}

export class GroupPatchRequestDto {
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
    description: 'Should be a amount integer bigger than 0',
    required: true,
    type: Number,
    name: 'amount',
  })
  @IsInt()
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
