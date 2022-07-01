import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './roles.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  create(dto: CreateRoleDto): Promise<Role> {
    const createRole = new this.roleModel(dto);
    return createRole.save();
  }

  async findAll(options): Promise<Role[]> {
    const sort = options.sort;
    const page: number = options.page || 1;
    const limit = options.limit || 10;

    const data = this.roleModel
      .find({}, { name: 1, description: 1, createdAt: 1 }, { sort })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return data;
  }

  async count() {
    return this.roleModel.countDocuments();
  }

  async findOne(id: number) {
    return this.roleModel.findById(id, {
      name: 1,
      description: 1,
      createdAt: 1,
    });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.roleModel.findByIdAndUpdate(id, updateRoleDto, { new: true });
  }

  remove(id: number) {
    return this.roleModel.findByIdAndRemove(id);
  }
}
