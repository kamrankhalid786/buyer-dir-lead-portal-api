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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    // , @Req() req
    return this.rolesService.create(createRoleDto);
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
    const data = await this.rolesService.findAll(options);
    const total_records = await this.rolesService.count();

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
  async findOne(@Param('id') id: number) {
    const data = await this.rolesService.findOne(id);
    return {
      status: 200,
      message: 'Success',
      result: data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    const data = await this.rolesService.update(id, updateRoleDto);
    return {
      status: 200,
      message: 'Success',
      result: data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.rolesService.remove(id);

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
