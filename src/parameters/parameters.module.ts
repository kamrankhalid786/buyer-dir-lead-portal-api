import { Module, Logger } from '@nestjs/common';
import { ParametersService } from './parameters.service';
import { ParametersController } from './parameters.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ParameterSchema } from './parameters.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Parameter', schema: ParameterSchema }]),
  ],
  controllers: [ParametersController],
  providers: [ParametersService, Logger],
})
export class ParametersModule {}
