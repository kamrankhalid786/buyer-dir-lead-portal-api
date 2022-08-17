import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ListingDto {
  @IsNotEmpty()
  sort: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  perPage: number;
}
