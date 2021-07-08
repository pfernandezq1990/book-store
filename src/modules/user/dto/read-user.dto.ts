import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { ReadRoleDto } from '../../role/dtos/read-role.dto';
import { ReadUserDetailsDto } from './read-details.dto';

@Exclude()
export class ReadUserDto {
  @Expose()
  @IsNumber()
  readonly userId: number;

  @Expose()
  @IsString()
  readonly email: string;

  @Expose()
  @IsString()
  readonly username: string;

  @Expose()
  @Type((type) => ReadUserDetailsDto)
  readonly details: ReadUserDetailsDto;

  @Expose()
  @Type((type) => ReadRoleDto)
  readonly roles: ReadRoleDto[];
}
