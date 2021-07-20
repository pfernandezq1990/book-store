import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, isString, IsString } from 'class-validator';

export class SingupDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

}

