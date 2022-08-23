import { IsNotEmpty } from 'class-validator';

export class RoleBaseParameterDto {
  @IsNotEmpty()
  user_id: string;
}
