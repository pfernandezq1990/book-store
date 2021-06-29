import { IsNotEmpty } from 'class-validator';
import { RoleType } from 'src/modules/role/role.type.enum';
import { UserDetails } from '../entities';

export class UserDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  roles: RoleType[];

  @IsNotEmpty()
  details: UserDetails;
}
