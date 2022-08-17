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
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Logger,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { ListingDto } from './dto/listing.dto';
import { Cache } from 'cache-manager';

@UseGuards(AuthGuard('jwt'))
@Controller('contact')
export class ContactController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly contactService: ContactService,
    private readonly logger: Logger,
  ) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    try {
      this.logger.log('CREATE-CONTACT', createContactDto);
      const data = await this.contactService.create(createContactDto);
      await this.cacheManager.set('contact', data);

      return {
        status: 201,
        message: 'Success',
        result: data,
        meta: {},
      };
    } catch (error) {
      this.logger.error('CREATE-CONTACT-ERROR', error);
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }

  @Post('/import')
  @UseInterceptors(FileInterceptor('contactFile'))
  async importCsv(@UploadedFile() file: Express.Multer.File, @Body() body) {
    const data = await this.contactService.importCsv(file, body);

    return {
      status: 201,
      message: 'Success',
      result: data,
      meta: {},
    };
  }

  @Get()
  async findAll(@Query() dto: ListingDto, @Req() req) {
    const contact_cache = await this.cacheManager.get('contact');
    console.log(contact_cache);
    const user = req.user;

    let { page, sort, perPage: limit } = dto;
    page = page || 1;
    limit = limit || 10;

    let order_by = -1;
    sort = sort || 'descending-createdAt';
    const sort_with_order = sort.split('-');

    if (sort_with_order[0] === 'ascending') {
      order_by = 1;
    }

    const sorting = {};
    sorting[sort_with_order[1]] = order_by;
    const options = {
      page,
      limit,
      sort: sorting,
      user_id: user._id,
    };

    const data = await this.contactService.findAll(options);
    const total_records = await this.contactService.count();

    return {
      status: 200,
      message: 'Success',
      result: data,
      meta: {
        total_records: total_records,
        sort_by: sort,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
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
