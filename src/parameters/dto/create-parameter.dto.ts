import { IsNotEmpty } from 'class-validator';

export class CreateParameterDto {
  @IsNotEmpty()
  name: string;

  dividend: number;
  divisor: number;
  multiplier: number;

  @IsNotEmpty()
  roleId: string;
}
