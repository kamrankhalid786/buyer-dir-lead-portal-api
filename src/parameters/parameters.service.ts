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

  async findRoleBaseParameters(querySting, userRoleId): Promise<Parameter[]> {
    return await this.parameterModel.find({ roleId: userRoleId });
  }

  async count() {
    return await this.parameterModel.countDocuments();
  }

  findOne(id: number) {
    return `This action returns a #${id} parameter`;
  }

  async update(id: number, updateParameterDto: UpdateParameterDto) {
    const data = await this.parameterModel
      .findByIdAndUpdate(id, updateParameterDto, {
        new: true,
      })
      .populate({
        path: 'roleId',
        select: 'name',
        options: { strictPopulate: false },
      })
      .exec();

    return data;
  }

  async remove(id: number) {
    const deleted = await this.parameterModel.findByIdAndDelete(id);
    return deleted;
  }
}
