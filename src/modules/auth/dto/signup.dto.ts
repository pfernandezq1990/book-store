import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { ReadUserDto } from "../../user/dto/read-user.dto";

export class SignupDto {
    @Type(() => ReadUserDto)
    user: ReadUserDto;

    @IsNotEmpty()
    @IsString()
    message: string;

    @IsNotEmpty()
    @IsString()
    status: string;
}