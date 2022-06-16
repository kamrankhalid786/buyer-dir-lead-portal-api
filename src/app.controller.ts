import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { MainDto } from './core/main.dto';

@ApiBearerAuth()
@ApiTags('Main')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get main data' })
  @ApiResponse({ status: 200, description: 'Successful' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  postHello(@Body() data: MainDto) {
    return this.appService.postHello(data);
  }
}
