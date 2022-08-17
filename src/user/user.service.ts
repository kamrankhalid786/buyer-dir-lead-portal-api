import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/auth/login.dto';
import { Payload } from './types/payload';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltOrRounds = 10;
    createUserDto.password = await bcrypt.hashSync(
      createUserDto.password,
      saltOrRounds,
    );

    createUserDto.email = createUserDto.email.toLowerCase();

    const createUser = await new this.userModel(createUserDto);
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
      .populate({
        path: 'userRole',
        select: 'name',
        options: { strictPopulate: false },
      })
      .exec();

    return data;
  }

  async findAllLoanOfficers(): Promise<User[]> {
    return await this.userModel.find(
      {
        userRole: { $eq: '62cf363f81875f57191b1c8e' },
      },
      { _id: 1, firstName: 1, lastName: 1 },
      {},
    );
  }

  async count() {
    return this.userModel.countDocuments();
  }

  async findOne(id: string) {
    return await this.userModel.findById(id, {});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const email = updateUserDto.email;

    // Check if new email and old email are same
    const user = await this.userModel.findById(id);
    if (user.email === email) {
      return await this.userModel.findByIdAndUpdate(id, updateUserDto);
    }

    // Check unique validation
    const record_count = await this.findByEmail(email);
    if (record_count) {
      throw new HttpException('Email already exists', 400);
    }

    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
  }

  // TODO: Implement soft delete
  async remove(id: number) {
    // const filter = { _id: id };
    const deleted = await this.userModel.findByIdAndDelete(id);
    return deleted;
  }

  async findByEmail(email: string) {
    const userEmail = email.toLowerCase();
    return await this.userModel.findOne({ email: userEmail });
  }

  async findByLogin(UserDTO: LoginDTO) {
    const { email, password } = UserDTO;
    const user = await this.userModel.findOne({
      email: email.toLowerCase(),
    });
    if (!user) {
      throw new HttpException('user does not exists', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  sanitizeUser(user: User) {
    delete user['password'];

    return user;
  }

  async findByPayload(payload: Payload) {
    const user = await this.userModel.findOne(
      { email: payload },
      { _id: 1, firstName: 1, lastName: 1, email: 1, userRole: 1 },
    );
    return user;
  }
}
