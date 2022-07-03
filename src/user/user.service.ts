import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createUser = new this.userModel(createUserDto);
    return await createUser.save();
  }

  async findAll(options): Promise<User[]> {
    const sort = options.sort;
    const page: number = options.page || 1;
    const limit = options.limit || 10;

    const data = this.userModel
      .find({}, {}, { sort })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return data;
  }

  async count() {
    return this.userModel.countDocuments();
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async remove(id: number) {
    const filter = { _id: id };
    const deleted = await this.userModel.softDelete(filter);
    return deleted;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
}
