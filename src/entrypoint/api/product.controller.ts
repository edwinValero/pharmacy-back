import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Injectable,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ProductPatchRequestDto,
  ProductPathRequest,
  ProductPostRequestDto,
} from './dto/product.request';
import { ProductUseCase } from 'src/domain/use-case/product';
import { ApiExceptionFilter } from 'src/error-handling/api-error-handling';

@ApiTags('Product')
@Controller('product')
@Injectable()
@UseFilters(ApiExceptionFilter)
export class ProductController {
  constructor(private readonly productUseCase: ProductUseCase) {}

  @Post()
  @ApiBody({
    type: String,
    description: 'Body for create product and its groups',
    required: true,
    examples: {
      a: {
        value: {
          name: 'test',
          tax: 19,
          barcode: '12323122131',
          groups: [
            {
              name: 'unidad',
              amount: 1,
              salePrice: 1000,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns product and groups',
  })
  async createProduct(@Body() body: ProductPostRequestDto) {
    return this.productUseCase.createProductWithGroups(body);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns products and groups',
  })
  async getProducts(
    @Query('limit') limit: number = 100,
    @Query('offset') offset: number = 0,
  ) {
    return this.productUseCase.getProducts(limit, offset);
  }

  @Patch(':productId')
  @ApiParam({
    name: 'productId',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns product updated',
  })
  async updateProduct(
    @Body() body: ProductPatchRequestDto,
    @Param() params: ProductPathRequest,
  ) {
    return this.productUseCase.patchProduct(body, params.productId);
  }
}
