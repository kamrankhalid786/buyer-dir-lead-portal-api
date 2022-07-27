import { IsDecimal, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateParameterDto {
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    type: 'number',
    format: 'double',
    description: 'The value of the parameter',
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  dividend: number;

  @ApiPropertyOptional({
    description: 'Divisor',
    required: false,
  })
  @IsOptional({
    message: 'Divisor is required',
  })
  @IsDecimal()
  divisor: number;

  @ApiPropertyOptional({
    description: 'Multiplier',
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  multiplier: number;

  @IsNotEmpty()
  roleId: string;
}
