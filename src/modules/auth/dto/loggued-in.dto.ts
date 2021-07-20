import { Exclude, Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { ReadUserDto } from '../../user/dto/read-user.dto';

@Exclude()
export class LogguedInDto {
  @Expose()
  @IsString()
  token: string;

  @Expose()
  @Type(() => ReadUserDto)
  user: ReadUserDto;

  @Expose()
  @IsString()
  message: string;

  @Expose()
  @IsString()
  status: string;
}
