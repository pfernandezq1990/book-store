import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class UpdateUserDto {
  @Expose()
  @IsString()
  readonly username: string;
}
