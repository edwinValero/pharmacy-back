import {
  Body,
  Controller,
  HttpStatus,
  Injectable,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductPostRequestDto } from './dto/product.request';
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
    debugger;
    return this.productUseCase.createProductWithGroups(body);
  }
}
