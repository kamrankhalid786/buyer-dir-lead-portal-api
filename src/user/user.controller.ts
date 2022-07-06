import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseFilters,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from '../core/filter/exception';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const data = this.userService.create(createUserDto);

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
    const data = await this.userService.findAll(options);
    const total_records = await this.userService.count();

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

  @Get('/loan-officers')
  async findAllLoanOfficers() {
    const data = await this.userService.findAllLoanOfficers();

    return {
      status: 200,
      message: 'Success',
      result: data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.userService.findOne(id);
    return {
      status: 200,
      message: 'Success',
      result: data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.userService.update(id, updateUserDto);
    return {
      status: 200,
      message: 'Success',
      result: data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.userService.remove(id);

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
