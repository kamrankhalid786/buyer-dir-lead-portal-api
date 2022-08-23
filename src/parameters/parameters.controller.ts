import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ParametersService } from './parameters.service';
import { CreateParameterDto } from './dto/create-parameter.dto';
import { UpdateParameterDto } from './dto/update-parameter.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { RoleBaseParameterDto } from './types/role-base-parameters.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('parameters')
export class ParametersController {
  constructor(
    private readonly parametersService: ParametersService,
    private readonly logger: Logger,
  ) {}

  @Post()
  async create(@Body() createParameterDto: CreateParameterDto) {
    const data = await this.parametersService.create(createParameterDto);
    return {
      status: 201,
      message: 'Success',
      result: data,
      meta: {},
    };
  }

  @Get()
  async findAll(@Query('sort') sortBy, @Req() req) {
    const page: number = req.query.page || 1;
    const limit: number = req.query.perPage || 10;

    let order_by = -1;
    const sort_parameter = req.query.sort || 'descending-createdAt';
    const sort_with_order = sort_parameter.split('-');

    if (sort_with_order[0] === 'ascending') {
      order_by = 1;
    }

    const sort = {};
    sort[sort_with_order[1]] = order_by;
    const options = {
      page,
      limit,
      sort,
    };

    const data = await this.parametersService.findAll(options);
    const total_records = await this.parametersService.count();

    return {
      status: 200,
      message: 'Success',
      result: data,
      meta: {
        total_records: total_records,
        sort_by: sortBy,
      },
    };
  }

  @Get('/role-base-parameters')
  async findRoleBaseParameters(
    @Query() query_sting: RoleBaseParameterDto,
    @Req() req,
  ) {
    try {
      const userRoleId = req.user.userRole;

      const data = await this.parametersService.findRoleBaseParameters(
        query_sting,
        userRoleId,
      );

      return {
        status: 200,
        message: 'Success',
        result: data,
      };
    } catch (error) {
      this.logger.error('FIND-ROLE-BASE-PARAMETER-ERROR', error);
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parametersService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateParameterDto: UpdateParameterDto,
  ) {
    const data = await this.parametersService.update(id, updateParameterDto);
    return {
      status: 200,
      message: 'Success',
      result: data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.parametersService.remove(id);

    if (data) {
      return {
        status: 200,
        message: 'Success',
        result: data,
      };
    }

    return {
      status: 404,
      message: 'Not Found',
    };
  }
}
