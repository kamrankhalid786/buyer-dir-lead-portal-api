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
} from '@nestjs/common';
import { ParametersService } from './parameters.service';
import { CreateParameterDto } from './dto/create-parameter.dto';
import { UpdateParameterDto } from './dto/update-parameter.dto';

@Controller('parameters')
export class ParametersController {
  constructor(private readonly parametersService: ParametersService) {}

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
  remove(@Param('id') id: string) {
    return this.parametersService.remove(+id);
  }
}
