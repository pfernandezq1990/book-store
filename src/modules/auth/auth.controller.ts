import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogguedInDto, SinginDto, SingupDto } from './dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  //  Metodo para registrar un usuario
  @Post('/singup')
  @UsePipes(ValidationPipe)
  singup(@Body() singupDto: SingupDto): Promise<SignupDto> {
    return this._authService.singup(singupDto);
  }

  //  Metodo para loguear a un usuario
  @Post('/singin')
  @UsePipes(ValidationPipe)
  singin(@Body() singinDto: SinginDto): Promise<LogguedInDto> {
    return this._authService.singin(singinDto);
  }
}
