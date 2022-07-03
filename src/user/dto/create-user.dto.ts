import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { Match } from 'src/core/decorators/match.decorator';
import { UniqueValidator } from 'src/core/decorators/unique.user.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @Validate(UniqueValidator, ['email'], { message: 'email already taken' })
  email: string;
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @Match('password')
  confirmPassword: string;

  @IsNotEmpty()
  userRole: string;
}
