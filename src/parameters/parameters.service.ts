import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateParameterDto } from './dto/create-parameter.dto';
import { UpdateParameterDto } from './dto/update-parameter.dto';
import { Parameter, ParameterDocument } from './parameters.schema';
import { Model } from 'mongoose';

@Injectable()
export class ParametersService {
  constructor(
    @InjectModel(Parameter.name)
    private parameterModel: Model<ParameterDocument>,
  ) {}

  async create(createParameterDto: CreateParameterDto): Promise<Parameter> {
    const createParameter = await new this.parameterModel(createParameterDto);
    return await createParameter.save();
  }

  findAll(options): Promise<Parameter[]> {
    const sort = options.sort;
    const page: number = options.page || 1;
    const limit = options.limit || 10;

    const data = this.parameterModel
      .find({}, {}, { sort })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'roleId',
        select: 'name',
        options: { strictPopulate: false },
      })
      .exec();

    return data;
  }

  async count() {
    return await this.parameterModel.countDocuments();
  }

  findOne(id: number) {
    return `This action returns a #${id} parameter`;
  }

  update(id: number, updateParameterDto: UpdateParameterDto) {
    return `This action updates a #${id} parameter`;
  }

  remove(id: number) {
    return `This action removes a #${id} parameter`;
  }
}
