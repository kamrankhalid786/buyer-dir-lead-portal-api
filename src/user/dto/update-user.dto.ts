import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { UniqueValidator } from 'src/core/decorators/unique.user.decorator';

export class UpdateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  // @Validate(UniqueValidator, ['email'], { message: 'email already taken' })
  email: string;

  phone: string;

  @IsNotEmpty()
  userRole: string;
}
