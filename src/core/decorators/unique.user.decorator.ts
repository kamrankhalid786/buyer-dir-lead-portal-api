import { getModelToken, InjectModel } from '@nestjs/mongoose';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Model } from 'mongoose';
import { User } from '../../user/user.schema';

@ValidatorConstraint({ name: 'IsUniqueUser', async: true })
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async validate(value: any, args: ValidationArguments) {
    const filter = {};

    filter[args.property] = value;
    const count = await this.userModel.count(filter);
    return !count;
  }

  defaultMessage(args: ValidationArguments) {
    return '$(value) is already taken';
  }
}
