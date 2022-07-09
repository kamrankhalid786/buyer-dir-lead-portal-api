import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    const data = await this.contactService.create(createContactDto);

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
    const data = await this.contactService.findAll(options);
    const total_records = await this.contactService.count();

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
    const data = await this.contactService.findOne(id);

    return {
      status: 200,
      message: 'Success',
      result: data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    const data = await this.contactService.update(id, updateContactDto);
    return {
      status: 200,
      message: 'Success',
      result: data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.contactService.remove(id);

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
