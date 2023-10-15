import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Injectable,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductGroupPostRequestDto } from './dto/product.request';
import { ApiExceptionFilter } from 'src/error-handling/api-error-handling';
import { GroupUseCase } from 'src/domain/use-case/group';
import {
  GroupPatchRequest,
  GroupPatchRequestDto,
  GroupRequest,
} from './dto/group.request';

@ApiTags('Group')
@Controller('group')
@Injectable()
@UseFilters(ApiExceptionFilter)
export class GroupController {
  constructor(private readonly groupUseCase: GroupUseCase) {}

  @Post(':productId')
  @ApiParam({
    name: 'productId',
    required: true,
    type: Number,
  })
  @ApiBody({
    type: String,
    description: 'Body for create group',
    required: true,
    examples: {
      a: {
        value: {
          name: 'unidad',
          amount: 1,
          salePrice: 1000,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns group',
  })
  async createGroup(
    @Body() body: ProductGroupPostRequestDto,
    @Param() params: GroupRequest,
  ) {
    return this.groupUseCase.createGroup(body, params.productId);
  }

  @Get(':productId')
  @ApiParam({
    name: 'productId',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns product groups',
  })
  async getGroups(@Param() params: GroupRequest) {
    return this.groupUseCase.getProductGroups(params.productId);
  }

  @Patch(':groupId')
  @ApiParam({
    name: 'groupId',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns group updated',
  })
  async updateGroup(
    @Body() body: GroupPatchRequestDto,
    @Param() params: GroupPatchRequest,
  ) {
    return this.groupUseCase.patchGroup(body, params.groupId);
  }
}
